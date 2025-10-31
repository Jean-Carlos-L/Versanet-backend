export const errorHandler = (err, req, res, next) => {
  // Si el error tiene un status definido, lo usamos, si no, 500
  const statusCode = err.statusCode || 500;

  // Mensaje seguro para el cliente (evita exponer info sensible)
  const message =
    statusCode === 500
      ? 'Internal server error. Please contact the administrator.'
      : err.message;

  // Log del error para la consola o un archivo
  console.error('🔥 ErrorHandler:', {
    status: statusCode,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Enviar respuesta JSON estandarizada
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    // En desarrollo podrías incluir más detalle:
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}


