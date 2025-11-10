const logo = "http://localhost:3050/assets/imgs/logo.png"

export const createCustomerNotification = ({ customer }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Welcome to Versanet</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .header img {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 20px;
          text-align: left;
        }
        .content h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #1f2937;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 20px;
        }
        .cta-button:hover {
          background-color: #151b24ff;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #777777;
          border-top: 1px solid #eeeeee;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 10px;
          }
          .header img {
            max-width: 120px;
          }
          .content h1 {
            font-size: 20px;
          }
          .content p {
            font-size: 14px;
          }
          .cta-button {
            font-size: 14px;
            padding: 10px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src=${logo} alt="Logo de Versanet">
        </div>
        <div class="content">
          <h1>¡Bienvenido, ${customer.name}!</h1>
          <p>¡Gracias por unirte a Versanet! Estamos emocionados de tenerte con nosotros y ansiamos que explores todo lo que tenemos para ofrecerte.</p>
          <p>Si tienes alguna pregunta o necesitas asistencia, nuestro equipo de soporte está aquí para ayudarte en cada paso del camino.</p>
          <a href="mailto:support@versanet.com" class="cta-button">Contactar Soporte</a>
        </div>
        <div class="footer">
          <p>Saludos cordiales,<br>El Equipo de Versanet</p>
          <p>Versanet | 123 Business Ave, Tech City | <a href="https://www.versanet.com">www.versanet.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
