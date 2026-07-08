// ============================
// CadernoVivo — Mock LLM Engine
// ============================
// Simula a resposta de um LLM com delay artificial.
// O cenário seed do Lucas está hardcoded para validação.

import { AtividadeDiaria, AtividadeGerada, FormularioLivreData, FormularioPredefinidoData } from './types';

/**
 * Simula delay de rede/processamento do LLM
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gera atividade personalizada (Mock)
 * Cruza as variáveis do formulário para criar o conteúdo com inteligência por Foco Pedagógico.
 */
export async function gerarAtividadeMock(dados: FormularioLivreData): Promise<AtividadeGerada> {
  await delay(2000);

  const nomes = dados.nomes.join(', ');
  const nomePrincipal = dados.nomes[0] || 'Aluno';
  
  // ---- Cenário SEED Fixo: Lucas, 8 anos, Matemática, Futebol + Música ----
  if (
    nomePrincipal.toLowerCase() === 'lucas' &&
    dados.idade === 8 &&
    dados.focoPedagogico === 'matematica'
  ) {
    return {
      titulo: `⚽ Aventura Matemática do ${nomePrincipal} no Estádio!`,
      subtitulo: `Matemática + Futebol + Música — Feito especialmente para ${nomes}, ${dados.idade} anos`,
      atividades: [
        {
          tipo: 'problema_contextualizado',
          enunciado: `No intervalo do grande jogo entre Fluminense e Manchester City no Maracanã, ${nomes} organizaram uma super banda musical! Separaram violões e teclados com teclas sensíveis ao toque para os músicos dos dois times tocarem no show do intervalo.`,
          questoes: [
            {
              pergunta: `A banda do Fluminense tem 3 violões e 2 teclados. A banda do Manchester City tem 5 violões e 4 teclados. Quantos instrumentos as duas bandas têm ao todo?`,
              resposta: '14 instrumentos',
              dica: 'Some todos os violões (3 + 5) e todos os teclados (2 + 4), depois junte tudo!',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['10', '12', '14', '16'], respostaCorreta: '14' } : {})
            },
            {
              pergunta: `Se a banda do Fluminense tocou 12 músicas no primeiro tempo e a do Manchester City tocou 8 músicas, quantas músicas a mais o Fluminense tocou?`,
              resposta: '4 músicas a mais',
              dica: 'Subtraia o menor do maior: 12 - 8',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['2', '4', '6', '8'], respostaCorreta: '4' } : {})
            },
            {
              pergunta: `${nomes} querem distribuir 15 violões igualmente entre 3 palcos do estádio. Quantos violões cada palco recebe?`,
              resposta: '5 violões por palco',
              dica: 'Divida 15 por 3!',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['3', '4', '5', '6'], respostaCorreta: '5' } : {})
            },
          ],
        },
      ],
      criadoEm: new Date().toISOString(),
    };
  }

  // ---- Motor Inteligente baseado no Foco Pedagógico ----
  
  if (dados.focoPedagogico === 'interpretacao' || dados.focoPedagogico === 'livre') {
    return {
      titulo: `📖 A Incrível História sobre ${dados.interesse1 || 'Grandes Aventuras'}!`,
      subtitulo: `${getFocoLabel(dados.focoPedagogico)} — Feito para ${nomes}, ${dados.idade} anos`,
      atividades: [
        {
          tipo: 'leitura',
          enunciado: `Era uma vez, em um lugar onde tudo era possível, ${nomes} iniciaram uma jornada inesquecível! Sempre amaram ${dados.interesse1 || 'explorar'}. Um dia, caminhando tranquilamente, encontraram algo surpreendente relacionado a ${dados.interesse2 || 'um mistério antigo'}. Aquilo brilhou intensamente e os transportou para uma terra mágica. Nessa terra, a coragem e a bondade eram o verdadeiro poder. E foi assim que a aventura começou...`,
          questoes: [
            {
              pergunta: `O que ${nomes} encontraram durante a caminhada?`,
              resposta: `Algo surpreendente relacionado a ${dados.interesse2 || 'um mistério antigo'}.`,
              dica: 'Releia a segunda frase do texto.',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Um tesouro de ouro', 'Algo surpreendente relacionado ao mistério', 'Uma espada mágica', 'Um mapa perdido'], respostaCorreta: 'Algo surpreendente relacionado ao mistério' } : {})
            },
            {
              pergunta: `Qual era o verdadeiro poder na terra mágica?`,
              resposta: 'A coragem e a bondade.',
              dica: 'Está no final do parágrafo!',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['O dinheiro e a fama', 'A força física', 'A coragem e a bondade', 'A magia antiga'], respostaCorreta: 'A coragem e a bondade' } : {})
            },
            {
              pergunta: `Imagine e escreva o que aconteceu no final dessa aventura! O que ${nomes} fizeram?`,
              resposta: '(Resposta livre)',
              dica: 'Use a imaginação! Invente um final bem legal.',
              // Discursivas não tem opções mesmo em multipla escolha (fallback to writing)
            },
          ],
        },
      ],
      criadoEm: new Date().toISOString(),
    };
  }

  if (dados.focoPedagogico === 'matematica') {
    return {
      titulo: `🧮 Desafios Matemáticos: ${dados.interesse1 || 'Diversão'}!`,
      subtitulo: `Matemática — Feito para ${nomes}, ${dados.idade} anos`,
      atividades: [
        {
          tipo: 'problema_contextualizado',
          enunciado: `${nomes} estão organizando uma grande exposição sobre ${dados.interesse1 || 'suas coisas favoritas'}. Para que tudo dê certo, será preciso fazer algumas contas!`,
          questoes: [
            {
              pergunta: `Tinhas 15 itens sobre ${dados.interesse1 || 'o tema'}. Receberam mais 7 de presente relacionados a ${dados.interesse2 || 'outra paixão'}. Quantos itens tem agora para a exposição?`,
              resposta: '22 itens.',
              dica: 'Faça uma continha de adição: 15 + 7.',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['20', '21', '22', '23'], respostaCorreta: '22' } : {})
            },
            {
              pergunta: `No dia da exposição, vieram 24 amigos. Se eles formarem grupos de 4 pessoas, quantos grupos teremos?`,
              resposta: '6 grupos.',
              dica: 'É um problema de divisão: 24 ÷ 4.',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['4', '5', '6', '7'], respostaCorreta: '6' } : {})
            },
            {
              pergunta: `Se gastaram 30 reais para preparar os enfeites de ${dados.interesse2 || 'festa'} e pagaram com uma nota de 50 reais, qual foi o troco?`,
              resposta: '20 reais de troco.',
              dica: 'Subtraia o gasto do valor da nota: 50 - 30.',
              ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['10', '15', '20', '25'], respostaCorreta: '20' } : {})
            },
          ],
        },
      ],
      criadoEm: new Date().toISOString(),
    };
  }

  // Fallback genérico para outros focos (Raciocínio, Ciências, etc)
  return {
    titulo: `🌟 Missão Especial: ${getFocoLabel(dados.focoPedagogico)}`,
    subtitulo: `${getFocoLabel(dados.focoPedagogico)} — Feito para ${nomes}, ${dados.idade} anos`,
    atividades: [
      {
        tipo: 'desafio_geral',
        enunciado: `${nomes} foram convocados para uma missão sobre ${dados.interesse1 || 'o universo'} e ${dados.interesse2 || 'mistérios da ciência'}. Preparem-se!`,
        questoes: [
          {
            pergunta: `Como você explicaria a importância de ${dados.interesse1 || 'estudar coisas novas'} para um amigo?`,
            resposta: '(Resposta livre)',
            dica: 'Pense por que você gosta tanto disso!',
          },
          {
            pergunta: `Descreva o que acontece quando juntamos ${dados.interesse1 || 'sua ideia principal'} com ${dados.interesse2 || 'sua outra ideia'}.`,
            resposta: '(Resposta criativa)',
            dica: 'Use sua criatividade para juntar os dois temas.',
          },
          {
            pergunta: `Desenhe e descreva um momento muito legal envolvendo ${dados.interesse1 || 'este tema'}.`,
            resposta: '(Desenho + Descrição)',
            dica: 'Capriche no desenho e explique o que está acontecendo.',
          },
        ],
      },
    ],
    criadoEm: new Date().toISOString(),
  };
}

