// scripts/generate-vapid.js
const webPush = require('web-push');

const keys = webPush.generateVAPIDKeys();
console.log('=== VAPID KEYS ===');
console.log(JSON.stringify(keys, null, 2));
