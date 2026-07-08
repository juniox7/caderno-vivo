const grid = [
['K', 'A', 'F', 'J', 'V', 'J', 'M', 'N', 'D', 'D', 'S', 'P'],
['E', 'X', 'P', 'J', 'S', 'L', 'M', 'M', 'I', 'E', 'T', 'X'],
['G', 'O', 'G', 'I', 'F', 'M', 'M', 'J', 'X', 'N', 'P', 'B'],
['C', 'I', 'V', 'N', 'C', 'X', 'I', 'I', 'A', 'F', 'H', 'A'],
['Y', 'P', 'F', 'U', 'G', 'A', 'K', 'K', 'R', 'F', 'W', 'O'],
['Q', 'A', 'Q', 'I', 'M', 'J', 'X', 'L', 'V', 'U', 'V', 'C'],
['F', 'U', 'F', 'N', 'N', 'P', 'Y', 'A', 'O', 'Y', 'V', 'P'],
['D', 'N', 'Y', 'S', 'B', 'J', 'U', 'V', 'R', 'U', 'O', 'K'],
['E', 'A', 'E', 'E', 'I', 'E', 'Y', 'E', 'E', 'P', 'X', 'S'],
['Q', 'P', 'U', 'T', 'C', 'T', 'R', 'O', 'N', 'C', 'O', 'X'],
['Q', 'P', 'I', 'O', 'O', 'S', 'B', 'H', 'M', 'A', 'P', 'L'],
['E', 'J', 'F', 'A', 'B', 'C', 'O', 'Z', 'I', 'K', 'X', 'X'] // Note: last row in image is E J F A B C O Z I K X (11 columns?), wait: E J F A B C O Z I K X is 11, maybe I miscounted.
];

const words = ["PICA", "PAU", "BICO", "AVE", "ARVORE", "INSETO", "NINHO", "TRONCO"];

const dirs = [
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: 1, y: 1}
];

words.forEach(w => {
  let found = false;
  for(let r=0; r<grid.length; r++) {
    for(let c=0; c<grid[r].length; c++) {
      for(let d of dirs) {
        let match = true;
        for(let i=0; i<w.length; i++) {
          let nr = r + i*d.y;
          let nc = c + i*d.x;
          if(nr >= grid.length || nc >= grid[r].length || grid[nr][nc] !== w[i]) {
            match = false;
            break;
          }
        }
        if(match) {
          console.log(`Found ${w} at r:${r}, c:${c} dir:${d.x},${d.y}`);
          found = true;
        }
      }
    }
  }
  if(!found) console.log(`NOT FOUND: ${w}`);
});
