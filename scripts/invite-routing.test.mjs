import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/invite/redirect.js',import.meta.url),'utf8');
function target(flag,search='?__clerk_ticket=private-test-ticket&__clerk_status=sign_up&redirect=https://evil.example'){
  let destination;
  vm.runInNewContext(source,{URL,URLSearchParams,window:{WELLVIE_APP_STORE_LIVE:flag},location:{origin:'https://www.well-vie.com',search,replace:value=>{destination=value;}}});
  return new URL(destination);
}
test('Default and false route to the same-origin member app and preserve the invitation',()=>{for(const flag of [undefined,false,'true']){const url=target(flag);assert.equal(url.origin,'https://www.well-vie.com');assert.equal(url.pathname,'/app/');assert.equal(url.searchParams.get('__clerk_ticket'),'private-test-ticket');assert.equal(url.searchParams.get('__clerk_status'),'sign_up');assert.equal(url.searchParams.has('redirect'),false);}});
test('Live App Store flag goes to the actual listing without an invitation token',()=>{assert.equal(target(true).href,'https://apps.apple.com/app/id6815497100');});
