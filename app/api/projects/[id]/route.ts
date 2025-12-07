// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

async function getUserIdFromReq(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  return payload?.userId ?? null;
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromReq(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromReq(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, githubUrl, status } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Назва проєкту обов’язкова' }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description: description || null,
      githubUrl: githubUrl || null,
      status: status === 'ARCHIVED' ? 'ARCHIVED' : 'ACTIVE',
      userId,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
