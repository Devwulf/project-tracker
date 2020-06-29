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
    }

    componentDidMount() {
        const id = parseInt(this.props.projectId);
        DBService.nodes.where('projectId').equals(id).toArray().then(nodes => {
            this.setState({
                projectId: id,
                draggableItems: nodes,
                isDirtyDB: false
            });

            // Initialize the edges here
            this.state.draggableItems.forEach(item => {
                console.log(`${item.id} ${item.initialX} ${item.initialY}`);
                this.handleDragMove(item.id, item.initialX, item.initialY);
            });
        }).catch(error => {
            console.error(error.stack || error);
        });
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
            edges.forEach(callable => {
                callable(dx, dy);
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

    handleEdgeCtrlDragEnd(event, id) {
        // TODO: Check if clientX and clientY from events work
        let x = event.clientX;
        let y = event.clientY;

        let draggable = document.elementFromPoint(x, y);
        let oldDraggableVisibility = draggable.style.visibility;
        draggable.style.visibility = 'hidden';

        let draggableBG = document.elementFromPoint(x, y);
        draggableBG.style.visibility = 'hidden';

        let element = document.elementFromPoint(x, y);

        draggable.style.visibility = oldDraggableVisibility;
        
        if (element.getAttribute('name') !== `node-${id}`) {
            // do something
        }
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
                                                <EdgeStart key={`edge-${item.id}-${id}`} changePosCallable={callable => {
                                                    let edges = this.state.edges;
                                                    if(!edges[item.id])
                                                        edges[item.id] = [];

                                                    edges[item.id].push(callable);
                                                    this.setState({edges: edges});
                                                }}>
                                                    {({startDx, startDy}) => (
                                                        <EdgeEnd changePosCallable={callable => {
                                                            let edges2 = this.state.edges;
                                                            if(!edges2[id])
                                                                edges2[id] = [];
                                                            
                                                            edges2[id].push(callable);
                                                            this.setState({edges: edges2});
                                                        }}>
                                                            {({endDx, endDy}) => (
                                                                <path d={`M${startDx + 300} ${startDy + 50} Q${startDx + 350} ${startDy + 50} ${((endDx - startDx - 300) / 2) + (startDx + 300)} ${((endDy + 50 - startDy - 50) / 2) + (startDy + 50)} Q${endDx - 50} ${endDy + 50} ${endDx} ${endDy + 50}`} 
                                                                      stroke="black" 
                                                                      strokeWidth="5" 
                                                                      fill="none" />
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