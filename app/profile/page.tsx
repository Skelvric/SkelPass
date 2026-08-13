import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/DashboardShell/DashboardShell';

import { DeviceTracker } from '@/components/DeviceTracker/DeviceTracker';

import { ProfileSettings } from '@/components/ProfileSettings/ProfileSettings';

import { createClient } from '@/lib/supabase/server';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user)
    redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('userId', data.user.id).maybeSingle();
  if (!profile?.onboardingCompleted)
    redirect('/onboarding');
  const { data: devices } = await supabase.from('loginDevices').select('*').eq('userId', data.user.id).order('lastSeenAt', { ascending: false });
  return <DashboardShell userEmail={data.user.email ?? 'Account'}><DeviceTracker userId={data.user.id} /><ProfileSettings user={{ id: data.user.id, email: data.user.email ?? '' }} profile={profile} devices={devices ?? []} /></DashboardShell>;
}
