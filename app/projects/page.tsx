// app/projects/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) {
    // Middleware має й так редиректити, але на всяк випадок
    return null;
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' },
  });

  const hasProjects = projects.length > 0;

  return (
    <div className="w-full max-w-3xl bg-white shadow rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Мої проєкти</h1>
        <div className="flex gap-2">
          <Link
            href="/projects/new"
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            Додати проєкт
          </Link>
          <form action="/api/auth/logout" method="POST">
            {/* краще зробити client-side fetch, це просто скелет */}
            <button
              type="submit"
              className="px-3 py-2 rounded border text-sm"
            >
              Вихід
            </button>
          </form>
        </div>
      </div>

      {!hasProjects && (
        <div className="text-gray-600">
          <p>У вас немає проєктів.</p>
          <p className="mt-2">
            <Link href="/projects/new" className="text-blue-600 underline">
              Додайте свій перший проєкт
            </Link>
          </p>
        </div>
      )}

      {hasProjects && (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="font-semibold">{p.name}</h2>
                {p.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {p.description}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Статус:{' '}
                  <span className="font-medium">
                    {p.status === 'ACTIVE' ? 'Активний' : 'Архівований'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href={`/projects/${p.id}/edit`}
                  className="px-3 py-1 border rounded"
                >
                  Редагувати
                </Link>
                {/* Кнопка видалення — через client-компонент з confirm() */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
