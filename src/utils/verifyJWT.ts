import jwt from "jsonwebtoken";

export class TokenInvalidError extends Error {
  constructor(message = "Invalid token") {
    super(message);
    this.name = "TokenInvalidError";
  }
}

export class TokenExpiredCustomError extends Error {
  constructor(message = "Token expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export function verifyToken<T>(token: string, secret: string): T {
  try {
    return jwt.verify(token, secret) as T;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredCustomError();
    }
    throw new TokenInvalidError();
  }
}
