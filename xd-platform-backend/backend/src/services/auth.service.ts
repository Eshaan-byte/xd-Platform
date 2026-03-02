import bcrypt from 'bcrypt';
import { createModuleLogger } from '../config/logger.js';
import { signToken } from '../config/jwt.js';
import { UserRepository } from '../repositories/user.repository.js';
import { RegisterInput, LoginInput, AuthResponseDto } from '../dto/auth.dto.js';

const logger = createModuleLogger('AuthService');
const SALT_ROUNDS = 12;

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(input: RegisterInput): Promise<AuthResponseDto> {
    try {
      logger.info({ email: input.email }, 'Registering new user');

      const existingEmail = await this.userRepository.findByEmail(input.email);
      if (existingEmail) {
        const error = new Error('Email already in use') as any;
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

      const user = await this.userRepository.create({
        email: input.email,
        password: hashedPassword,
        username: input.username,
        role: 'user',
      });

      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      logger.info({ userId: user._id }, 'User registered successfully');

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to register user');
      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthResponseDto> {
    try {
      logger.debug({ email: input.email }, 'User login attempt');

      const user = await this.userRepository.findByEmail(input.email);
      if (!user || !user.password) {
        const error = new Error('Invalid credentials') as any;
        error.statusCode = 401;
        throw error;
      }

      const isPasswordValid = await bcrypt.compare(input.password, user.password);
      if (!isPasswordValid) {
        const error = new Error('Invalid credentials') as any;
        error.statusCode = 401;
        throw error;
      }

      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      logger.info({ userId: user._id }, 'User logged in successfully');

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to login');
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<AuthResponseDto['user']> {
    try {
      const { default: mongoose } = await import('mongoose');
      const user = await this.userRepository.findById(
        new mongoose.Types.ObjectId(userId)
      );

      if (!user) {
        const error = new Error('User not found') as any;
        error.statusCode = 404;
        throw error;
      }

      return {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get user profile');
      throw error;
    }
  }
}
