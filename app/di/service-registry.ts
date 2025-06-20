import { UserService } from '../services/user.service';
import { ValidateUtility } from '../utils/validate.utility';
import { DatabaseService } from '../services/database.service';

export interface ServiceRegistry {
  userService: UserService;
  validateUtility: ValidateUtility;
  databaseService: DatabaseService;
}

class ServiceRegistryImpl implements ServiceRegistry {
  private _userService: UserService | null = null;
  private _validateUtility: ValidateUtility | null = null;
  private _databaseService: DatabaseService | null = null;

  get validateUtility(): ValidateUtility {
    if (!this._validateUtility) {
      this._validateUtility = new ValidateUtility();
    }
    return this._validateUtility;
  }

  get databaseService(): DatabaseService {
    if (!this._databaseService) {
      this._databaseService = new DatabaseService();
    }
    return this._databaseService;
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
    this._databaseService = null;
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistryImpl(); 