'use client';

import { useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';
import { getDeviceIdentity } from '@/lib/device';

export function DeviceTracker({ userId }: {
  userId: string;
}) {
  useEffect(() => {
    const device = getDeviceIdentity();
    if (!device)
      return;
    const supabase = createClient();
    void supabase.from('loginDevices').upsert({
      userId,
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      browser: device.browser,
      os: device.os,
      lastSeenAt: new Date().toISOString(),
    }, { onConflict: 'userId,deviceId' });
  }, [userId]);
  return null;
}
