import { Joi, celebrate, Segments } from 'celebrate';

export const createGroupSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(3).max(50).messages({
      'string.empty': 'Название группы не может быть пустым',
      'any.required': 'Название группы обязательно'
    })
  })
});
