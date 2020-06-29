import React from 'react';
import ScaledDrag from './ScaledDrag.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Node extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0
        };
    }

    render() {
         /*() => {
                let items = [...draggableItems];
                let currItem = {...items[i]};
                currItem.x = dx / zoom.transformMatrix.scaleX;
                currItem.y = dy / zoom.transformMatrix.scaleY;
                items[i] = currItem;
                setDraggableItems(items);
            }*/
        /* 
        <g key={`node-${item.id}`}
            transform={`translate(${dx}, ${dy})`}
            style={{cursor: isDragging ? 'move' : 'hand' }}
            onMouseMove={dragMove}
            onMouseDown={dragStart}
            onMouseUp={dragEnd}
            onTouchMove={dragMove}
            onTouchStart={dragStart}
            onTouchEnd={dragEnd}>
            <rect className="node-root fill-current text-gray-600" x={item.initialX} y={item.initialY} width="200" height="150" rx="10" filter="url(#nodeShadow)" />
            <text className="fill-current text-gray-100 text-2xl" x={item.initialX + 15} y={item.initialY + 30}>{item.name}</text>
            <text className="fill-current text-gray-100 text-2xl" x={item.initialX + 15} y={item.initialY + 60}>{`(${dx}, ${dy})`}</text>
        </g>
        */
        return(
            <ScaledDrag width={this.props.width} 
                    height={this.props.height}
                    startX={this.props.item.initialX}
                    startY={this.props.item.initialY}
                    scaleX={this.props.zoom.transformMatrix.scaleX}
                    scaleY={this.props.zoom.transformMatrix.scaleY}
                    onDragStart={() => this.props.handleDragStart(this.props.i)}>
                {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) =>
                    (false && isDragging) || (
                        <g key={`node-${this.props.item.id}`}
                            transform={`translate(${dx}, ${dy})`}
                            style={{cursor: isDragging ? 'move' : 'pointer' }}>
                            <g onMouseMove={event => {
                                this.props.handleDragMove(this.props.item.id, dx, dy);
                                dragMove(event);
                            }}
                                onMouseDown={dragStart}
                                onMouseUp={event => {
                                    this.props.handleDragEnd(this.props.i, dx, dy);
                                    dragEnd(event);
                                }}
                                onTouchMove={dragMove}
                                onTouchStart={dragStart}
                                onTouchEnd={event => {
                                    this.props.handleDragEnd(this.props.i, dx, dy);
                                    dragEnd(event);
                                }}>
                                <g onMouseUp={() => this.props.toggleNodeOptions(this.props.item.id)} 
                                    onTouchEnd={() => this.props.toggleNodeOptions(this.props.item.id)}>
                                    <rect className="node-root fill-current text-gray-600" 
                                            width="300" 
                                            height="100" 
                                            rx="7"
                                            style={{stroke: this.state.selectedNodeId === this.props.item.id ? "#4a5568" : "none", strokeWidth: 7}}
                                            filter="url(#nodeShadow)"/>
                                    <foreignObject name={`node-${this.props.item.id}`}
                                                    width="300" 
                                                    height="100">
                                        <div className="p-4 flex items-center w-full h-full pointer-events-none">
                                            <div className="flex flex-col w-full text-gray-800">
                                                <span className="text-2xl font-bold truncate select-none">
                                                    {this.props.item.name}
                                                </span>
                                                <span className="text-xl font-medium truncate select-none">
                                                    {`${5} subgoals`} &#x2022; {`${10} in list`}
                                                </span>
                                            </div>
                                        </div>
                                    </foreignObject>

                                    {/* 
                                    <rect className="node-root fill-current text-gray-600" 
                                            width="300" 
                                            height="100" 
                                            rx="10"
                                            style={{stroke: this.state.selectedNodeId === item.id ? "#4a5568" : "none", strokeWidth: 7}}
                                            filter="url(#nodeShadow)"/>
                                    <text className="node-title fill-current text-gray-100 text-2xl font-medium"
                                            x={25} 
                                            y={45}>
                                        {item.name}
                                    </text>
                                    <text className="node-status fill-current text-gray-300 text-xl"
                                            x={25} 
                                            y={75}>
                                        {`${5} subgoals`} &#x2022; {`${10} in list`}
                                    </text>
                                    */}
                                </g>

                                {/*
                                <text className="fill-current text-gray-100 text-2xl" x={15} y={60}>{`(${dx}, ${dy})`}</text>
                                <text className="fill-current text-gray-100 text-2xl" x={15} y={90}>{`(${item.initialX}, ${item.initialY})`}</text>
                                */}
                            </g>

                            {(this.props.selectedNodeId === this.props.item.id &&
                                <>
                                    <g>
                                        <rect className="fill-current text-gray-500"
                                            x="23"
                                            y="-90"
                                            width="74"
                                            height="74"
                                            rx="10"
                                            filter="url(#nodeShadow)"/>
                                        <foreignObject x="23"
                                                    y="-90"
                                                    width="74" 
                                                    height="74" 
                                                    className="text-4xl text-gray-800 pointer-events-none">
                                            <div className="flex items-center justify-center w-full h-full">      
                                                <FontAwesomeIcon icon="eye" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                    <g>
                                        <rect className="fill-current text-gray-500"
                                            x="113"
                                            y="-90"
                                            width="74"
                                            height="74"
                                            rx="10"
                                            filter="url(#nodeShadow)"/>
                                        <foreignObject x="113"
                                                    y="-90"
                                                    width="74" 
                                                    height="74" 
                                                    className="text-4xl text-gray-800 pointer-events-none">
                                            <div className="flex items-center justify-center w-full h-full">      
                                                <FontAwesomeIcon icon="pencil-alt" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                    <g>
                                        <rect className="fill-current text-gray-500"
                                            x="203"
                                            y="-90"
                                            width="74"
                                            height="74"
                                            rx="10"
                                            filter="url(#nodeShadow)"/>
                                        <foreignObject x="203"
                                                    y="-90"
                                                    width="74" 
                                                    height="74"  
                                                    className="text-4xl text-gray-800 pointer-events-none">
                                            <div className="flex items-center justify-center w-full h-full">      
                                                <FontAwesomeIcon icon="pencil-alt" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                </>
                            )}
                            <ScaledDrag key={`edge-${this.props.item.id}`}
                                        width={this.props.width}
                                        height={this.props.height}
                                        scaleX={this.props.zoom.transformMatrix.scaleX}
                                        scaleY={this.props.zoom.transformMatrix.scaleY}
                                        onDragStart={() => this.props.handleDragStart(this.props.i)}
                                        resetOnStart={true}>
                                {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) => 
                                    (false && isDragging) || (
                                        <g transform={`translate(${dx}, ${dy})`}
                                            className="z-30"
                                            onMouseMove={dragMove}
                                            onMouseDown={dragStart}
                                            onMouseUp={event => {
                                                //this.props.handleEdgeCtrlDragEnd(event, item.id);
                                                // We always want to reset the position here because
                                                // the node can have multiple links with other nodes
                                                dragEnd(event, true);
                                            }}
                                            onTouchMove={dragMove}
                                            onTouchStart={dragStart}
                                            onTouchEnd={dragEnd}>
                                            <circle cx="300"
                                                    cy="50"
                                                    r="20"
                                                    style={{visibility: "visible"}}
                                                    className="fill-current text-gray-400"/>
                                            <circle cx="300"
                                                    cy="50"
                                                    r="20"
                                                    stroke="#2d3748"
                                                    strokeWidth="5"
                                                    fill="none"
                                                    className="pointer-events-none"/>
                                            <foreignObject x="280"
                                                        y="30"
                                                        width="40" 
                                                        height="40" 
                                                        className="text-2xl text-gray-800 pointer-events-none">
                                                <div className="flex items-center justify-center w-full h-full">      
                                                    <FontAwesomeIcon icon="plus" />
                                                </div>
                                            </foreignObject>
                                        </g>
                                    )
                                }
                            </ScaledDrag>
                        </g>
                    )
                }
            </ScaledDrag>
        );
    }
}

