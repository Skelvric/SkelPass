import { redirect } from 'next/navigation';

import { Container } from '@/components/Container/Container';

import { OnboardingFlow } from '@/components/OnboardingFlow/OnboardingFlow';

import { createClient } from '@/lib/supabase/server';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user)
    redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('onboardingCompleted').eq('userId', data.user.id).maybeSingle();
  if (profile?.onboardingCompleted)
    redirect('/dashboard');
  return <main className="min-h-screen bg-[#f7f8fc]"><Container className="py-10 sm:py-14"><OnboardingFlow userId={data.user.id} email={data.user.email ?? undefined} /></Container></main>;
}
