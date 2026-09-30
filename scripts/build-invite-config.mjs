import {writeFileSync} from 'node:fs';
const value = process.env.WELLVIE_APP_STORE_LIVE ?? 'false';
if (!['true', 'false'].includes(value)) {
  throw new Error('WELLVIE_APP_STORE_LIVE must be true or false.');
}
// A public routing preference, never a credential. Omission defaults to web.
writeFileSync(new URL('../public/invite/availability.js', import.meta.url),
  `window.WELLVIE_APP_STORE_LIVE = ${value};\n`);
console.log(`Invitations route to ${value === 'true' ? 'the App Store' : 'the member website'}.`);
