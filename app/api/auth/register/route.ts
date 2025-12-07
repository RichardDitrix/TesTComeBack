// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email і пароль обов’язкові' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Пароль має містити мінімум 6 символів' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Користувач з таким email вже існує' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hash,
    },
  });

  const token = await signJwt({ userId: user.id, email: user.email });

  const res = NextResponse.json({ user: { id: user.id, email: user.email } });
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 днів
    path: '/',
  });

  return res;
}