/**
 * Gera atividade para modo predefinido (Mock)
 */
export async function gerarAtividadePredefinidaMock(dados: FormularioPredefinidoData): Promise<AtividadeGerada> {
  await delay(1500);

  const nomes = dados.nomes.join(', ');
  const nomePrincipal = dados.nomes[0] || 'Aluno';

  const templates: Record<string, AtividadeGerada> = {
    'mat-divertida': {
      titulo: `🧮 Matemática Divertida para ${nomes}!`,
      subtitulo: `Problemas coloridos — ${nomes}, ${dados.idade} anos`,
      atividades: [{
        tipo: 'matematica',
        enunciado: `${nomes} foram à feira comprar frutas para uma festa!`,
        questoes: [
          { pergunta: `Se compraram 5 maçãs e 3 bananas, quantas frutas compraram ao todo?`, resposta: '8 frutas', dica: '5 + 3 =', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['6', '7', '8', '9'], respostaCorreta: '8 frutas' } : {}) },
          { pergunta: `Tinham 10 moedas e gastaram 4. Quantas sobraram?`, resposta: '6 moedas', dica: '10 - 4 =', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['4', '5', '6', '7'], respostaCorreta: '6 moedas' } : {}) },
          { pergunta: `Se cada amigo ganhou 2 doces e são 4 amigos, quantos doces distribuíram?`, resposta: '8 doces', dica: '2 × 4 =', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['6', '8', '10', '12'], respostaCorreta: '8 doces' } : {}) },
        ],
      }],
      criadoEm: new Date().toISOString(),
    },
    'historinha': {
      titulo: `📖 A Grande Aventura de ${nomes}!`,
      subtitulo: `Leitura e Interpretação — ${nomes}, ${dados.idade} anos`,
      atividades: [{
        tipo: 'leitura',
        enunciado: `Era uma vez, ${nomes}, crianças muito curiosas que encontraram um mapa misterioso no quintal de casa. O mapa mostrava um caminho até uma árvore mágica que podia conceder um desejo. Pegaram uma lanterna e saíram em busca da árvore. No caminho, encontraram um coelho falante que disse: "Para encontrar a árvore, vocês precisam resolver três enigmas!"`,
        questoes: [
          { pergunta: `O que encontraram no quintal?`, resposta: 'Um mapa misterioso', dica: 'Releia o começo da história!', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Uma chave', 'Um mapa misterioso', 'Um baú', 'Um anel'], respostaCorreta: 'Um mapa misterioso' } : {}) },
          { pergunta: `Quem encontraram no caminho?`, resposta: 'Um coelho falante', dica: 'O animal que fala aparece no meio da história.', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Um sapo', 'Um coelho falante', 'Um leão', 'Uma coruja'], respostaCorreta: 'Um coelho falante' } : {}) },
          { pergunta: `Quantos enigmas precisam resolver?`, resposta: 'Três enigmas', dica: 'O coelho disse um número!', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Um', 'Dois', 'Três', 'Quatro'], respostaCorreta: 'Três enigmas' } : {}) },
        ],
      }],
      criadoEm: new Date().toISOString(),
    },
    'logica': {
      titulo: `🧩 Desafios de Lógica para ${nomes}!`,
      subtitulo: `Raciocínio Lógico — ${nomes}, ${dados.idade} anos`,
      atividades: [{
        tipo: 'logica',
        enunciado: `${nomes} entraram no Laboratório de Enigmas! Cada porta só abre quando se resolve o desafio.`,
        questoes: [
          { pergunta: 'Qual é o próximo número? 2, 4, 6, 8, ...', resposta: '10', dica: 'Está somando sempre o mesmo número!', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['9', '10', '11', '12'], respostaCorreta: '10' } : {}) },
          { pergunta: 'Se todo gato tem rabo, e Mimi é um gato, o que podemos dizer?', resposta: 'Mimi tem rabo', dica: 'Use a lógica: se TODOS têm, Mimi também tem!', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Mimi voa', 'Mimi tem rabo', 'Mimi late', 'Mimi não tem rabo'], respostaCorreta: 'Mimi tem rabo' } : {}) },
          { pergunta: 'Complete: ⭐🌙⭐🌙⭐...', resposta: '🌙', dica: 'Qual é o padrão que se repete?', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['⭐', '🌙', '🌟', '🌍'], respostaCorreta: '🌙' } : {}) },
        ],
      }],
      criadoEm: new Date().toISOString(),
    },
    'cientista': {
      titulo: `🔬 Laboratório de ${nomes}!`,
      subtitulo: `Ciências e Curiosidades — ${nomes}, ${dados.idade} anos`,
      atividades: [{
        tipo: 'ciencias',
        enunciado: `${nomes} colocaram os jalecos de cientista e vão explorar o mundo!`,
        questoes: [
          { pergunta: 'Por que o céu é azul?', resposta: 'A luz do sol se espalha na atmosfera e a cor azul se espalha mais!', dica: 'Tem a ver com a luz do sol e o ar!', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Porque reflete o mar', 'A luz azul se espalha mais no ar', 'Porque Deus pintou', 'Pela poluição'], respostaCorreta: 'A luz azul se espalha mais no ar' } : {}) },
          { pergunta: 'Quantos planetas existem no nosso Sistema Solar?', resposta: '8 planetas', dica: 'Mercúrio, Vênus, Terra...', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['7 planetas', '8 planetas', '9 planetas', '10 planetas'], respostaCorreta: '8 planetas' } : {}) },
          { pergunta: 'O que as plantas precisam para crescer?', resposta: 'Água, luz do sol e terra (nutrientes)', dica: 'Pense no que você dá para uma plantinha!', ...(dados.formatoResposta === 'multipla_escolha' ? { opcoes: ['Só água', 'Água, luz e terra', 'Leite', 'Pedras'], respostaCorreta: 'Água, luz e terra' } : {}) },
        ],
      }],
      criadoEm: new Date().toISOString(),
    },
    'caligrafia': {
      titulo: `✏️ Caligrafia Criativa de ${nomes}!`,
      subtitulo: `Treino de Escrita — ${nomes}, ${dados.idade} anos`,
      atividades: [{
        tipo: 'caligrafia',
        enunciado: `${nomes} vão treinar a escrita com frases divertidas! Copiem cada frase com capricho.`,
        questoes: [
          { pergunta: 'Copie: "A imaginação é mais importante que o conhecimento."', resposta: '(Escrever com capricho)', dica: 'Preste atenção no espaço entre as palavras!' },
          { pergunta: `Copie: "${nomePrincipal} é uma criança incrível e cheia de ideias!"`, resposta: '(Escrever com capricho)', dica: 'Cuidado com as letras maiúsculas!' },
          { pergunta: 'Invente uma frase com as palavras: SOL, BRINCAR, AMIGOS', resposta: '(Resposta criativa)', dica: 'Use a imaginação!' },
        ],
      }],
      criadoEm: new Date().toISOString(),
    },
  };

  return templates[dados.categoriaId] || templates['mat-divertida'];
}

