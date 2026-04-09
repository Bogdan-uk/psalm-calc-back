import { Joi, celebrate, Segments } from 'celebrate';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createGroupSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(3).max(50).messages({
      'string.empty': 'Название группы не может быть пустым',
      'any.required': 'Название группы обязательно'
    }),
    isLostListEnabled: Joi.boolean().optional(),
    rotationType: Joi.string().valid('sequential', 'shift').optional(),
    startDate: Joi.date().iso().optional(),
    totalKathismas: Joi.number().min(1).max(150).optional(),
  })
});


export const updateGroupSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    groupId: Joi.string().regex(objectIdPattern).required().messages({
      'string.pattern.base': 'Неверный формат ID группы'
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(3).max(50).optional(),
    description: Joi.string().allow('').max(200).optional(),
    isLostListEnabled: Joi.boolean().optional(),
    rotationType: Joi.string().valid('sequential', 'shift').optional(),
    startDate: Joi.date().iso().optional(),
    totalKathismas: Joi.number().min(1).max(150).optional(),
  })
});

