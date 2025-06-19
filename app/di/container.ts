import { UserService } from '../services/user.service';
import { ValidateUtility } from '../utils/validate.utility';

export interface DIContainer {
  userService: UserService;
  validateUtility: ValidateUtility;
}

class Container implements DIContainer {
  private _userService: UserService | null = null;
  private _validateUtility: ValidateUtility | null = null;

  get validateUtility(): ValidateUtility {
    if (!this._validateUtility) {
      this._validateUtility = new ValidateUtility();
    }
    return this._validateUtility;
  }

  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService(this.validateUtility);
    }
    return this._userService;
  }
}

// Create a singleton instance
export const container = new Container(); 