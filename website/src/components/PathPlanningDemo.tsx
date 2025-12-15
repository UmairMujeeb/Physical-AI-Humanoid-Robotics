import React, { useState, useEffect, useRef } from 'react';

type PathPlanningDemoProps = {
  title?: string;
  description?: string;
};

type Cell = {
  row: number;
  col: number;
  isObstacle: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
  isExplored: boolean;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent: Cell | null;
};

const PathPlanningDemo: React.FC<PathPlanningDemoProps> = ({
  title = 'Interactive Path Planning Demo',
  description = 'Visualization of A* path planning algorithm in a grid environment'
}) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startPos, setStartPos] = useState<[number, number]>([5, 5]);
  const [endPos, setEndPos] = useState<[number, number]>([15, 15]);
  const [isDrawingObstacle, setIsDrawingObstacle] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<number>(50); // ms delay between steps
  const gridRef = useRef<HTMLDivElement>(null);

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < 20; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < 25; col++) {
        currentRow.push({
          row,
          col,
          isObstacle: false,
          isStart: row === startPos[0] && col === startPos[1],
          isEnd: row === endPos[0] && col === endPos[1],
          isPath: false,
          isExplored: false,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  };

  const resetGrid = () => {
    setIsRunning(false);
    initializeGrid();
  };

  const clearPath = () => {
    setIsRunning(false);
    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          isPath: false,
          isExplored: false,
          g: cell.isStart ? 0 : Infinity,
          h: 0,
          f: cell.isStart ? 0 : Infinity,
          parent: null
        }))
      )
    );
  };

  const getNeighbors = (cell: Cell): Cell[] => {
    const neighbors: Cell[] = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // up, down, left, right
      [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonals
    ];

    for (const [dr, dc] of directions) {
      const newRow = cell.row + dr;
      const newCol = cell.col + dc;

      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length &&
        !grid[newRow][newCol].isObstacle
      ) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  };

  const manhattanDistance = (cell1: Cell, cell2: Cell): number => {
    return Math.abs(cell1.row - cell2.row) + Math.abs(cell1.col - cell2.col);
  };

  const runAStar = async () => {
    if (isRunning) return;
    setIsRunning(true);
    clearPath();

    // Create a copy of the grid to work with
    let workingGrid = JSON.parse(JSON.stringify(grid)) as Cell[][];

    // Initialize start cell
    const startCell = workingGrid[startPos[0]][startPos[1]];
    startCell.g = 0;
    startCell.h = manhattanDistance(startCell, workingGrid[endPos[0]][endPos[1]]);
    startCell.f = startCell.g + startCell.h;

    // Initialize open and closed sets
    let openSet: Cell[] = [startCell];
    const closedSet: Cell[] = [];

    while (openSet.length > 0) {
      // Find cell with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      // If we reached the end, reconstruct path
      if (current.row === endPos[0] && current.col === endPos[1]) {
        let path: Cell[] = [];
        let currentPath: Cell | null = current;

        while (currentPath !== null) {
          path.push(currentPath);
          currentPath = currentPath.parent;
        }

        path.reverse();

        // Update the grid with the path
        setGrid(prevGrid => {
          const updatedGrid = [...prevGrid];
          for (let i = 1; i < path.length - 1; i++) { // Exclude start and end
            const cell = path[i];
            updatedGrid[cell.row][cell.col] = {
              ...updatedGrid[cell.row][cell.col],
              isPath: true
            };
          }
          return updatedGrid;
        });

        setIsRunning(false);
        return;
      }

      // Add current to closed set
      closedSet.push(current);
      workingGrid[current.row][current.col] = {
        ...workingGrid[current.row][current.col],
        isExplored: true
      };

      // Update the displayed grid
      setGrid(prevGrid => {
        const updatedGrid = [...prevGrid];
        updatedGrid[current.row][current.col] = {
          ...updatedGrid[current.row][current.col],
          isExplored: true
        };
        return updatedGrid;
      });

      // Process neighbors
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedSet.some(closedCell =>
          closedCell.row === neighbor.row && closedCell.col === neighbor.col)) {
          continue;
        }

        const tentativeG = current.g + 1; // Assuming uniform cost

        if (tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = manhattanDistance(neighbor, workingGrid[endPos[0]][endPos[1]]);
          neighbor.f = neighbor.g + neighbor.h;

          // Add to open set if not already there
          if (!openSet.some(openCell =>
            openCell.row === neighbor.row && openCell.col === neighbor.col)) {
            openSet.push(neighbor);
          }
        }
      }

      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 101 - speed));
    }

    // If no path found
    setIsRunning(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isRunning) return;

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const cell = newGrid[row][col];

      // Don't allow changing start or end points
      if (cell.isStart || cell.isEnd) return prevGrid;

      // Toggle obstacle
      newGrid[row][col] = {
        ...cell,
        isObstacle: !cell.isObstacle
      };

      return newGrid;
    });
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    const cell = grid[row]?.[col];
    if (cell && !cell.isStart && !cell.isEnd) {
      setIsDrawingObstacle(!cell.isObstacle);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isRunning || !isDrawingObstacle) return;
    const cell = grid[row]?.[col];
    if (cell && !cell.isStart && !cell.isEnd) {
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = {
          ...cell,
          isObstacle: true
        };
        return newGrid;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawingObstacle(false);
  };

  const getCellClass = (cell: Cell) => {
    let classes = 'path-cell ';

    if (cell.isStart) classes += 'start ';
    else if (cell.isEnd) classes += 'end ';
    else if (cell.isObstacle) classes += 'obstacle ';
    else if (cell.isPath) classes += 'path ';
    else if (cell.isExplored) classes += 'explored ';
    else classes += 'empty ';

    return classes;
  };

  return (
    <div className="path-planning-demo">
      <h3>{title}</h3>
      <p>{description}</p>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={runAStar}
          disabled={isRunning}
          className="button button--primary"
          style={{ marginRight: '0.5rem' }}
        >
          {isRunning ? 'Running...' : 'Find Path'}
        </button>
        <button
          onClick={clearPath}
          disabled={isRunning}
          className="button button--secondary"
          style={{ marginRight: '0.5rem' }}
        >
          Clear Path
        </button>
        <button
          onClick={resetGrid}
          className="button button--secondary"
          style={{ marginRight: '0.5rem' }}
        >
          Reset Grid
        </button>

        <label style={{ marginLeft: '1rem' }}>
          Speed:
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{ marginLeft: '0.5rem', width: '100px' }}
          />
          <span style={{ marginLeft: '0.5rem' }}>{speed}%</span>
        </label>
      </div>

      <div
        ref={gridRef}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${grid[0]?.length || 25}, 20px)`,
          gap: '1px',
          backgroundColor: '#ccc',
          padding: '5px',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(cell)}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: '20px',
                height: '20px',
                cursor: isRunning ? 'default' : 'pointer',
                backgroundColor:
                  cell.isStart ? '#28a745' : // Green for start
                  cell.isEnd ? '#dc3545' : // Red for end
                  cell.isObstacle ? '#343a40' : // Dark for obstacles
                  cell.isPath ? '#007bff' : // Blue for path
                  cell.isExplored ? '#ffc107' : // Yellow for explored
                  '#ffffff', // White for empty
                border: '1px solid #ddd',
                boxSizing: 'border-box'
              }}
              title={`Row: ${rowIndex}, Col: ${colIndex}${
                cell.isObstacle ? ' (Obstacle)' :
                cell.isStart ? ' (Start)' :
                cell.isEnd ? ' (End)' :
                cell.isPath ? ' (Path)' :
                cell.isExplored ? ' (Explored)' : ' (Empty)'
              }`}
            />
          ))
        )}
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        <h4>How it works:</h4>
        <ul>
          <li><strong>Start (Green)</strong>: Drag from here to set a new start position</li>
          <li><strong>End (Red)</strong>: Drag to here to set a new end position</li>
          <li><strong>Obstacles (Black)</strong>: Click/drag to add/remove obstacles</li>
          <li><strong>Algorithm</strong>: A* pathfinding algorithm finds the shortest path</li>
          <li><strong>Explored (Yellow)</strong>: Cells investigated by the algorithm</li>
          <li><strong>Path (Blue)</strong>: The optimal path from start to end</li>
        </ul>
        <p><strong>Tip:</strong> Draw obstacles to see how the algorithm finds a path around them!</p>
      </div>
    </div>
  );
};

export default PathPlanningDemo;