import React, { Children } from 'react';
import { raise } from '@vx/drag';
import { Zoom } from '@vx/zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../assets/App.css';

import DBService from '../services/DBService';
import Node from './Node';

const initialTransformZoom = {
    scaleX: 3/4,
    scaleY: 3/4,
    translateX: 100,
    translateY: 100,
    skewX: 0,
    skewY: 0,
};

export default class WorkArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            projectId: 0,
            draggableItems: [],
            isDirtyDB: false,
            isDirtyDOM: false,
            nodeCtrlHidden: true,
            selectedNodeId: 0,
            listeners: {},
            edges: {}
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragMove = this.handleDragMove.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.toggleNodeCtrl = this.toggleNodeCtrl.bind(this);
        this.toggleNodeOptions = this.toggleNodeOptions.bind(this);
        this.handleEdgeCtrlDragEnd = this.handleEdgeCtrlDragEnd.bind(this);
        this.handleOnEdgeCreated = this.handleOnEdgeCreated.bind(this);
        this.handleOnEdgeDelete = this.handleOnEdgeDelete.bind(this);
        this.checkGraphCycleExists = this.checkGraphCycleExists.bind(this);
    }
    
    componentDidUpdate() {
        const id = parseInt(this.props.projectId);
        if (this.state.projectId !== id || this.state.isDirtyDB) {
            DBService.nodes.where('projectId').equals(id).toArray().then(nodes => {
                this.setState({
                    projectId: id,
                    draggableItems: nodes,
                    isDirtyDB: false
                });
            }).catch(error => {
                console.error(error.stack || error);
            });
        }

        if (this.state.isDirtyDOM) {
            // Initialize the edge positions here
            this.state.draggableItems.forEach(item => {
                this.handleDragMove(item.id, item.initialX, item.initialY);
            });

            this.setState({isDirtyDOM: false});
        }
    }

    handleDragStart(i) {
        this.setState(state => ({
            draggableItems: raise(state.draggableItems, i)
        }));
    }

    handleDragMove(id, dx, dy) {
        // How will we pass this to the edge itself?
        let edges = this.state.edges[id];
        if (edges && edges.length > 0) {
            edges.forEach(edge => {
                edge.callable(dx, dy);
            });
        }
    }

    handleDragEnd(i, dx, dy) {
        let items = [...this.state.draggableItems];
        let item = {...items[i]};
        
        // Save changes immediately to db
        DBService.nodes.update(item.id, {initialX: dx, initialY: dy}).then(updated => {
            if (updated)
                console.log("updated!");
            this.setState({isDirtyDB: true});
            // Show a toast or an out of the way notif for changes saved
        });
    }

    toggleNodeCtrl() {
        this.setState(state => ({nodeCtrlHidden: !state.nodeCtrlHidden}));
    }

    toggleNodeOptions(i) {
        if (this.state.selectedNodeId === i)
            this.setState({selectedNodeId: 0});
        else
            this.setState({selectedNodeId: i});
    }

    handleEdgeCtrlDragEnd(event, item) {
        // TODO: Check if clientX and clientY from events work
        let x = event.clientX;
        let y = event.clientY;

        let elements = document.elementsFromPoint(x, y);
        let element = elements.find(e => e.getAttribute('data-name'));
        if (!element)
            return;

        let name = element.getAttribute('data-name');
        if (name === undefined || name === null)
            return null;

        if (name !== `node-${item.id}`) {
            // register this new id to the connected array of this item
            let nodes = this.state.draggableItems;

            let otherId = parseInt(name.substring(5));
            let otherConnected = nodes.find(n => n.id === otherId).connectedTo;

            // get current connected array from db
            // Note: A get here from the db shouldn't really happen, let the
            // update lifecycle handle the getting from database, this is supposed
            // to trust the nodes that the state currently has
            let node = nodes.find(n => n.id === item.id);
                
            let connected = node.connectedTo;
            let index = connected.indexOf(otherId);

            if (index < 0) {
                // Check if adding this node creates a cycle in the graph
                if (this.checkGraphCycleExists(otherConnected, item.id))
                    return;

                connected.push(otherId); // add id if not found
            }

            DBService.nodes.update(item.id, {connectedTo: connected}).then(updated => {
                if (updated)
                    console.log("added connected to");
                this.setState({isDirtyDB: true});
            });
        }
    }

    // Starting arr is the connectedTo arr of the node
    // the user wants to connect to
    // The id is the id of the node the user is
    // connecting from
    checkGraphCycleExists(connectedTo, id) {
        if (connectedTo.some(e => e === id))
            return true;

        var result = false;

        for (var i = 0; i < connectedTo.length; i++) {
            let e = connectedTo[i];
            // Get the connectedTo array of the node with e as the id
            let newArr = this.state.draggableItems.find(n => n.id === e).connectedTo;
            result = this.checkGraphCycleExists(newArr, id);
            if (result)
                break;
        }

        return result;
    }

    handleOnEdgeCreated(fromId, toId, callable) {
        let edges = this.state.edges;
        if(!edges[fromId])
            edges[fromId] = [];

        let edge = {
            to: toId,
            callable: callable
        };
        edges[fromId].push(edge);
        this.setState({edges: edges, isDirtyDOM: true});
    }

    handleOnEdgeDelete(itemId, otherId) {
        let connected = this.state.draggableItems.find(n => n.id === itemId).connectedTo;
        let index = connected.indexOf(otherId);
        if (index < 0)
            return;

        connected.splice(index, 1); // remove if in array already
        // Also remove the callables from the edges array
        let edges = this.state.edges;
        edges[itemId].removeIf(edge => edge.to === otherId);
        edges[otherId].removeIf(edge => edge.to === itemId);

        this.setState({edges: edges});

        DBService.nodes.update(itemId, {connectedTo: connected}).then(updated => {
            if (updated)
                console.log("added connected to");
            this.setState({isDirtyDB: true});
        });
    }

    render() {
        if (this.state.draggableItems.length === 0)
            return null;

        let width = this.props.width;
        let height = this.props.height;
        return(
            <>
                <Zoom width={width} 
                    height={height}
                    scaleXMin={1/4}
                    scaleXMax={2}
                    scaleYMin={1/4}
                    scaleYMax={2}
                    transformMatrix={initialTransformZoom}>
                    {zoom => (
                        <div className="relative bg-gray-300">
                            <svg width={width} height={height} style={{cursor: zoom.isDragging ? 'grabbing' : 'grab' }}>
                                <defs>
                                    <filter id="nodeShadow" x="-50%" y="-50%" width="160%" height="160%">
                                        <feOffset result="offOut" in="SourceGraphic" dy="4" />
                                        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="4" />
                                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                                    </filter>
                                </defs>
                                <rect width={width}
                                      height={height}
                                      fill="transparent"
                                      onTouchStart={zoom.dragStart}
                                      onTouchMove={zoom.dragMove}
                                      onTouchEnd={() => {
                                          this.toggleNodeOptions(0);
                                          zoom.dragEnd();
                                      }}
                                      onMouseDown={zoom.dragStart}
                                      onMouseMove={zoom.dragMove}
                                      onMouseUp={() => {
                                          this.toggleNodeOptions(0);
                                          zoom.dragEnd();
                                      }}
                                      onMouseLeave={() => {
                                          if (zoom.isDragging) zoom.dragEnd();
                                      }} />
                                <g name="node-root"
                                   transform={zoom.toString()}>
                                    {this.state.draggableItems.map((item, i) => (
                                        <g key={`${item.id}`} >
                                            {item.connectedTo.map(id => (
                                                <EdgeStart key={`edge-${item.id}-${id}`} 
                                                           changePosCallable={callable => {
                                                               this.handleOnEdgeCreated(item.id, id, callable); 
                                                           }}>
                                                    {({startDx, startDy}) => (
                                                        <EdgeEnd changePosCallable={callable => {
                                                            this.handleOnEdgeCreated(id, item.id, callable); 
                                                        }}>
                                                            {({endDx, endDy}) => (
                                                                <Edge startDx={startDx}
                                                                      startDy={startDy}
                                                                      endDx={endDx}
                                                                      endDy={endDy}
                                                                      handleOnClick={() => this.handleOnEdgeDelete(item.id, id)}>
                                                                    {({midPointX, midPointY, isHovered}) => (
                                                                        <foreignObject visibility={isHovered ? 'visible' : 'hidden'}
                                                                                       x={midPointX - 15}
                                                                                       y={midPointY - 10}
                                                                                       width="30"
                                                                                       height="20"
                                                                                       className="pointer-events-none">
                                                                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                                                                <FontAwesomeIcon className="text-gray-300" icon="times" />
                                                                            </div>
                                                                        </foreignObject>
                                                                    )}
                                                                </Edge>
                                                            )}
                                                        </EdgeEnd>
                                                    )}
                                                </EdgeStart>
                                            ))}

                                            <Node item={item}
                                                i={i}
                                                width={width}
                                                height={height}
                                                zoom={zoom}
                                                selectedNodeId={this.state.selectedNodeId}
                                                handleDragStart={this.handleDragStart}
                                                handleDragMove={this.handleDragMove}
                                                handleDragEnd={this.handleDragEnd}
                                                handleEdgeCtrlDragEnd={this.handleEdgeCtrlDragEnd}
                                                toggleNodeOptions={this.toggleNodeOptions} />
                                        </g>
                                    ))}
                                </g>
                            </svg>
                            <div className="pin-bot-right absolute pb-4 pr-4 sm:pb-6 sm:pr-6 flex flex-col items-end">
                                <button className="px-2 lg:px-3 py-1 mb-1 rounded text-sm lg:text-xl bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400"
                                        onClick={() => zoom.scale({scaleX: 1.2, scaleY: 1.2})}>
                                    <FontAwesomeIcon icon="plus" />
                                </button>
                                <button className="px-2 lg:px-3 py-1 mb-4 rounded text-sm lg:text-xl bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400"
                                        onClick={() => zoom.scale({scaleX: 0.8, scaleY: 0.8})}>
                                    <FontAwesomeIcon icon="minus" />
                                </button>
                                <button className="px-2 py-1 rounded text-xs lg:text-base select-none bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400" onClick={zoom.reset}>
                                    Reset
                                </button>
                            </div>
                            <div className="pin-bot-left absolute pb-4 pl-4 sm:pb-6 sm:pl-6 flex flex-row items-center">
                                <button className="px-4 py-2 sm:px-6 sm:py-4 z-10 rounded-full shadow-md text-2xl bg-gray-700 hover:bg-gray-900 text-gray-300 hover:text-gray-100" onClick={this.toggleNodeCtrl}>
                                    <FontAwesomeIcon className="shadow-inner" icon="plus" />
                                </button>
                                <div className={`${this.state.nodeCtrlHidden ? 'hidden' : ''} -ml-8 px-4 py-2 sm:pl-12 sm:py-2 rounded-r-lg shadow-md bg-gray-100`}>
                                    <button className="px-5 py-3 rounded-lg shadow font-semibold bg-gray-400">
                                        Node
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Zoom>
                <div className="hidden overlay z-30 bg-gray-900 opacity-25">
                    
                </div>
            </>
        );
    }
}

Array.prototype.removeIf = function(predicate) {
    let i = this.length;
    while (i--) {
        if (predicate(this[i]))
            this.splice(i, 1);
    }
}

class EdgeStart extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            startDx: 0,
            startDy: 0
        };
        
        this.handlePosChanged = this.handlePosChanged.bind(this);
    }

    componentDidMount() {
        this.props.changePosCallable(this.handlePosChanged);
    }

    handlePosChanged(dx, dy) {
        this.setState({startDx: dx, startDy: dy});
    }

    render() {
        const {startDx, startDy} = this.state;
        const {children} = this.props;
        return (
            <>
            {children({ startDx, startDy })}
            </>
        );
    }
}

