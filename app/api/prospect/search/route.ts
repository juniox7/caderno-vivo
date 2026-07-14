import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { nicho, cidade, quantidade } = await req.json();
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Chave do Google Places não configurada no .env.local' }, { status: 500 });
    }

    const query = `${nicho} em ${cidade}`;
    
    // Faz a chamada para a API Nova do Google Places
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Pedimos apenas os campos necessários para economizar nos custos da API
        'X-Goog-FieldMask': 'places.id,places.displayName,places.websiteUri,places.nationalPhoneNumber,places.formattedAddress,places.photos',
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: Math.min(quantidade || 5, 20), // O limite por página da API é 20
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Google API Error:", err);
      return NextResponse.json({ error: 'Erro na API do Google Places' }, { status: response.status });
    }

    const data = await response.json();

    if (!data.places) {
      return NextResponse.json({ results: [] });
    }

    const results = data.places.map((place: any) => {
      let foto_url = '';
      if (place.photos && place.photos.length > 0) {
        // Usa o endpoint de media da nova API do Places
        foto_url = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=800&maxWidthPx=1200&key=${apiKey}`;
      }

      return {
        id: place.id, // place_id do google
        nome: place.displayName?.text,
        site: place.websiteUri || '',
        fone: place.nationalPhoneNumber || '',
        endereco: place.formattedAddress || '',
        foto_url,
        status: 'pendente'
      };
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Erro na busca do Places:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
