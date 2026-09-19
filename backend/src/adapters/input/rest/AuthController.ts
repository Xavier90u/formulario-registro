import { Request, Response } from 'express';
import { AuthUseCase } from '../../../ports/input/AuthUseCase';
import { sendSuccess, asyncHandler } from './helpers';

export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authUseCase.login(req.body);
    sendSuccess(res, result);
  });

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.authUseCase.register(req.body);
    sendSuccess(res, user, 'Usuario registrado exitosamente', 201);
  });

  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.authUseCase.getProfile(req.user!.id);
    sendSuccess(res, user);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.authUseCase.updateProfile(req.user!.id, req.body);
    sendSuccess(res, user, 'Perfil actualizado exitosamente');
  });
}
