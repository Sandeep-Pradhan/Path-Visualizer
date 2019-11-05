import React from 'react';
import './node.css';

export default class Node extends React.Component {
  componentDidMount() {
    // console.log("porps: ", this.props);
  }
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isWall
    } = this.props;
    const extraClassName = isStart
      ? 'node-start'
      : isFinish
      ? 'node-finish'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => {onMouseDown(row, col)}}
        onMouseEnter={() => {onMouseEnter(row, col)}}
        onMouseUp={() => {onMouseUp()}}>
      </div>
    )
  }
}