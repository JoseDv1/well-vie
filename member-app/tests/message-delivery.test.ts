import test from 'node:test';
import assert from 'node:assert/strict';
import {deliverMessage,type OutgoingMessage} from '../src/message-delivery.ts';
import {inwardSwipe} from '../src/message-gesture.ts';
import type {DB} from '../src/data.ts';

function fixture(){
  const stored=new Set<string>(),calls:any[]=[],uploads:string[]=[];
  let acknowledge=false;
  const db={from:()=>{let id='';const query={select:()=>query,eq:(key:string,value:string)=>{if(key==='id')id=value;return query;},then:(resolve:any)=>resolve({data:stored.has(id)?[{id}]:[],error:null})};return query;},storage:{from:()=>({upload:async(path:string)=>{uploads.push(path);return {error:null};}})},rpc:async(name:string,args:any)=>{calls.push({name,args});stored.add(args.p_id);return acknowledge?{data:args.p_id,error:null}:{data:null,error:new Error('Network response lost')};}} as unknown as DB;
  return {db,calls,uploads,acknowledge:()=>{acknowledge=true;}};
}
test('A lost send response retries the same message without a second send or upload',async()=>{
  const f=fixture();const message:OutgoingMessage={id:'fixture-message',body:'Original content',file:new File(['voice'],'note.m4a',{type:'audio/mp4'}),created_at:'2026-10-01T00:00:00Z',status:'sending'};
  await assert.rejects(deliverMessage(f.db,'circle','member',message));
  await deliverMessage(f.db,'circle','member',message);
  assert.equal(f.calls.length,1);assert.equal(f.uploads.length,1);assert.equal(f.calls[0].args.p_id,message.id);assert.equal(f.calls[0].args.p_body,'Original content');assert.equal(f.uploads[0],'circle/member/fixture-message/attachment.m4a');
});
test('Invalid attachments never upload or create a message',async()=>{const f=fixture();await assert.rejects(deliverMessage(f.db,'circle','member',{id:'invalid',body:'',file:new File(['x'],'unsafe.svg',{type:'image/svg+xml'}),created_at:'',status:'sending'}));assert.equal(f.calls.length,0);assert.equal(f.uploads.length,0);});
test('Reply gesture requires an inward horizontal swipe, not scrolling, an outward swipe or a tap',()=>{
  assert.equal(inwardSwipe(true,-70,8).reply,true);assert.equal(inwardSwipe(false,70,8).reply,true);
  for(const [own,x,y] of [[true,70,0],[false,-70,0],[false,70,70],[true,-12,2],[false,0,80]] as const)assert.equal(inwardSwipe(own,x,y).reply,false);
  assert.equal(inwardSwipe(true,-300,0).offset,-80);assert.equal(inwardSwipe(false,300,0).offset,80);
});
