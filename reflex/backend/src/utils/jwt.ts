import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev-only";

export interface AuthTokenPayload {
  userId: string;
  role: "RETAILER" | "DISPATCHER" | "RIDER";
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET!);
  return decoded as unknown as AuthTokenPayload;
}
