import { Joi, celebrate, Segments } from 'celebrate';

export const registerSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Имя не может быть пустым',
      'string.min': 'Имя должно быть минимум 2 символа',
      'any.required': 'Имя обязательно'
    }),
    email: Joi.string().required().email().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Email обязателен'
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Пароль должен быть не менее 6 символов',
      'any.required': 'Пароль обязателен'
    })
  })
});

export const loginSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Email обязателен'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль обязателен'
    })
  })
});
