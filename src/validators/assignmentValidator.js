import { Joi, celebrate, Segments } from 'celebrate';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const assignKathismaSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    groupId: Joi.string().regex(objectIdPattern).required()
  }),
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().regex(objectIdPattern).required().messages({
      'string.pattern.base': 'Неверный формат ID пользователя'
    }),
    kathismaNumber: Joi.number().integer().min(1).max(20).required().messages({
      'number.min': 'Кафизма должна быть от 1 до 20',
      'number.max': 'Кафизма должна быть от 1 до 20',
      'any.required': 'Номер кафизмы обязателен'
    }),
    date: Joi.date().iso().required().messages({
      'date.format': 'Неверный формат даты',
      'any.required': 'Дата обязательна'
    })
  })
});

export const completeAssignmentSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    groupId: Joi.string().regex(objectIdPattern).required(),
    assignmentId: Joi.string().regex(objectIdPattern).required()
  })
});

export const getTodaySchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    groupId: Joi.string().regex(objectIdPattern).required()
  })
});

export const getScheduleSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    groupId: Joi.string().regex(objectIdPattern).required()
  }),
  [Segments.QUERY]: Joi.object().keys({
    days: Joi.number().integer().min(1).max(365).optional()
  })
});

