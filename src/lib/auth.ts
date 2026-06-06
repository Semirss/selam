import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345';
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  role: string;
  phone: string;
  [key: string]: any;
}

export async function signToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get('selam_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getCurrentUserFromHeaders(req: NextRequest) {
  const id = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role');
  if (!id || !role) return null;
  return { id, role };
}
