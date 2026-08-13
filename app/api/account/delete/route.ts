import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey)
    return NextResponse.json({ error: 'Account deletion is not configured on the server.' }, { status: 500 });
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: avatarFiles } = await admin.storage.from('avatars').list(authData.user.id, { limit: 100 });
  if (avatarFiles?.length) {
    await admin.storage.from('avatars').remove(avatarFiles.map((file) => `${authData.user.id}/${file.name}`));
  }
  const { error } = await admin.auth.admin.deleteUser(authData.user.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
