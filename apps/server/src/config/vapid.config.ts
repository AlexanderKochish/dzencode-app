import { registerAs } from '@nestjs/config';

export default registerAs('vapid', () => ({
  publicKey: process.env.VAPID_PUBLIC_KEY ?? '',
  privateKey: process.env.VAPID_PRIVATE_KEY ?? '',
  subject: process.env.VAPID_SUBJECT ?? 'mailto:admin@inventory.local',
}));
