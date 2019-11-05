
export function dijkstraSearch(board, startNode, finishNode) {
  //  console.log('dijkstra here!');
  //  console.log(board);

  const visitedNodes = [];
  const unvisitedNodes = [];
  unvisitedNodes.push(startNode);
  while (unvisitedNodes.length) {
    sortedUnivisitedNodes(unvisitedNodes, "Dijkstra");
    const currentNode = unvisitedNodes.shift();
    
    if (currentNode.isWall) 
      continue;

    currentNode.visited = true;
    visitedNodes.push(currentNode);
    if (currentNode === finishNode) 
      return visitedNodes;
    
    const neighbors = getUnvisitedNeighbors(board, currentNode);
    // console.log(neighbors);
    for (const neighbor of neighbors) {
      if (unvisitedNodes.includes(neighbor)) {
        let distance = currentNode.distance + 1;
        if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.parent = currentNode;
        }
      } else {
        unvisitedNodes.push(neighbor);
        neighbor.distance = currentNode.distance + 1;
        neighbor.parent = currentNode
      }
    }
  }
  return visitedNodes;
}

export function aStraSearch(board, startNode, finishNode) {
  const visitedNodes = [];
  const unvisitedNodes = [];
  unvisitedNodes.push(startNode);
  while (!!unvisitedNodes.length) {
    sortedUnivisitedNodes(unvisitedNodes, "A-Star");
    const currentNode = unvisitedNodes.shift();

    if (currentNode.isWall) continue;
    currentNode.visited = true;
    visitedNodes.push(currentNode);
    if (currentNode === finishNode) return visitedNodes;

    const neighbors = getUnvisitedNeighbors(board, currentNode);
    for (const neighbor of neighbors) {
      const distance = currentNode.distance + 1;
      if (unvisitedNodes.includes(neighbor)) {
        if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.parent = currentNode;
        }
      } else {
        unvisitedNodes.push(neighbor);
        neighbor.distance = distance;
        neighbor.parent = currentNode;
      }

      const heuristic = getHeuristic(neighbor, finishNode);
      neighbor.heuristic = distance + heuristic;
      
    }
  }
  return visitedNodes;
}

function getHeuristic(node, finishNode) {
  return Math.sqrt(((finishNode.row - node.row)**2) + ((finishNode.col - node.col)**2));
}

function sortedUnivisitedNodes(unvisitedNodes, algo) {
  if (algo === "Dijkstra") unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  if (algo === "A-Star") unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristic - nodeB.heuristic);
}

function getUnvisitedNeighbors(board, node) {
  const neighbors = [];
  const {row, col} = node;
  if (row > 0) neighbors.push(board[row - 1][col]);
  if (col > 0) neighbors.push(board[row][col - 1]);
  if (row < board.length - 1) neighbors.push(board[row + 1][col]);
  if (col < board[0].length - 1) neighbors.push(board[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.visited);
}

export function getShortestPathNodes(finishNode) {
  const shortestPath = [];
  shortestPath.push(finishNode);
  var tempNode = finishNode.parent;
  while (tempNode) {
    shortestPath.unshift(tempNode);
    tempNode = tempNode.parent;
  }
  return shortestPath;
}