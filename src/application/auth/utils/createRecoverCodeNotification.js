export const createRecoverCodeNotification = ({ code }) => {
  return `
    <html>
      <body>
        <h1>Código de Recuperación de Contraseña</h1>
        <p>Utiliza el siguiente código para recuperar tu contraseña:</p>
        <h2 style="color: #2e6c80;">${code}</h2>
        <p>Si no solicitaste este código, por favor ignora este correo.</p>
      </body>
    </html>
  `;
};