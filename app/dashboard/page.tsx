import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/DashboardShell/DashboardShell';
import { DeviceTracker } from '@/components/DeviceTracker/DeviceTracker';
import { PasswordManager } from '@/components/PasswordManager/PasswordManager';

import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user)
    redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('onboardingCompleted').eq('userId', data.user.id).maybeSingle();
  if (!profile?.onboardingCompleted)
    redirect('/onboarding');
  return <DashboardShell userEmail={data.user.email ?? 'Account'}><DeviceTracker userId={data.user.id} /><PasswordManager user={{ id: data.user.id, email: data.user.email }} /></DashboardShell>;
}
