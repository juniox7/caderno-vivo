import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { AtividadeGerada } from './types';
import { MazeGrid } from './maze';
import { WordSearchGrid } from './wordSearch';

// Função para remover Emojis e caracteres que quebram a fonte padrão do PDF (Helvetica só suporta Latin-1)
const stripEmojis = (str?: string) => {
  if (!str) return '';
  // Remove tudo que não for ASCII ou Latin-1 Supplement (incluindo Emojis e quebras como =Ú()
  return str.replace(/[^\x20-\x7E\xA0-\xFF]/g, '').trim();
};

// Estilos otimizados para o Ebook
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8fafc',
  },
  pageBorder: {
    borderWidth: 4,
    borderColor: '#c4b5fd',
    borderRadius: 16,
    padding: 24,
    height: '100%',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  coverPage: {
    padding: 0,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  coverFallback: {
    height: '100%', 
    backgroundColor: '#8b5cf6', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 40,
    borderWidth: 12,
    borderColor: '#a78bfa',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(0,0,0,0.6)', 
    padding: 40,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  coverTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 46,
    color: '#ffffff',
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 22,
    color: '#e2e8f0',
  },
  
  // Header padrão das páginas
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 3,
    borderBottomColor: '#ede9fe',
    paddingBottom: 16,
    marginBottom: 24,
  },
  headerLogo: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: '#7c3aed',
  },
  headerFields: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerFieldText: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  
  // Textos e Títulos
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: '#6d28d9',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 24,
  },
  enunciado: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 1.6,
    marginBottom: 20,
  },
  
  // Questões
  questaoContainer: {
    marginBottom: 24,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#ede9fe',
  },
  perguntaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  numeroCirculo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'center',
    marginRight: 10,
    paddingTop: 4,
  },
  pergunta: {
    fontSize: 13,
    color: '#1e293b',
    flex: 1,
    lineHeight: 1.5,
  },
  linhaResposta: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'dashed',
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 30,
    width: '80%',
  },

  // Labirinto
  mazeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  mazeRow: {
    flexDirection: 'row',
  },
  mazeCell: {
    width: 25,
    height: 25,
    borderColor: '#334155',
  },

  // Caça-Palavras
  wordSearchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  wsRow: {
    flexDirection: 'row',
  },
  wsCell: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  wsText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  wordListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
    gap: 10,
  },
  wordPill: {
    backgroundColor: '#f1f5f9',
    padding: '4 10',
    borderRadius: 10,
    fontSize: 12,
    color: '#475569',
    margin: 4,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    borderTopWidth: 2,
    borderTopColor: '#ede9fe',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#a78bfa',
  }
});

// Tipos para o Ebook
export type EbookPageData = 
  | { tipo: 'capa'; titulo: string; subtitulo: string; imagemUrl?: string }
  | { tipo: 'atividade'; conteudo: AtividadeGerada }
  | { tipo: 'labirinto'; titulo: string; enunciado: string; grid: MazeGrid }
  | { tipo: 'caca_palavras'; titulo: string; enunciado: string; grid: WordSearchGrid; palavras: string[] }
  | { tipo: 'colorir'; titulo: string; enunciado: string; imagemUrl: string };

export interface EbookData {
  paginas: EbookPageData[];
}

// Subcomponente de Header
const Header = () => (
  <View style={styles.header} fixed>
    <Text style={styles.headerLogo}>CadernoVivo</Text>
    <View style={styles.headerFields}>
      <Text style={styles.headerFieldText}>Nome: ___________________________________</Text>
      <Text style={styles.headerFieldText}>Data: _______/_______/_________</Text>
    </View>
  </View>
);

// Subcomponente de Footer
const Footer = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
      `★ CadernoVivo ★ Página ${pageNumber} de ${totalPages}`
    )} />
  </View>
);

