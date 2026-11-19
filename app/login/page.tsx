import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="mx-auto w-full max-w-[400px] space-y-2.5 p-4">
        <div className="flex h-20 items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white">
            <AcmeLogo />
          </div>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}