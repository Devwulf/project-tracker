import React, { Children } from 'react';
import { raise } from '@vx/drag';
import { Zoom } from '@vx/zoom';
import { localPoint } from '@vx/event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DOMPurify from 'dompurify';

import '../assets/App.css';
import '../assets/content-styles.css';

import DBService from '../services/DBService';
import Node from './Node';
import Modal from './Modal';

const initialTransformZoom = {
    scaleX: 1/2,
    scaleY: 1/2,
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
            edges: {},
            openNodeModal: null,
            nodeModalMode: 0, // 0 for viewing node, 1 for creating node, 2 for editing
            nodeTitle: "", // used for editing
            nodeDescription: ""
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragMove = this.handleDragMove.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleEdgeCtrlDragEnd = this.handleEdgeCtrlDragEnd.bind(this);

        this.handleOnEdgeCreated = this.handleOnEdgeCreated.bind(this);
        this.handleOnEdgeDelete = this.handleOnEdgeDelete.bind(this);

        this.handleOpenViewNode = this.handleOpenViewNode.bind(this);
        this.handleOpenCreateNode = this.handleOpenCreateNode.bind(this);
        this.handleOpenEditNode = this.handleOpenEditNode.bind(this);

        this.handleOnNodeCreate = this.handleOnNodeCreate.bind(this);
        this.handleOnNodeUpdate = this.handleOnNodeUpdate.bind(this);
        this.handleOnNodeDelete = this.handleOnNodeDelete.bind(this);

        this.toggleNodeCtrl = this.toggleNodeCtrl.bind(this);
        this.toggleNodeOptions = this.toggleNodeOptions.bind(this);
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

    handleDragStart(id) {
        // TODO: In chrome, this somehow prevents a child onclick to run
        const array = [].concat(this.state.draggableItems);
        const index = array.indexOfWhen(item => item.id === id);
        const raised = array.splice(index, 1)[0];
        const array2 = array.concat(raised);
        
        this.setState({ draggableItems: array2 });
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

    handleDragEnd(id, dx, dy) {
        
        // Save changes immediately to db
        DBService.nodes.update(id, {initialX: dx, initialY: dy}).then(updated => {
            
            this.setState({isDirtyDB: true});
            // Show a toast or an out of the way notif for changes saved
        });
    }

    handleEdgeCtrlDragEnd(event, item) {
        // TODO: Check if clientX and clientY from events work
        let x = Math.floor(event.clientX || event.changedTouches[0].clientX);
        let y = Math.floor(event.clientY || event.changedTouches[0].clientY);

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
            let other = nodes.find(n => n.id === otherId);
            let connectedFrom = other.connectedFrom;

            // get current connected array from db
            // Note: A get here from the db shouldn't really happen, let the
            // update lifecycle handle the getting from database, this is supposed
            // to trust the nodes that the state currently has
            // TODO: Actually, ignore the above note. If we want this app to be
            // usable by concurrent users, we'll definitely need to update from the
            // db with every action that could change the db that we do. But then,
            // we'll need to first use a different db instead of indexed db
            let node = item; //nodes.find(n => n.id === item.id); // Why are we searching for the item that's passed as an arg?!
            let connectedTo = node.connectedTo;

            let index = connectedTo.indexOf(other.id);

            if (index < 0) {
                // Check if adding this node creates a cycle in the graph
                if (this.checkGraphCycleExists(other.connectedTo, node.id))
                    return;

                connectedTo.push(other.id); // add id if not found
                connectedFrom.push(node.id);
            }

            DBService.nodes.update(node.id, {connectedTo: connectedTo}).then(updated => {
                return DBService.nodes.update(other.id, {connectedFrom: connectedFrom});
            }).then(updated => {
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
        let connectedTo = this.state.draggableItems.find(n => n.id === itemId).connectedTo;
        let connectedFrom = this.state.draggableItems.find(n => n.id === otherId).connectedFrom;
        let indexTo = connectedTo.indexOf(otherId);
        let indexFrom = connectedFrom.indexOf(itemId);
        if (indexTo < 0 || indexFrom < 0)
            return;

        connectedTo.splice(indexTo, 1); // remove if in array already
        connectedFrom.splice(indexFrom, 1);

        // Also remove the callables from the edges array
        let edges = this.state.edges;
        edges[itemId].removeIf(edge => edge.to === otherId);
        edges[otherId].removeIf(edge => edge.to === itemId);

        this.setState({edges: edges});

        DBService.nodes.update(itemId, {connectedTo: connectedTo}).then(updated => {
            return DBService.nodes.update(otherId, {connectedFrom: connectedFrom});
        }).then(updated => {
            this.setState({isDirtyDB: true});
        })
    }

    handleOnNodeCreate(dx, dy, title, description) {
        if (!title || !description)
            return false;

        const projectId = this.state.projectId;

        DBService.addNode(projectId, title, description, dx, dy, [], []).then(() => {
            this.setState({isDirtyDB: true});
        }).catch(error => {
            console.error(error.stack || error);
        });

        return true;
    }

    handleOnNodeUpdate(itemId, title, description) {
        if (!title || !description)
            return false;

        DBService.nodes.update(itemId, {name: title, description: description}).then(() => {
            this.setState({isDirtyDB: true});
        });

        return true;
    }

    handleOnNodeDelete(id) {
        // TODO: Remove all the nodes connected to this
        let node = this.state.draggableItems.find(item => item.id === id);
        // TODO: This is very inefficient, better to track all
        // the changes first then save changes afterwards
        node.connectedTo.forEach(e => {
            this.handleOnEdgeDelete(node.id, e);
        });

        node.connectedFrom.forEach(e => {
            this.handleOnEdgeDelete(e, node.id);
        });

        DBService.nodes.delete(id).then(() => {
            this.setState({isDirtyDB: true});
        });
    }

    handleOpenViewNode(title, description) {
        this.state.openNodeModal();
        this.setState({nodeModalMode: 0, nodeTitle: title, nodeDescription: description});
    }

    handleOpenCreateNode() {
        this.state.openNodeModal();
        this.setState({nodeModalMode: 1});
    }

    handleOpenEditNode(title, description) {
        this.state.openNodeModal();
        this.setState({nodeModalMode: 2, nodeTitle: title, nodeDescription: description});
    }

    toggleNodeCtrl() {
        this.setState(state => ({nodeCtrlHidden: !state.nodeCtrlHidden}));
    }

    toggleNodeOptions(id) {
        if (this.state.selectedNodeId === id)
            this.setState({selectedNodeId: 0});
        else
            this.setState({selectedNodeId: id});
    }

    render() {
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
                                                width={width}
                                                height={height}
                                                zoom={zoom}
                                                selectedNodeId={this.state.selectedNodeId}
                                                handleDragStart={this.handleDragStart}
                                                handleDragMove={this.handleDragMove}
                                                handleDragEnd={this.handleDragEnd}
                                                handleEdgeCtrlDragEnd={this.handleEdgeCtrlDragEnd}
                                                handleOnNodeDelete={this.handleOnNodeDelete}
                                                handleOpenViewNode={this.handleOpenViewNode}
                                                handleOpenEditNode={this.handleOpenEditNode}
                                                toggleNodeOptions={this.toggleNodeOptions}/>
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
                                <div className={`${this.state.nodeCtrlHidden ? 'hidden' : ''} -ml-8 pl-10 pr-2 py-2 sm:-ml-8 sm:pl-12 sm:pr-4 sm:py-2 rounded-r-lg shadow-md bg-gray-100`}>
                                    <button className="px-3 py-1 sm:px-5 sm:py-3 rounded-lg shadow font-semibold bg-gray-400"
                                            onClick={this.handleOpenCreateNode}>
                                        Node
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Zoom>
                {/* Modals here */}
                <Modal title={`${this.state.nodeModalMode === 0 ? 'View' : 
                                this.state.nodeModalMode === 1 ? 'Create New' : 'Edit'} Node`}
                       openModal={callable => {
                            if (!this.state.openNodeModal)
                                this.setState({openNodeModal: callable});
                        }}>
                    {({closeModal}) => (
                        (this.state.nodeModalMode === 0 &&
                            <NodeView title={this.state.nodeTitle}
                                        description={this.state.nodeDescription}
                                        handleCloseModal={closeModal} />
                        ) ||
                        (this.state.nodeModalMode === 1 &&
                            <NodeForm title=""
                                        description=""
                                        handleOnNodeCreate={this.handleOnNodeCreate}
                                        handleCloseModal={closeModal} />
                        ) ||
                        (this.state.nodeModalMode === 2 &&
                            <NodeForm itemId={this.state.selectedNodeId}
                                        title={this.state.nodeTitle}
                                        description={this.state.nodeDescription}
                                        handleOnNodeUpdate={this.handleOnNodeUpdate}
                                        handleCloseModal={closeModal} />
                        )
                    )}
                </Modal>
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

Array.prototype.indexOfWhen = function(predicate) {
    let i = 0;
    while (i < this.length) {
        if (predicate(this[i]))
            return i;
        i++;
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

class NodeForm extends React.Component {
    constructor(props) {
        super(props);

        const {title, description} = props;
        this.state = {
            title: title || "",
            description: description || "",
            titleProp: title || "",
            descriptionProp: description || ""
        };

        this.handleOnTitleChange = this.handleOnTitleChange.bind(this);
        this.handleOnDescriptionChange = this.handleOnDescriptionChange.bind(this);
    }

    componentDidUpdate() {
        const {title, description} = this.props;
        if (this.state.titleProp === title &&
            this.state.descriptionProp === description)
            return;
            
        let nodeTitle = "";
        let nodeDescription = "";
        if (title)
            nodeTitle = title;

        if (description)
            nodeDescription = description;

        this.setState({title: nodeTitle, description: nodeDescription, titleProp: nodeTitle, descriptionProp: nodeDescription});
    }

    handleOnTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleOnDescriptionChange(data) {
        this.setState({description: data});
    }

    render() {
        return(
            <form className="text-gray-800" action="">
                <label htmlFor="nodeTitle">
                    <p className="mb-2">Title</p>
                    <input id="nodeTitle" className="px-2 py-1 mb-4 w-full rounded shadow-inner bg-gray-300 text-gray-700 outline-none focus:shadow-outline focus:bg-blue-100" 
                        type="text"
                        value={this.state.title}
                        onChange={this.handleOnTitleChange} />
                </label>
                <label htmlFor="nodeDescription">
                    <p className="mb-2">Description</p>
                    {/* Encode the data!!! And properly show the data in NodeView */}
                    <CKEditor editor={ClassicEditor}
                              data={this.state.description} 
                              onChange={(event, editor) => {
                                  this.handleOnDescriptionChange(editor.getData());
                              }}/>
                </label>
                <div className="mt-4 flex flex-col justify-center sm:justify-start sm:flex-row-reverse">
                    <input className="px-4 py-2 mb-2 sm:mb-0 rounded-md bg-indigo-500 text-gray-100 hover:bg-indigo-400 cursor-pointer" 
                        type="button" 
                        value={`${this.props.handleOnNodeCreate ? 'Create' : 'Edit'} Node`}
                        onClick={() => {
                            if (this.props.handleOnNodeCreate) {
                                if (this.props.handleOnNodeCreate(0, 0, this.state.title, this.state.description))
                                    this.props.handleCloseModal();
                            } else if (this.props.handleOnNodeUpdate) {
                                if (this.props.handleOnNodeUpdate(this.props.itemId, this.state.title, this.state.description))
                                    this.props.handleCloseModal();
                            }
                        }} />
                    <input className="px-4 py-2 sm:mr-2 rounded-md bg-gray-300 text-indigo-500 hover:bg-gray-400 cursor-pointer" 
                           type="button" 
                           value="Cancel" 
                           onClick={this.props.handleCloseModal} />
                </div>
            </form>
        );
    }
}

class NodeView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: ""
        };
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const {title, description} = this.props;
        if (this.state.title === title &&
            this.state.description === description)
            return;
            
        let nodeTitle = "";
        let nodeDescription = "";
        if (title)
            nodeTitle = title;

        if (description)
            nodeDescription = description;

        this.setState({title: nodeTitle, description: nodeDescription});
    }

    render() {
        return(
            <div className="text-gray-800">
                <p className="mb-2 text-xl font-bold">{this.props.title}</p>
                <hr className="mb-4" />
                <div className="ck-content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.props.description)}}></div>
            </div>
        );
    }
}

class NodeChecklist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        }
    }
}