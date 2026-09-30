# Member web release

Members use https://www.well-vie.com/app/ with their existing production account. This route is not linked from the public marketing website and is excluded from search indexing.

## Invitation destination

Set `WELLVIE_APP_STORE_LIVE` in the Vercel project's Production environment:

- `false` (also the default when unset): `/invite` forwards to `/app/` on the same domain and preserves Clerk invitation parameters.
- `true`: `/invite` forwards to https://apps.apple.com/app/id6815497100. Invitation tokens are never forwarded to Apple.

Redeploy the production website after changing the variable. Set it to `true` only once Apple's approval is complete and the public US listing can be downloaded. Merely submitting for review is insufficient. Installed iPhone apps may open directly through Universal Links before the browser fallback runs. Browser and user settings can affect link handling.

`/app/` remains available in both modes. Browser push notifications and offline private content are not enabled. Members can add the browser app to their home screen.

## Verification

Run `npm test --prefix member-app`, `npm run test:invite`, and `npm run build`. Verify real sign-in on well-vie.com: production Clerk intentionally rejects localhost and unrelated preview domains. Test with a dedicated member account, including journal save, practice playback, profile updates and Circle messages. Never use live members' content for test mutations.
