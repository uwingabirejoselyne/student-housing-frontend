/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import authService from '../services/auth.service';

/**
 * Register new user
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, university } = req.body;

    const result = await authService.signup({
      name,
      email,
      password,
      role,
      phone,
      university
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    const statusCode = error.message.includes('already exists') ? 400 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to register user'
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const result = await authService.login({ email, password, role });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    console.error('Login error:', error);
    const statusCode = error.statusCode ||
                       (error.message.includes('Invalid') ? 401 :
                        error.message.includes('provide') ? 400 : 500);
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to login'
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const result = await authService.getProfile(userId);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to get profile'
    });
  }
};
