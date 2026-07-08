export interface MazeCell {
  x: number;
  y: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

export type MazeGrid = MazeCell[][];

export function generateMaze(width: number, height: number): MazeGrid {
  // Inicializar grid com todas as paredes ativas
  const grid: MazeGrid = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false,
      });
    }
    grid.push(row);
  }

  const stack: MazeCell[] = [];
  let current = grid[0][0];
  current.visited = true;

  const getUnvisitedNeighbors = (cell: MazeCell) => {
    const neighbors = [];
    const { x, y } = cell;

    if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ cell: grid[y - 1][x], direction: 'top' });
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push({ cell: grid[y][x + 1], direction: 'right' });
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push({ cell: grid[y + 1][x], direction: 'bottom' });
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ cell: grid[y][x - 1], direction: 'left' });

    return neighbors;
  };

  const removeWalls = (a: MazeCell, b: MazeCell, dir: string) => {
    if (dir === 'top') {
      a.top = false;
      b.bottom = false;
    } else if (dir === 'right') {
      a.right = false;
      b.left = false;
    } else if (dir === 'bottom') {
      a.bottom = false;
      b.top = false;
    } else if (dir === 'left') {
      a.left = false;
      b.right = false;
    }
  };

  // Algoritmo Recursive Backtracker
  let unvisitedCount = width * height - 1;

  while (unvisitedCount > 0) {
    const neighbors = getUnvisitedNeighbors(current);

    if (neighbors.length > 0) {
      const nextIdx = Math.floor(Math.random() * neighbors.length);
      const next = neighbors[nextIdx];

      stack.push(current);
      removeWalls(current, next.cell, next.direction);

      current = next.cell;
      current.visited = true;
      unvisitedCount--;
    } else if (stack.length > 0) {
      current = stack.pop()!;
    }
  }

  // Abrir entrada (top-left) e saída (bottom-right)
  grid[0][0].left = false;
  grid[height - 1][width - 1].right = false;

  return grid;
}