export const EbookPDF = ({ ebook }: { ebook: EbookData }) => {
  return (
    <Document title="Ebook CadernoVivo" author="CadernoVivo">
      {ebook.paginas.map((pagina, idx) => {
        
        // Renderização da CAPA
        if (pagina.tipo === 'capa') {
          return (
            <Page key={idx} size="A4" style={styles.coverPage}>
              {pagina.imagemUrl ? (
                <>
                  <Image src={pagina.imagemUrl} style={styles.coverImage} />
                  <View style={styles.coverOverlay}>
                    <Text style={styles.coverTitle}>{stripEmojis(pagina.titulo)}</Text>
                    <Text style={styles.coverSubtitle}>{stripEmojis(pagina.subtitulo)}</Text>
                  </View>
                </>
              ) : (
                <View style={styles.coverFallback}>
                  <Text style={[styles.coverTitle, { textAlign: 'center', fontSize: 52 }]}>{stripEmojis(pagina.titulo)}</Text>
                  <Text style={[styles.coverSubtitle, { textAlign: 'center', color: '#f8fafc' }]}>{stripEmojis(pagina.subtitulo)}</Text>
                </View>
              )}
            </Page>
          );
        }

        // Renderização de ATIVIDADE (Questões e Texto)
        if (pagina.tipo === 'atividade') {
          return (
            <Page key={idx} size="A4" style={styles.page}>
              <View style={styles.pageBorder}>
                <Header />
                <Text style={styles.title}>{stripEmojis(pagina.conteudo.titulo)}</Text>
                
                {pagina.conteudo.atividades.map((atv, aIdx) => (
                  <View key={aIdx} style={{ marginBottom: 20 }}>
                    <Text style={[styles.subtitle, { color: '#7c3aed', fontWeight: 'bold' }]}>{stripEmojis(atv.tipo)}</Text>
                    <Text style={styles.enunciado}>{stripEmojis(atv.enunciado)}</Text>
                    
                    {atv.imagemUrl && (
                      <Image src={atv.imagemUrl} style={{ width: '100%', height: 200, objectFit: 'contain', marginBottom: 20 }} />
                    )}

                    {atv.questoes.map((q, qIdx) => (
                      <View key={qIdx} style={styles.questaoContainer} wrap={false}>
                        <View style={styles.perguntaRow}>
                          <Text style={styles.numeroCirculo}>{qIdx + 1}</Text>
                          <Text style={styles.pergunta}>{stripEmojis(q.pergunta)}</Text>
                        </View>
                        
                        {q.opcoes && q.opcoes.length > 0 ? (
                          <View style={{ marginLeft: 30, marginTop: 4, marginBottom: 12 }}>
                            {q.opcoes.map((opcao, oIdx) => (
                              <View key={oIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#94a3b8', marginRight: 8 }} />
                                <Text style={{ fontSize: 12, color: '#475569' }}>{stripEmojis(opcao)}</Text>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <>
                            <View style={styles.linhaResposta} />
                            <View style={styles.linhaResposta} />
                          </>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
                <Footer />
              </View>
            </Page>
          );
        }

        // Renderização de LABIRINTO
        if (pagina.tipo === 'labirinto') {
          return (
            <Page key={idx} size="A4" style={styles.page}>
              <View style={styles.pageBorder}>
                <Header />
                <Text style={styles.title}>{stripEmojis(pagina.titulo)}</Text>
                <Text style={styles.enunciado}>{stripEmojis(pagina.enunciado)}</Text>
                
                <View style={styles.mazeContainer}>
                  {pagina.grid.map((row, y) => (
                    <View key={y} style={styles.mazeRow}>
                      {row.map((cell, x) => (
                        <View key={x} style={[
                          styles.mazeCell,
                          {
                            borderTopWidth: cell.top ? 2 : 0,
                            borderRightWidth: cell.right ? 2 : 0,
                            borderBottomWidth: cell.bottom ? 2 : 0,
                            borderLeftWidth: cell.left ? 2 : 0,
                            backgroundColor: (x === 0 && y === 0) ? '#dcfce3' : (x === row.length -1 && y === pagina.grid.length -1) ? '#fee2e2' : 'transparent'
                          }
                        ]}>
                          {x === 0 && y === 0 && <Text style={{ fontSize: 8, textAlign: 'center', marginTop: 6, color: '#166534' }}>IN</Text>}
                          {x === row.length -1 && y === pagina.grid.length -1 && <Text style={{ fontSize: 8, textAlign: 'center', marginTop: 6, color: '#991b1b' }}>OUT</Text>}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
                <Footer />
              </View>
            </Page>
          );
        }

        // Renderização de CAÇA-PALAVRAS
        if (pagina.tipo === 'caca_palavras') {
          return (
            <Page key={idx} size="A4" style={styles.page}>
              <View style={styles.pageBorder}>
                <Header />
                <Text style={styles.title}>{stripEmojis(pagina.titulo)}</Text>
                <Text style={styles.enunciado}>{stripEmojis(pagina.enunciado)}</Text>
                
                <View style={styles.wordSearchContainer}>
                  {pagina.grid.map((row, y) => (
                    <View key={y} style={styles.wsRow}>
                      {row.map((letra, x) => (
                        <View key={x} style={styles.wsCell}>
                          <Text style={styles.wsText}>{letra}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>

                <View style={styles.wordListContainer}>
                  {pagina.palavras.map((palavra, pIdx) => (
                    <Text key={pIdx} style={styles.wordPill}>{stripEmojis(palavra)}</Text>
                  ))}
                </View>
                <Footer />
              </View>
            </Page>
          );
        }

        // Renderização de DESENHO PARA COLORIR
        if (pagina.tipo === 'colorir') {
          return (
            <Page key={idx} size="A4" style={styles.page}>
              <View style={styles.pageBorder}>
                <Header />
                <Text style={styles.title}>{stripEmojis(pagina.titulo)}</Text>
                <Text style={styles.enunciado}>{stripEmojis(pagina.enunciado)}</Text>
                
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {/* Imagem deve vir da Fal.ai gerada em P&B / Line Art */}
                  <Image src={pagina.imagemUrl} style={{ width: '100%', height: '80%', objectFit: 'contain' }} />
                </View>
                
                <Footer />
              </View>
            </Page>
          );
        }

        return null;
      })}
    </Document>
  );
};
