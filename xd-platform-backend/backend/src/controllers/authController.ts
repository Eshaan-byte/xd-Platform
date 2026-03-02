import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerDto, loginDto } from '../dto/auth.dto.js';
import { ApiResponseHelper } from '../types/api.js';

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = registerDto.parse(req.body);

    const result = await authService.register(validatedData);

    res.status(201).json(
      ApiResponseHelper.success(result, 'User registered successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = loginDto.parse(req.body);

    const result = await authService.login(validatedData);

    res.status(200).json(
      ApiResponseHelper.success(result, 'Login successful')
    );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(
        ApiResponseHelper.error('Authentication required', 'User not authenticated')
      );
      return;
    }

    const user = await authService.getUserProfile(req.userId.toString());

    res.status(200).json(
      ApiResponseHelper.success(user, 'Profile retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};
