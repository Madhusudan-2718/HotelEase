import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

// Common validation rules
export const validateRoomNumber = body('roomNumber')
  .trim()
  .notEmpty()
  .withMessage('Room number is required')
  .isLength({ min: 1, max: 10 })
  .withMessage('Room number must be between 1 and 10 characters');

export const validateUserId = body('userId')
  .trim()
  .notEmpty()
  .withMessage('User ID is required')
  .isUUID()
  .withMessage('User ID must be a valid UUID');


