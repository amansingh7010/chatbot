import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/chat',
  [body('message').not().isEmpty().withMessage('Message is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { message } = req.body;
    console.log(message);

    res.send({});
  }
);

export { router as chatRouter };
