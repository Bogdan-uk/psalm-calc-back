import { Joi, celebrate, Segments } from 'celebrate';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const addUserSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    groupId: Joi.string().regex(objectIdPattern).required().messages({
      'string.pattern.base': 'Неверный формат ID группы'
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().regex(objectIdPattern).required().messages({
      'string.pattern.base': 'Неверный формат ID пользователя',
      'any.required': 'ID пользователя обязателен'
    })
  })
});
