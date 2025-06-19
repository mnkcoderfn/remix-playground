export class UserService {
  private email: string;

  constructor() {
    this.email = "user@example.com";
  }

  getEmail(): string {
    return this.email;
  }
}
