import axios from "axios";

export class LoginCredentials {
  constructor(email = "", password = "") {
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.email.trim()) throw new Error("Email address is required.");
    if (!this.password) throw new Error("Password is required.");
  }

  toPayload() {
    this.validate();
    return {
      email: this.email,
      password: this.password,
    };
  }
}

export class RegisterCredentials {
  constructor(fullName = "", email = "", password = "") {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.fullName.trim()) throw new Error("Full name is required.");
    if (!this.email.trim()) throw new Error("Email address is required.");
    if (this.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
  }

  toPayload() {
    this.validate();
    return {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    };
  }
}

export class AuthApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async login(loginCredentials) {
    const res = await axios.post(
      `${this.baseUrl}/api/auth/users/login`,
      loginCredentials.toPayload(),
      { withCredentials: true }
    );
    return res.data;
  }

  async register(registerCredentials) {
    const res = await axios.post(
      `${this.baseUrl}/api/auth/users/register`,
      registerCredentials.toPayload(),
      { withCredentials: true }
    );
    return res.data;
  }
}

export const authService = new AuthApiService();