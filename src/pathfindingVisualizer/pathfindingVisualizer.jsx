// Kittipat Phongsak
// My portfolio website.
// Based code by Clément Mihailescu.

import React from 'react';
import Node from './node/node';
import { 
        dijkstraSearch,
        aStraSearch,
        getShortestPathNodes 
      } from './algorithms/dijkstra';

import { recursiveBacktracker } from './mazegenerate/mazegenerate';
import './pathfindingvisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 30;

const ROW_NUMBERS = 20;
const COL_NUMBERS = 40;



export default class PathfindingVisualizer extends React.Component {
  constructor() {
    super();
    this.state = {
      board: [],
      mouseIsPressed: false,
      onStartNode: false,
      startNode: [START_NODE_ROW, START_NODE_COL],
      onFinishNode: false,
      finishNode: [FINISH_NODE_ROW, FINISH_NODE_COL],
      algorithm: "Dijkstra",
      // gernerateAlgo: null,
      dropdown: null
    }
  }

  componentDidMount() {
    const board = getInitialBoard();
    this.setState({board});
    // console.log(board);
  }
  
  componentDidUpdate() {
    const {dropdown} = this.state;
    // console.log(dropdown);
    window.onclick = function(e) {
      // console.log(e.target);

      //If you select dropdown then we don't want to remove show from dropdown item
      if (!e.target.matches(`.${dropdown}`)) {    
        const dropdownNodes = document.querySelector(`.${dropdown}-menu`);
        if(dropdownNodes)
        {
          if (dropdownNodes.classList.contains('show')) 
            dropdownNodes.classList.remove('show');
        }
      }
    }

    const drops = document.querySelectorAll('.drops');
    for (let i=0; i < drops.length; i++) {
      // console.log(drops[i]);
      drops[i].onclick = () => {
        for (let j = 0; j < drops.length; j++) {
          if (drops[i] === drops[j]) 
            continue;
          const temp = document.querySelector(`.${drops[j].classList[1]}-menu`);
          if (temp.classList.contains('show')) 
            temp.classList.remove('show');
        }
      }
    }
  }

  handleMouseDown(row, col) {
    const {board} = this.state;
    const isStart = board[row][col].isStart;
    const isFinish = board[row][col].isFinish;

    this.setState({mouseIsPressed: true});
    if (!isStart && !isFinish) {
      board[row][col].isWall = true;
      document.querySelector(`#node-${row}-${col}`).className = `node node-wall`;
    }
    if (isStart) this.setState({onStartNode: true, startNode: [row, col]});
    if (isFinish)  this.setState({onFinishNode: true, finishNode: [row, col]})
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const {
      board, 
      mouseIsPressed, 
      onStartNode,
      startNode,
      onFinishNode,
      finishNode} = this.state;
    
    // console.log("ENTER!");
    if (mouseIsPressed && !onStartNode && !onFinishNode) {
      if (!board[row][col].isStart && !board[row][col].isFinish) {
        board[row][col].isWall = true;
        document.querySelector(`#node-${row}-${col}`).className = `node node-wall`;
      }
    }

    if (mouseIsPressed && onStartNode) {
      // console.log(board[row][col]);
      // console.log(startNode);

      board[startNode[0]][startNode[1]].isStart = false;
      board[row][col].isStart = true;
      
      this.setState({startNode: [row, col]});
    }

    if (mouseIsPressed && onFinishNode) {
      board[finishNode[0]][finishNode[1]].isFinish = false;
      board[row][col].isFinish = true;

      this.setState({finishNode: [row, col]});
    }
  }
  
  handleMouseUp() {
    const {
      board,
      startNode,
      finishNode
    } = this.state;
    // board[startNode[0]][startNode[1]].isWall = false;
    // board[finishNode[0]][finishNode[1]].isWall = false;
    if (startNode !== null) {
      board[startNode[0]][startNode[1]].isWall = false;
      // console.log("start is wall ? ", board[startNode[0]][startNode[1]].isWall);
    }
    if (finishNode !== null) {
      board[finishNode[0]][finishNode[1]].isWall = false;
    }
    // console.log("UP");
    this.setState({
      mouseIsPressed: false, 
      onStartNode: false,
      onFinishNode: false
    });
  }

