import test from 'node:test';
import assert from 'node:assert/strict';
import {presentMessages} from '../src/message-presentation.ts';
import type {Message} from '../src/data.ts';
import type {OutgoingMessage} from '../src/message-delivery.ts';
const profile={id:'member',name:'Alex'};
const draft:OutgoingMessage={id:'local-message',body:'Hello',created_at:'2026-10-01T00:59:58Z',status:'sending'};
const localTimes=new Map([[draft.id,draft.created_at]]);
const server:Message={id:draft.id,seq:7,circle_id:'circle',sender_id:profile.id,sender_name:profile.name,body:draft.body,created_at:'2026-10-01T01:00:05Z',reply_to:null,reply_body:null,reply_sender:null,attachment_path:null,attachment_name:null,attachment_type:null,edited_at:null,deleted_at:null,reactions:[],moderation_status:'approved',revision:1};
test('Delayed acknowledgement across a minute boundary preserves one row and its immediate local time',()=>{
  const pending=presentMessages([], [draft],profile,'circle',localTimes)[0];
  const acknowledged=presentMessages([server],[draft],profile,'circle',localTimes);
  assert.equal(acknowledged.length,1);
  for(const key of ['id','body','sender_name','created_at'] as const)assert.equal(acknowledged[0][key],pending[key]);
  assert.equal(acknowledged[0].outgoing,undefined);
  assert.equal(acknowledged[0].seq,7);
  assert.equal(presentMessages([server],[],profile,'circle',localTimes)[0].created_at,draft.created_at);
  assert.equal(server.created_at,'2026-10-01T01:00:05Z');
});
test('Failure and retry retain local time while other messages keep server time and sequence order',()=>{
  const earlier={...server,id:'other-member-message',seq:6,sender_id:'peer'};
  for(const status of ['failed','sending'] as const){
    const rows=presentMessages([earlier],[{...draft,status}],profile,'circle',localTimes);
    assert.deepEqual(rows.map(row=>row.id),[earlier.id,draft.id]);
    assert.equal(rows[0].created_at,earlier.created_at);
    assert.equal(rows[1].created_at,draft.created_at);
    assert.equal(rows[1].outgoing?.status,status);
  }
});
