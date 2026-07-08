const fetch = require('node-fetch');

async function testPuzzle() {
  try {
    const res = await fetch('https://caderno-vivo.vercel.app/api/generate-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipoAtividade: 'caca_palavras',
        tema: 'Futebol (Fluminense e Manchester City)'
      })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}

testPuzzle();