/**
 * Gera atividade diária (Mock)
 */
export async function gerarAtividadeDiariaMock(): Promise<AtividadeDiaria> {
  await delay(800);

  const atividades: AtividadeDiaria[] = [
    {
      id: 'daily-1',
      titulo: '🧮 Desafio Relâmpago',
      descricao: 'Um probleminha rápido para aquecer o cérebro!',
      tipo: 'desafio',
      conteudo: 'Se um trem tem 8 vagões e cada vagão leva 5 passageiros, quantos passageiros o trem leva ao todo?',
      opcoes: ['35 passageiros', '40 passageiros', '45 passageiros', '50 passageiros'],
      respostaCorreta: '40 passageiros',
      resposta: '40 passageiros',
      dica: 'Multiplique o número de vagões pelo número de passageiros!',
    },
    {
      id: 'daily-2',
      titulo: '🧩 Enigma do Dia',
      descricao: 'Exercite seu raciocínio lógico!',
      tipo: 'quebra-cabeca',
      conteudo: 'Eu tenho cidades, mas não tenho casas. Tenho montanhas, mas não tenho árvores. Tenho água, mas não tenho peixes. O que eu sou?',
      opcoes: ['Um globo terrestre', 'Um mapa!', 'Uma bússola', 'Um livro de geografia'],
      respostaCorreta: 'Um mapa!',
      resposta: 'Um mapa!',
      dica: 'É algo que mostra o mundo, mas de um jeito diferente...',
    },
    {
      id: 'daily-3',
      titulo: '🌍 Curiosidade Incrível',
      descricao: 'Aprenda algo novo hoje!',
      tipo: 'curiosidade',
      conteudo: 'Você sabia que os polvos têm 3 corações e sangue azul? Se cada coração bate 60 vezes por minuto, quantas batidas os 3 corações dão juntos em 1 minuto?',
      opcoes: ['120 batidas', '160 batidas', '180 batidas', '200 batidas'],
      respostaCorreta: '180 batidas',
      resposta: '180 batidas por minuto!',
      dica: '3 corações × 60 batidas = ?',
    },
  ];

  // Rotaciona baseado no dia do ano
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return atividades[dayOfYear % atividades.length];
}

// ---- Helpers ----

function getFocoLabel(foco: string): string {
  const labels: Record<string, string> = {
    'matematica': 'Matemática',
    'leitura': 'Leitura',
    'raciocinio-logico': 'Raciocínio Lógico',
    'ciencias': 'Ciências',
    'portugues': 'Português',
    'caligrafia': 'Caligrafia',
    'interpretacao': 'Interpretação de Texto',
    'livre': 'Tema Livre / História',
  };
  return labels[foco] || foco;
}
