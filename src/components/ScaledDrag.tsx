import React from 'react';
import { localPoint } from '@vx/event';

type MouseOrTouchEvent = React.MouseEvent | React.TouchEvent;

export type DragProps = {
  /** Children render function which is passed the state of dragging and callbacks for drag start/end/move. */
  children: (args: ChildrenArgs) => React.ReactNode;
  /** Width of the drag container. */
  width: number;
  /** Height of the drag container. */
  height: number;
  /** Whether to render an invisible rect below children to capture the drag area as defined by width and height. */
  captureDragArea?: boolean;
  /** Whether to reset drag state upon the start of a new drag. */
  resetOnStart?: boolean;
  /** Whether to reset drag state upon the end of a drag. */
  resetOnEnd?: boolean;
  /** Optional callback invoked upon drag end. */
  onDragEnd?: (args: HandlerArgs) => void;
  /** Optional callback invoked upon drag movement. */
  onDragMove?: (args: HandlerArgs) => void;
  /** Optional callback invoked upon drag start. */
  onDragStart?: (args: HandlerArgs) => void;

  /** The starting value for x */
  startX: number;
  /** The starting value for y */
  startY: number;

  /** The X scaling given by the Zoom scale */
  scaleX: number;
  /** The X scaling given by the Zoom scale */
  scaleY: number;
};

export type DragState = {
  x: number | undefined;
  y: number | undefined;
  dx: number;
  dy: number;
  isDragging: boolean;
};

export type HandlerArgs = DragState & { event: MouseOrTouchEvent };

type ChildrenArgs = DragState & {
  dragEnd: (event: MouseOrTouchEvent) => void;
  dragMove: (event: MouseOrTouchEvent) => void;
  dragStart: (event: MouseOrTouchEvent) => void;
};

export default class ScaledDrag extends React.Component<DragProps, DragState> {
  static defaultProps = {
    captureDragArea: true,
    resetOnStart: false,
    resetOnEnd: false,
  };

  state = {
    x: undefined,
    y: undefined,
    dx: this.props.startX || 0,
    dy: this.props.startY || 0,
    isDragging: false,
  };

  handleDragStart = (event: MouseOrTouchEvent) => {
    const { onDragStart, resetOnStart, scaleX, scaleY } = this.props;
    event.persist();
    this.setState(
      ({ dx, dy }) => {
        const point = localPoint(event) || { x: 0, y: 0 };
        return {
          isDragging: true,
          dx: resetOnStart ? 0 : dx,
          dy: resetOnStart ? 0 : dy,
          x: resetOnStart ? Math.floor(point.x / scaleX) : Math.floor(point.x / scaleX) - dx,
          y: resetOnStart ? Math.floor(point.y / scaleY) : Math.floor(point.y / scaleY) - dy,
        };
      },
      onDragStart &&
        (() => {
          onDragStart({ ...this.state, event });
        }),
    );
  };

  handleDragMove = (event: MouseOrTouchEvent) => {
    const { onDragMove, scaleX, scaleY } = this.props;
    event.persist();

    this.setState(
      ({ x, y, isDragging }) => {
        const point = localPoint(event) || { x: 0, y: 0 };
        return isDragging
          ? {
              isDragging: true,
              dx: (Math.floor(point.x / scaleX) - (x || 0)),
              dy: (Math.floor(point.y / scaleY) - (y || 0)),
            }
          : null;
      },
      onDragMove &&
        (() => {
          if (this.state.isDragging) onDragMove({ ...this.state, event });
        }),
    );
  };

  handleDragEnd = (event: MouseOrTouchEvent) => {
    const { onDragEnd, resetOnEnd } = this.props;
    event.persist();
    
    this.setState(state => (
      { 
        isDragging: false,
        dx: resetOnEnd ? 0 : state.dx,
        dy: resetOnEnd ? 0 : state.dy
      }),
      onDragEnd &&
        (() => {
          onDragEnd({ ...this.state, event });
        }),
    );
  };

  render() {
    const { x, y, dx, dy, isDragging } = this.state;
    const { children, width, height, captureDragArea } = this.props;
    return (
      <>
        {isDragging && captureDragArea && (
          <rect
            width={width}
            height={height}
            onMouseMove={this.handleDragMove}
            onMouseUp={this.handleDragEnd}
            fill="transparent"
          />
        )}
        {children({
          x,
          y,
          dx,
          dy,
          isDragging,
          dragEnd: this.handleDragEnd,
          dragMove: this.handleDragMove,
          dragStart: this.handleDragStart,
        })}
      </>
    );
  }
}