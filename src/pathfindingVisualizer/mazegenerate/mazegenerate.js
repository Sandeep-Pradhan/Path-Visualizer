
export function recursiveBacktracker(board) {
  // getWallBoad(board);
  var currentNode = board[1][1];
  currentNode.mazeVisited = true;
  // const visitedNode = [];
  const pathNodes = [];
  const visitedNodeMoreThanOne = [];
  while (currentNode.mazeVisited) {
    // console.log(currentNode);
    var neighbors = getUnvisitedNeighbors(board, currentNode);
    // console.log(neighbors);
    if (!!neighbors.length) {
      const randomNode = getRandomNode(neighbors);
      // console.log(randomNode);
      if (neighbors.length > 1) {
        visitedNodeMoreThanOne.push(currentNode);
      }
      pathNodes.push(currentNode);
      const path = getPathConnectionNode(board, currentNode, randomNode);
      path.mazeVisited = true;
      pathNodes.push(path);
  
      currentNode = randomNode
      currentNode.mazeVisited = true;
    } else if (!!visitedNodeMoreThanOne.length) {
      pathNodes.push(currentNode);
      if (!neighbors.length) currentNode = visitedNodeMoreThanOne.pop();
    } else {
      break;
    }
  }
  const wallNodes = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (pathNodes.includes(board[row][col])) continue;
      wallNodes.push(board[row][col]);
    }
  }
  
  return wallNodes;
}

function getPathConnectionNode(board, currentNode, randomNode) {
  if (randomNode.row < currentNode.row) return board[randomNode.row + 1][randomNode.col];
  if (randomNode.col < currentNode.col) return board[randomNode.row][randomNode.col + 1];
  if (randomNode.row > currentNode.row) return board[randomNode.row - 1][randomNode.col];
  if (randomNode.col > currentNode.col) return board[randomNode.row][randomNode.col - 1];
}

function getUnvisitedNeighbors(board, node) {
  const neighbors = [];
  const {row, col} = node;
  if (row > 1) neighbors.push(board[row - 2][col]);
  if (col > 1) neighbors.push(board[row][col - 2]);
  if (row < board.length - 2) neighbors.push(board[row + 2][col]);
  if (col < board[0].length - 2) neighbors.push(board[row][col + 2]);
  return neighbors.filter(neighbor => !neighbor.mazeVisited);
}

// function getWallBoad(board) {
//   for (let row = 0; row < board.length; row++) {
//     for (let col = 0; col < board[0].length; col++) {
//       board[row][col].isWall = true;
//     }
//   }
// }

function getRandomNode(neighbors) {
  const randn = Math.floor(Math.random() * neighbors.length);
  const randomNode = neighbors[randn];
  return randomNode;
}