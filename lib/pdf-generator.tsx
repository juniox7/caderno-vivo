import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { AtividadeGerada } from './types';

// Register fonts
// We'll use fonts hosted externally to ensure React-PDF can fetch them
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ede9fe', // primary-100
    paddingBottom: 12,
    marginBottom: 24,
  },
  headerLogo: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: '#7c3aed', // primary-500
  },
  headerCode: {
    fontSize: 12,
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    borderRadius: 4,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 28,
    color: '#6d28d9', // primary-600
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b', // surface-500
    marginBottom: 24,
  },
  atividadeContainer: {
    marginBottom: 30,
  },
  atividadeHeader: {
    backgroundColor: '#f5f3ff', // primary-50
    padding: '8 12',
    borderRadius: 6,
    marginBottom: 12,
  },
  atividadeTipo: {
    fontSize: 10,
    fontWeight: 700,
    color: '#7c3aed',
    textTransform: 'uppercase',
  },
  enunciado: {
    fontSize: 15,
    color: '#334155', // surface-700
    lineHeight: 1.6,
    marginBottom: 20,
  },
  questaoContainer: {
    marginBottom: 28,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#ede9fe',
  },
  perguntaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  numeroCírculo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ede9fe', // primary-100
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    marginRight: 10,
    paddingTop: 3,
  },
  pergunta: {
    fontSize: 14,
    color: '#1e293b', // surface-800
    flex: 1,
    lineHeight: 1.5,
  },
  linhaResposta: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#cbd5e1', // surface-300
    borderBottomStyle: 'dashed',
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 30,
    width: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 10,
    color: '#94a3b8',
  }
});

interface CadernoPDFProps {
  atividade: AtividadeGerada;
  secretCode?: string;
}

export const CadernoPDF = ({ atividade, secretCode }: CadernoPDFProps) => {
  return (
    <Document title={atividade.titulo} author="CadernoVivo">
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLogo}>CadernoVivo</Text>
          {secretCode && (
            <Text style={styles.headerCode}>Código Mágico: {secretCode}</Text>
          )}
        </View>

        {/* Título */}
        <Text style={styles.title}>{atividade.titulo}</Text>
        <Text style={styles.subtitle}>{atividade.subtitulo}</Text>

        {/* Atividades */}
        {atividade.atividades.map((atv, atvIdx) => (
          <View key={atvIdx} style={styles.atividadeContainer}>
            <View style={styles.atividadeHeader}>
              <Text style={styles.atividadeTipo}>{atv.tipo.replace(/_/g, ' ')}</Text>
            </View>
            
            <Text style={styles.enunciado}>{atv.enunciado}</Text>
            
            {atv.imagemUrl && (
              <Image src={atv.imagemUrl} style={{ width: '100%', height: 300, objectFit: 'contain', marginBottom: 20 }} />
            )}

            {atv.questoes.map((q, qIdx) => (
              <View key={qIdx} style={styles.questaoContainer} wrap={false}>
                <View style={styles.perguntaRow}>
                  <Text style={styles.numeroCírculo}>{qIdx + 1}</Text>
                  <Text style={styles.pergunta}>{q.pergunta}</Text>
                </View>
                
                {q.opcoes && q.opcoes.length > 0 ? (
                  <View style={{ marginLeft: 30, marginTop: 8, marginBottom: 12 }}>
                    {q.opcoes.map((opcao, oIdx) => (
                      <View key={oIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#94a3b8', marginRight: 8 }} />
                        <Text style={{ fontSize: 13, color: '#475569' }}>{opcao}</Text>
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

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Impresso no CadernoVivo - {new Date().toLocaleDateString('pt-BR')}
          </Text>
          {secretCode && (
            <Text style={[styles.footerText, { marginTop: 4, color: '#7c3aed', fontWeight: 700 }]}>
              Volte no site e insira o código mágico: {secretCode}
            </Text>
          )}
        </View>

      </Page>
    </Document>
  );
};
