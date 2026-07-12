export function getWelcomeEmailHtml(userName: string): string {
  const firstName = userName ? userName.split(' ')[0] : 'Fazendeiro(a)';
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao CadernoVivo!</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #6366f1; padding: 40px 20px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">CadernoVivo 🌱</h1>
                  <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Menos tela. Mais diversão inteligente.</p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px; color: #334155; line-height: 1.6;">
                  <h2 style="margin-top: 0; color: #1e293b; font-size: 22px;">Olá, ${firstName}! Que alegria ter você aqui. 🎉</h2>
                  
                  <p style="font-size: 16px;">
                    O CadernoVivo foi criado com muito carinho para ajudar crianças a aprenderem brincando, enquanto se desconectam um pouco das telas.
                  </p>
                  
                  <p style="font-size: 16px;">
                    Aqui você pode criar <strong>labirintos, caça-palavras, histórias interativas e até jogos de matemática</strong>, tudo gerado sob medida por Inteligência Artificial e pronto para imprimir!
                  </p>
                  
                  <!-- CTA Box -->
                  <div style="background-color: #f1f5f9; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                    <h3 style="margin-top: 0; color: #b45309; font-size: 18px;">🎁 Seu primeiro presente!</h3>
                    <p style="margin: 0; font-size: 15px;">
                      Nós acabamos de plantar a sua <strong>Árvore da Sabedoria</strong> na Fazendinha. Faça sua primeira atividade hoje para ganhar sementes e começar a ver ela crescer!
                    </p>
                  </div>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://cadernovivo.com/dashboard" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                          Ir para o meu Painel 🚀
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="font-size: 15px; color: #64748b; margin-bottom: 0;">
                    Se precisar de qualquer ajuda, basta responder a este e-mail. Estaremos prontos para ajudar!<br><br>
                    Com carinho,<br>
                    <strong>Equipe CadernoVivo</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #f1f5f9; padding: 20px; font-size: 13px; color: #94a3b8;">
                  <p style="margin: 0;">© ${new Date().getFullYear()} CadernoVivo. Todos os direitos reservados.</p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
