import { UserService } from '../services/user.service';
import { ValidateUtility } from '../utils/validate.utility';

export interface ServiceRegistry {
  userService: UserService;
  validateUtility: ValidateUtility;
}

class ServiceRegistryImpl implements ServiceRegistry {
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

  // Method to reset services (useful for testing)
  reset(): void {
    this._userService = null;
    this._validateUtility = null;
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistryImpl(); 