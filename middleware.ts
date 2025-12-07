// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProjects = pathname.startsWith('/projects');
  const isProjectsApi = pathname.startsWith('/api/projects');

  if (!isProjects && !isProjectsApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    if (isProjectsApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    if (isProjectsApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/projects/:path*', '/api/projects/:path*'],
};
