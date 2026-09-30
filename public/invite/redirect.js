// Universal Links open an installed iPhone app before this browser fallback.
// Never forward an invitation ticket to the App Store or another website.
if (window.WELLVIE_APP_STORE_LIVE === true) {
  location.replace('https://apps.apple.com/app/id6815497100');
} else {
  const destination = new URL('/app/', location.origin);
  const incoming = new URLSearchParams(location.search);
  for (const name of ['__clerk_ticket', '__clerk_status']) {
    const value = incoming.get(name);
    if (value) destination.searchParams.set(name, value);
  }
  location.replace(destination.href);
}
