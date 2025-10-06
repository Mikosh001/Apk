import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const signToken = (payload: JwtPayload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

export const verifyToken = (token: string) => jwt.verify(token, SECRET) as JwtPayload;
