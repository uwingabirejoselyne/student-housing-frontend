import User from '../models/User';
import { generateToken } from '../utils/jwt';

export class AuthService {
  /**
   * Register a new user
   */
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    university?: string;
  }) {
    const { name, email, password, role, phone, university } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone,
      university
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        university: user.university,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token
    };
  }

  /**
   * Login user
   */
  async login(credentials: {
    email: string;
    password: string;
    role?: string;
  }) {
    const { email, password, role } = credentials;

    // Validate input
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if role matches (if role is provided)
    if (role && user.role !== role) {
      const error: any = new Error(`This account is not registered as a ${role}. Please use the correct login portal.`);
      error.statusCode = 403;
      throw error;
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        university: user.university,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token
    };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        university: user.university,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    };
  }
}

export default new AuthService();
