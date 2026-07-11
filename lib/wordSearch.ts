export type WordSearchGrid = string[][];

interface Placement {
  word: string;
  row: number;
  col: number;
  dirX: number;
  dirY: number;
}

export function generateWordSearch(words: string[], size: number = 12): { grid: WordSearchGrid, placements: Placement[] } {
  // Inicializar grid com espaços
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const placements: Placement[] = [];

  // Direções possíveis: Horizontal, Vertical e Diagonal principal
  const directions = [
    { x: 1, y: 0 },   // Horizontal para a direita
    { x: 0, y: 1 },   // Vertical para baixo
    { x: 1, y: 1 },   // Diagonal para baixo/direita
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let word of words) {
    const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanWord.length === 0 || cleanWord.length > size) continue;

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      
      const maxCol = dir.x === 1 ? size - cleanWord.length : size - 1;
      const maxRow = dir.y === 1 ? size - cleanWord.length : size - 1;

      const col = Math.floor(Math.random() * (maxCol + 1));
      const row = Math.floor(Math.random() * (maxRow + 1));

      let canPlace = true;

      let overlaps = 0;
      // Verificar colisão
      for (let i = 0; i < cleanWord.length; i++) {
        const checkRow = row + (i * dir.y);
        const checkCol = col + (i * dir.x);
        const currentLetter = grid[checkRow][checkCol];
        
        if (currentLetter !== '') {
          if (currentLetter !== cleanWord[i]) {
            canPlace = false;
            break;
          } else {
            overlaps++;
          }
        }
      }

      if (overlaps > 1) {
        canPlace = false;
      }

      if (canPlace) {
        // Colocar
        for (let i = 0; i < cleanWord.length; i++) {
          const checkRow = row + (i * dir.y);
          const checkCol = col + (i * dir.x);
          grid[checkRow][checkCol] = cleanWord[i];
        }
        placements.push({ word: cleanWord, row, col, dirX: dir.x, dirY: dir.y });
        placed = true;
      }
    }
  }

  // Preencher vazios
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placements };
}
