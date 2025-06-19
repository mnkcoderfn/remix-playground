import { ValidateUtility } from '../utils/validate.utility';

export class UserService {
  private email: string;
  private validateUtility: ValidateUtility;

  constructor(validateUtility: ValidateUtility) {
    this.email = "user@example.com";
    this.validateUtility = validateUtility;
  }

  getEmail(): string {
    return this.email;
  }

  isEmailValid(): boolean {
    return this.validateUtility.isValidEmail(this.email);
  }
}
