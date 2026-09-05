import { Request, Response } from 'express';
import { AuthUseCase } from '../../../ports/input/AuthUseCase';
import { LoginSchema, RegisterSchema } from '../../../shared/utils/validator';
import { CustomError } from '../../../shared/errors/CustomError';

export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.authUseCase.login(validatedData);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
        });
      }
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      const user = await this.authUseCase.register(validatedData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
        });
      }
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const user = await this.authUseCase.getProfile(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
        });
      }
    }
  };
}