  onMouseClickAlgorithms(e) {
    // console.log(e.target.textContent);
    // console.log(e.target.id);
    this.setState({algorithm: e.target.id});
    // const {algorithm} = this.state;
    // console.log(algorithm); 
  }


  animateWall(wallNodes) {
    const {board, startNode, finishNode} = this.state;
    for (let i = 0; i < wallNodes.length; i++) {
      if (wallNodes[i] === board[startNode[0]][startNode[1]] || wallNodes[i] === board[finishNode[0]][finishNode[1]]) continue;
      setTimeout(() => {
        wallNodes[i].isWall = true;
        const {row, col} = wallNodes[i];
        document.querySelector(`#node-${row}-${col}`).className = 'node node-wall';

        // clear-board: disabled = false;
        if ((i + 1) === wallNodes.length) {

          document.querySelector('#clear-board').className = '';
          document.querySelector('#visualizer').className = '';
        }
      }, 10 * i);
    }
    return false;
  }
  
  onMouseClickGenerateAlgorithms(e) {
    this.clearBoard();
    const {board} = this.state;

    document.querySelector('#visualizer').className = 'isDisabled';
    document.querySelector('#clear-board').className = 'isDisabled';

    // this.setState({gernerateAlgo: e.target.id});
    const mazeAlgo = e.target.id;
    if (mazeAlgo === "maze-1") {
      const wallNodes = recursiveBacktracker(board);
      this.animateWall(wallNodes);
      // console.log("animated");
    }
    // console.log(board);
  }

