// iOS opens the installed app through Universal Links. In a browser,
// continue to the private member app without disclosing invitation tokens.
const destination = new URL('/app/', location.origin);
const incoming = new URLSearchParams(location.search);
for (const name of ['__clerk_ticket', '__clerk_status']) {
  const value = incoming.get(name);
  if (value) destination.searchParams.set(name, value);
}
location.replace(destination.href);
