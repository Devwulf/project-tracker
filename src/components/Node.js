import React from 'react';

export default class Node extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0
        };

        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseMove() {
        this.setState(state => ({
            x: state.x + (this.props.dx / this.props.scaleX),
            y: state.y + (this.props.dy / this.props.scaleY)
        }));
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
            <g key={`node-${this.props.id}`}
                transform={`translate(${this.state.x}, ${this.state.y})`}
                style={{cursor: this.props.isDragging ? 'move' : 'hand' }}
                onMouseMove={this.handleMouseMove}
                onMouseDown={this.props.dragStart}
                onMouseUp={this.props.dragEnd}
                onTouchMove={this.props.dragMove}
                onTouchStart={this.props.dragStart}
                onTouchEnd={this.props.dragEnd}>
                {this.props.children}
            </g>
        );
    }
}

