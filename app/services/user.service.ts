import { ValidateUtility } from '../utils/validate.utility';

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class UserService {
  private validateUtility: ValidateUtility;
  private users: User[] = [];

  constructor(validateUtility: ValidateUtility) {
    this.validateUtility = validateUtility;
    // Initialize with a test user
    this.users.push({
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date()
    });
  }

  getEmail(): string {
    return "user@example.com";
  }

  isEmailValid(): boolean {
    return this.validateUtility.isValidEmail(this.getEmail());
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  async registerUser(email: string, password: string): Promise<User> {
    if (!this.validateUtility.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  validatePassword(password: string): boolean {
    return password.length >= 6;
  }
}
