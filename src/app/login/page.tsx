'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { isAxiosError } from 'axios';
import { ArrowRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      // Use auth context to update state (which now uses cookies)
      login(token);
      router.push('/dashboard');
    } catch (err) {
      if (isAxiosError(err)) {
        setError((err.response?.data as { message?: string } | undefined)?.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(107,70,193,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(242,205,84,0.18),_transparent_24%),linear-gradient(180deg,_#faf5ff_0%,_#fffbea_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="hidden overflow-hidden border-white/70 bg-[linear-gradient(135deg,_rgba(85,60,154,0.98)_0%,_rgba(107,70,193,0.98)_45%,_rgba(242,205,84,0.9)_100%)] text-white lg:block">
            <CardContent className="flex h-full flex-col justify-between p-8 pt-8 xl:p-10 xl:pt-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Secure access
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white xl:text-5xl">Manage your smart locker network with clarity.</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200/85 xl:text-base">
                  Access containers, lockers, and order operations from a clean control center designed for fast monitoring and confident day-to-day management.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Protected session flow</p>
                      <p className="mt-1 text-sm text-slate-200/80">Authenticated access with your existing token and routing logic.</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/70">Overview</p>
                    <p className="mt-3 text-2xl font-semibold text-white">Containers</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200/80">View deployment health and active infrastructure quickly.</p>
                  </div>
                  <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/70">Operations</p>
                    <p className="mt-3 text-2xl font-semibold text-white">Orders</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200/80">Track delivery progress, locker status, and pickup activity.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 pt-6 sm:p-8 sm:pt-8">
              <div className="mx-auto max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <Lock className="h-5 w-5" />
                </div>

                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Smart locker platform
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Sign in</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Enter your account details to continue to the dashboard.
                  </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email address</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Password</label>
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="w-full rounded-2xl bg-[#1C1F26] text-white hover:bg-[#1C1F26]/90"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </Button>

                  <div className="text-center text-sm text-slate-500">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/register')}
                      className="font-medium text-[#1C1F26] transition-colors hover:text-[#1C1F26]/80"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
