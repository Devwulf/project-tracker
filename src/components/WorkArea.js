import React, { useMemo, useState, useEffect } from 'react';
import { Drag, raise } from '@vx/drag';
import { Zoom } from '@vx/zoom';
import '../assets/workArea.css';

const initialTransformZoom = {
    scaleX: 1,
    scaleY: 1,
    translateX: 100,
    translateY: 100,
    skewX: 0,
    skewY: 0,
};

export default function WorkArea({width, height}) {
    const [draggableItems, setDraggableItems] = useState([]);
    useEffect(() => {
        setDraggableItems(
            [
                {id: "1", name: "Test", x: 150, y: 100},
                {id: "2", name: "Another Test", x: 200, y: 300}
            ]
        );
    }, [])

    if (draggableItems.length === 0)
        return null;

    return(
        <>
            <Zoom width={width} 
                height={height}
                scaleXMin={1 / 2}
                scaleXMax={4}
                scaleYMin={1 / 2}
                scaleYMax={4}
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
                                  onMouseLeave={()=> {
                                      if (zoom.isDragging) zoom.dragEnd();
                                  }} />
                            <g transform={zoom.toString()}>
                                {draggableItems.map((item, i) => (
                                    <Drag key={`${item.id}`} width={width} height={height} onDragStart={() => setDraggableItems(raise(draggableItems, i))}>
                                        {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) =>
                                            (false && isDragging) || (
                                                <g key={`node-${item.id}`}
                                                   transform={`translate(${dx}, ${dy})`}
                                                   style={{cursor: isDragging ? 'move' : 'hand' }}
                                                   onMouseMove={dragMove}
                                                   onMouseDown={dragStart}
                                                   onMouseUp={dragEnd}
                                                   onTouchMove={dragMove}
                                                   onTouchStart={dragStart}
                                                   onTouchEnd={dragEnd}>
                                                    <rect className="node-root fill-current text-gray-600" x={item.x} y={item.y} width="200" height="150" rx="10" filter="url(#nodeShadow)" />
                                                    <text className="fill-current text-gray-100 text-2xl" x={item.x + 15} y={item.y + 30}>{item.name}</text>
                                                </g>
                                            )
                                        }
                                    </Drag>
                                ))   
                                }
                            </g>
                        </svg>
                        <div className="controls absolute flex flex-col items-end">
                            <button className="px-2 py-1 rounded bg-gray-400 text-gray-900 hover:bg-gray-900 hover:text-gray-400" onClick={zoom.reset}>
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </Zoom>
        </>
    );
}