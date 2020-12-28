import React from 'react';
import ScaledDrag from './ScaledDrag.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Node extends React.Component {
    render() {
        let color = 'gray';
        const state = this.props.item.state;
        if (state === 1)
            color = 'red';
        else if (state === 2)
            color = 'orange';
        else if (state === 3)
            color = 'green';

        const {width, height, item, zoomMatrix, selectedNodeId, handleDragMove, handleDragStart, handleDragEnd, toggleNodeOptions, handleOpenViewNode, handleOpenEditNode, handleOnNodeDelete, handleOnNodeUpdateState, handleEdgeCtrlDragEnd} = this.props;
        
        return(
            <ScaledDrag width={width} 
                    height={height}
                    startX={item.initialX}
                    startY={item.initialY}
                    scaleX={zoomMatrix.scaleX}
                    scaleY={zoomMatrix.scaleY}>
                {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) =>
                    (false && isDragging) || (
                        <g key={`node-${item.id}`}
                            transform={`translate(${dx}, ${dy})`}
                            style={{cursor: isDragging ? 'move' : 'pointer' }} >
                            <g onMouseMove={event => {
                                    handleDragMove(item.id, dx, dy);
                                    dragMove(event);
                                }}
                                onMouseDown={event => {
                                    handleDragStart(item.id);
                                    dragStart(event);
                                }}
                                onMouseUp={event => {
                                    handleDragEnd(item, dx, dy);
                                    dragEnd(event);
                                }}
                                onTouchMove={event => {
                                    handleDragMove(item.id, dx, dy);
                                    dragMove(event);
                                }}
                                onTouchStart={event => {
                                    handleDragStart(item.id);
                                    dragStart(event);
                                }}
                                onTouchEnd={event => {
                                    handleDragEnd(item, dx, dy);
                                    dragEnd(event);
                                }}>
                                {/* NOTE: Oh wow, this has been one of my most annoying problems.
                                    Basically, no other events could work properly with the events
                                    above. I've tried onClick, onMouseDown and onTouchEnd, trying
                                    different kinds of functions to run. But only onPointerUp worked! */}
                                <g onPointerUp={() => toggleNodeOptions(item.id, item)}>
                                    <rect data-name={`node-${item.id}`}
                                            className={`node-root fill-current text-${color}-600`} 
                                            width="300" 
                                            height="100" 
                                            rx="7"
                                            style={{stroke: selectedNodeId === item.id ? "#4a5568" : "none", strokeWidth: 7}}
                                            filter="url(#nodeShadow)"
                                            />
                                    <foreignObject width="300" 
                                                    height="100">
                                            <div className="p-4 flex items-center w-full h-full pointer-events-none">
                                                <div className={`flex flex-col w-full text-${color}-900`}>
                                                    <span className="text-2xl font-bold truncate select-none">
                                                        {item.title}
                                                    </span>
                                                    <span className="text-xl font-medium truncate select-none">
                                                        {`${item.connectedTo.length} subgoals`}
                                                    </span>
                                                </div>
                                            </div>
                                    </foreignObject>
                                    {/*
                                    <text className="fill-current text-gray-900 text-2xl font-bold" x={15} y={40}>{item.title}</text>
                                    <text className="fill-current text-gray-900 text-xl" x={15} y={70}>{`${item.connectedTo.length} subgoals`}</text>
                                    */}
                                </g>

                                {/*
                                <text className="fill-current text-gray-100 text-2xl" x={15} y={60}>{`(${dx}, ${dy})`}</text>
                                <text className="fill-current text-gray-100 text-2xl" x={15} y={90}>{`(${item.initialX}, ${item.initialY})`}</text>
                                */}
                            </g>

                            {(selectedNodeId === item.id &&
                                <>
                                    <g onClick={() => handleOpenViewNode(item)}>
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
                                    <g onClick={() => handleOpenEditNode(item)}>
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
                                    <g onClick={() => handleOnNodeDelete(item.id)}>
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
                                                <FontAwesomeIcon icon="trash-alt" />
                                            </div>
                                        </foreignObject>
                                    </g>


                                    <g onClick={() => handleOnNodeUpdateState(item.id, item.state === 3 ? 0 : 3)}>
                                        <rect className="fill-current text-green-500"
                                            x="23"
                                            y="115"
                                            width="74"
                                            height="74"
                                            rx="10"
                                            filter="url(#nodeShadow)"/>
                                        <foreignObject x="23"
                                                    y="115"
                                                    width="74" 
                                                    height="74" 
                                                    className="text-4xl text-green-800 pointer-events-none">
                                            <div className="flex items-center justify-center w-full h-full">      
                                                <FontAwesomeIcon icon="check" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                    <g onClick={() => handleOnNodeUpdateState(item.id, item.state === 2 ? 0 : 2)}>
                                        <rect className="fill-current text text-orange-500"
                                            x="113"
                                            y="115"
                                            width="74"
                                            height="74"
                                            rx="10"
                                            filter="url(#nodeShadow)"/>
                                        <foreignObject x="113"
                                                    y="115"
                                                    width="74" 
                                                    height="74" 
                                                    className="text-4xl text-orange-800 pointer-events-none">
                                            <div className="flex items-center justify-center w-full h-full">      
                                                <FontAwesomeIcon icon="hourglass-half" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                    <g onClick={() => handleOnNodeUpdateState(item.id, item.state === 1 ? 0 : 1)}>
                                        <rect className="fill-current text-red-500"
                                            x="203"
                                            y="115"
                                            width="74"
                                            height="74"
                                            rx="10"
                                            filter="url(#nodeShadow)"/>
                                        <foreignObject x="203"
                                                    y="115"
                                                    width="74" 
                                                    height="74"  
                                                    className="text-4xl text-red-800 pointer-events-none">
                                            <div className="flex items-center justify-center w-full h-full">      
                                                <FontAwesomeIcon icon="times" />
                                            </div>
                                        </foreignObject>
                                    </g>
                                </>
                            )}
                            <ScaledDrag key={`edge-${item.id}`}
                                        width={width}
                                        height={height}
                                        scaleX={zoomMatrix.scaleX}
                                        scaleY={zoomMatrix.scaleY}
                                        onDragStart={() => handleDragStart(item.id)}
                                        resetOnStart={true}
                                        resetOnEnd={true}>
                                {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) => 
                                    (false && isDragging) || (
                                        <g transform={`translate(${dx}, ${dy})`}
                                            className="z-30"
                                            onMouseMove={dragMove}
                                            onMouseDown={dragStart}
                                            onMouseUp={event => {
                                                handleEdgeCtrlDragEnd(event, item, dx, dy);
                                                dragEnd(event);
                                            }}
                                            onTouchMove={dragMove}
                                            onTouchStart={dragStart}
                                            onTouchEnd={event => {
                                                handleEdgeCtrlDragEnd(item, dx, dy);
                                                dragEnd(event);
                                            }}>
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