class EdgeEnd extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            endDx: 0,
            endDy: 0
        };

        this.handlePosChanged = this.handlePosChanged.bind(this);
    }

    componentDidMount() {
        this.props.changePosCallable(this.handlePosChanged);
    }

    handlePosChanged(dx, dy) {
        this.setState({endDx: dx, endDy: dy});
    }

    render() {
        const {endDx, endDy} = this.state;
        const {children} = this.props;
        return (
            <>
            {children({ endDx, endDy })}
            </>
        );
    }
}

class Edge extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isHovered: false
        };

        this.handleOnEnter = this.handleOnEnter.bind(this);
        this.handleOnExit = this.handleOnExit.bind(this);
    }

    handleOnEnter() {
        this.setState({isHovered: true});
    }

    handleOnExit() {
        this.setState({isHovered: false});
    }

    render() {
        let midPointX = ((this.props.endDx - this.props.startDx - 300) / 2) + (this.props.startDx + 300);
        let midPointY = ((this.props.endDy + 50 - this.props.startDy - 50) / 2) + (this.props.startDy + 50);

        const {isHovered} = this.state;
        const {children} = this.props;
        return(
            <>
                <path d={`M${this.props.startDx + 300} ${this.props.startDy + 50} Q${this.props.startDx + 350} ${this.props.startDy + 50} ${midPointX} ${midPointY} Q${this.props.endDx - 50} ${this.props.endDy + 50} ${this.props.endDx} ${this.props.endDy + 50}`} 
                    className="stroke-current text-gray-800 pointer-events-none"
                    strokeWidth="5" 
                    fill="none" />
                <path d={`M${this.props.startDx + 300} ${this.props.startDy + 50} Q${this.props.startDx + 350} ${this.props.startDy + 50} ${midPointX} ${midPointY} Q${this.props.endDx - 50} ${this.props.endDy + 50} ${this.props.endDx} ${this.props.endDy + 50}`} 
                    stroke="transparent"
                    strokeWidth="50" 
                    fill="none" 
                    onMouseEnter={this.handleOnEnter}
                    onMouseLeave={this.handleOnExit}
                    onMouseUp={this.props.handleOnClick}
                    onTouchEnd={this.props.handleOnClick} />
                {children({midPointX, midPointY, isHovered})} 
            </>
        );
    }
}