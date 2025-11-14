// src/web-push.config.ts
import * as webPush from 'web-push';

export function configureWebPush() {
  webPush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  console.log('✅ Web Push configuré avec succès !');
  return webPush;
}