  animatePathfinding(visitedNodes, shortestPathNodes) {
    // const {board, startNode, finishNode} = this.state;
    for (let i = 0; i <= visitedNodes.length; i++) {
      const temp = visitedNodes[i];

      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPathNodes);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        document.querySelector(`#node-${temp.row}-${temp.col}`).classList.toggle(`node-visited`);
      }, 10 * i)
    }
  }
  
  animateShortestPath(shortestPathNodes) {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      // const temp = shortestPathNodes[i];
      // if (temp.isWall) 
      //   continue;
      setTimeout(() => {
        let node = shortestPathNodes[i];
        document.querySelector(`#node-${node.row}-${node.col}`).classList.toggle(`node-shortest-path`);
      }, 50 * i)
    }
  }

  visualizer() {
    const {board, startNode, finishNode, algorithm} = this.state;
    // if (algorithm === null) return;
    this.clearPath();
    const tempStart = board[startNode[0]][startNode[1]];
    const tempFinish = board[finishNode[0]][finishNode[1]];
    // console.log("board", board);
    // console.log("tempStart: ", tempStart);
    var visitedNodes;
    var shortestPathNodes;
    if (algorithm === "Dijkstra") {
      visitedNodes = dijkstraSearch(board, tempStart, tempFinish);
      shortestPathNodes = getShortestPathNodes(tempFinish);
    } else if (algorithm === "A-Star") {
      visitedNodes = aStraSearch(board, tempStart, tempFinish);
      shortestPathNodes = getShortestPathNodes(tempFinish);
    }
    // console.log(shortestPathNodes);
    // console.log(visitedNodes);
    this.animatePathfinding(visitedNodes, shortestPathNodes);
  }

  clearBoard() {
    const {board, startNode, finishNode} = this.state;
    for (let row=0; row < ROW_NUMBERS; row++) {
      for (let col=0; col < COL_NUMBERS; col++) {
        board[row][col].distance = 0;
        board[row][col].isWall = false;
        board[row][col].heuristic = 0;
        board[row][col].visited = false;
        board[row][col].parent = null;
        board[row][col].mazeVisited = false;

        if (board[row][col] === board[startNode[0]][startNode[1]]) {
          document.querySelector(`#node-${row}-${col}`).className = 'node node-start'
        } else if (board[row][col] === board[finishNode[0]][finishNode[1]]) {
          document.querySelector(`#node-${row}-${col}`).className = 'node node-finish'
        } else {
          document.querySelector(`#node-${row}-${col}`).className = 'node'
        }
      }
    }
  }

  clearPath() {
    const {board, startNode, finishNode} = this.state;
    for (let row=0; row < ROW_NUMBERS; row++) {
      for (let col=0; col < COL_NUMBERS; col++) {
        const node = board[row][col];
        if (node.isWall) continue;
        node.distance = 0;
        node.heuristic = 0;
        node.visited = false;
        node.parent = null;

        if (board[row][col] === board[startNode[0]][startNode[1]]) {
          document.querySelector(`#node-${row}-${col}`).className = 'node node-start'
        } else if (board[row][col] === board[finishNode[0]][finishNode[1]]) {
          document.querySelector(`#node-${row}-${col}`).className = 'node node-finish'
        } else {
          document.querySelector(`#node-${row}-${col}`).className = 'node'
        }
      }
    }
  }

  dropdown(e) {
    document.querySelector(`.${e.target.classList[1]}-menu`).classList.toggle('show');
    this.setState({dropdown: e.target.classList[1]});
    // console.log("click 1: ", e.target.classList[1]);
  }

  render() {
    const {board, mouseIsPressed} = this.state;
    const hStyle = {
      backgroundColor: '#24292e',
      color: 'white',
      margin: 0,
      padding: 0
    };

    return (
      <>
        <div>
          <h1 style={hStyle}>Path Visualizer</h1>

          <nav>
            <div className="navbar">
              <ul>
                
                <li className="dropdown">
                  <button className="drops drops-algo dropdown-toggle" onClick={(e) => this.dropdown(e)}>
                    Algorithms
                  </button>
                  <div className="dropdown-menu drops-algo-menu">
                    <button className="algo" id="Dijkstra" onClick={(e) => this.onMouseClickAlgorithms(e)}>Dijkstra's Search</button>
                    <button className="algo" id="A-Star" onClick={(e) => this.onMouseClickAlgorithms(e)}>A* Search</button>
                  </div>
                </li>
                <li className="dropdown">
                  <button 
                    className="drops drops-maze dropdown-toggle"
                    onClick={(e) => this.dropdown(e)}>
                    Generate Maze</button>
                  <div className="dropdown-menu drops-maze-menu">
                    <button className="maze" id="maze-1" onClick={(e) => this.onMouseClickGenerateAlgorithms(e)}>Recursive Backtracker</button>
                  </div>
                </li>
                <li>
                  <button 
                    id="visualizer"
                    onClick={() => this.visualizer()}>
                    Visualize "{(this.state.algorithm)}"!
                  </button>
                </li>
                <li><button id="clear-board" onClick={() => this.clearBoard()}>Clear Board</button></li>
              </ul>
            </div>
          </nav>

          <div className="board">
            {board.map((row, rowIdx) => {
              return (
                <div 
                  key={rowIdx} 
                  style={{marginBottom: "-6px"}}
                  id={`row-${rowIdx}`}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, isStart, isFinish, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        row={row}
                        col={col}
                        isStart={isStart}
                        isFinish={isFinish}
                        isWall={isWall}
                        
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                        onMouseUp={() => {this.handleMouseUp()}}>
                      </Node>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }
}

const getInitialBoard = () => {
  const board = [];
  for (let row = 0; row < ROW_NUMBERS; row++) {
    const tempRow = [];
    for (let col = 0; col < COL_NUMBERS; col++) {
      tempRow.push(createNode(row, col));
    }
    board.push(tempRow);
  }
  return board;
}

const createNode = (row, col) => {
  return {
    row,
    col,
    distance: 0,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isWall: false,
    heuristic: 0,
    visited: false,
    parent: null,
    mazeVisited: false
  } 
}