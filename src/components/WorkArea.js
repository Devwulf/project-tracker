import React from 'react';
import { raise } from '@vx/drag';
import { Zoom } from '@vx/zoom';
import '../assets/App.css';

import ScaledDrag from './ScaledDrag.tsx';
import DBService from '../services/DBService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            nodeCtrlHidden: true
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleMoveEnd = this.handleMoveEnd.bind(this);
        this.toggleNodeCtrl = this.toggleNodeCtrl.bind(this);
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

    handleMoveEnd(i, dx, dy) {
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
                    scaleXMax={1}
                    scaleYMin={1/4}
                    scaleYMax={1}
                    transformMatrix={initialTransformZoom}>
                    {zoom => (
                        <div className="relative">
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
                                      onTouchEnd={zoom.dragEnd}
                                      onMouseDown={zoom.dragStart}
                                      onMouseMove={zoom.dragMove}
                                      onMouseUp={zoom.dragEnd}
                                      onMouseLeave={() => {
                                          if (zoom.isDragging) zoom.dragEnd();
                                      }} />
                                <g transform={zoom.toString()}>
                                    {this.state.draggableItems.map((item, i) => (
                                        <ScaledDrag key={`${item.id}`} 
                                              width={width} 
                                              height={height}
                                              startX={item.initialX}
                                              startY={item.initialY}
                                              scaleX={zoom.transformMatrix.scaleX}
                                              scaleY={zoom.transformMatrix.scaleY}
                                              onDragStart={() => this.handleDragStart(i)}>
                                            {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) =>
                                                (false && isDragging) || (
                                                    <g key={`node-${item.id}`}
                                                       transform={`translate(${dx}, ${dy})`}
                                                       style={{cursor: isDragging ? 'move' : 'hand' }}
                                                       onMouseMove={dragMove}
                                                       onMouseDown={dragStart}
                                                       onMouseUp={event => {
                                                           this.handleMoveEnd(i, dx, dy);
                                                           dragEnd(event);
                                                       }}
                                                       onTouchMove={dragMove}
                                                       onTouchStart={dragStart}
                                                       onTouchEnd={event => {
                                                           this.handleMoveEnd(i, dx, dy);
                                                           dragEnd(event);
                                                       }}>
                                                        <rect className="node-root fill-current text-gray-600" 
                                                              width="200" 
                                                              height="150" 
                                                              rx="10" 
                                                              filter="url(#nodeShadow)"/>
                                                        <text className="fill-current text-gray-100 text-2xl font-bold" 
                                                              x={15} 
                                                              y={30}>
                                                            {item.name}
                                                        </text>


                                                        {/*
                                                        <text className="fill-current text-gray-100 text-2xl" x={15} y={60}>{`(${dx}, ${dy})`}</text>
                                                        <text className="fill-current text-gray-100 text-2xl" x={15} y={90}>{`(${item.initialX}, ${item.initialY})`}</text>
                                                        */}
                                                    </g>
                                                )
                                            }
                                        </ScaledDrag>
                                    ))   
                                    }
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
                                <button className="px-2 py-1 rounded text-xs lg:text-base bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400" onClick={zoom.reset}>
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
            </>
        );
    }
}