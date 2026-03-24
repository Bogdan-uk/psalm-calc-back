export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Ошибки Celebrate/Joi
  if (err.isJoi || err.joi) {
    return res.status(400).json({
      error: err.details ? err.details[0].message : err.message
    });
  }

  // Ошибки MongoDB (дубликаты)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `Пользователь с таким ${field} уже существует`
    });
  }

  // Кастомные или стандартные ошибки
  const status = err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(status).json({
    error: message
  });
};
