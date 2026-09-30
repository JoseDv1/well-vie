import test from 'node:test';
import assert from 'node:assert/strict';
import {connectAudioSession} from '../src/audio-session.ts';

class Player extends EventTarget {
  paused = true; ended = false; currentTime = 10; duration = 120; playbackRate = 1;
  async play(){this.paused=false;this.dispatchEvent(new Event('play'));}
  pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}
}
function fixture(unsupported = '') {
  const handlers = new Map();
  const positions: unknown[] = [];
  const media = {metadata:null,playbackState:'none',
    setActionHandler(action:string,handler:unknown){if(action===unsupported)throw new Error('Unsupported');handlers.set(action,handler);},
    setPositionState(value?:unknown){positions.push(value);}};
  const browser = {audioSession:{type:'auto'},mediaSession:media};
  const audio = new Player();
  let stopped=false;
  const clear=connectAudioSession(audio as unknown as HTMLAudioElement,'Practice',()=>{stopped=true;},()=>{},browser as unknown as Navigator);
  return {audio,media,browser,handlers,positions,clear,stopped:()=>stopped};
}
test('Lock-screen controls follow real playback, bound seeks, and release the session on close',async()=>{
  const f=fixture();
  assert.equal(f.browser.audioSession.type,'playback');
  await f.handlers.get('play')({action:'play'});
  assert.equal(f.audio.paused,false);
  assert.equal(f.media.playbackState,'playing');
  f.handlers.get('seekbackward')({});assert.equal(f.audio.currentTime,0);
  f.handlers.get('seekto')({seekTime:95});assert.equal(f.audio.currentTime,95);
  f.handlers.get('seekforward')({seekOffset:60});assert.equal(f.audio.currentTime,120);
  f.handlers.get('pause')({});assert.equal(f.media.playbackState,'paused');
  f.handlers.get('stop')({});assert.equal(f.stopped(),true);
  f.clear();assert.equal(f.media.playbackState,'none');assert.equal(f.browser.audioSession.type,'auto');
  assert.ok([...f.handlers.values()].every(v=>v===null));
  await f.audio.play();assert.equal(f.media.playbackState,'none');
});
test('Missing metadata and unsupported seek controls cannot break audio playback',async()=>{
  const f=fixture('seekto');f.audio.duration=NaN;
  await f.audio.play();
  f.handlers.get('seekforward')({});
  assert.equal(f.audio.currentTime,10);
  assert.equal(f.media.playbackState,'playing');
  assert.equal(f.positions.at(-1),undefined);
  f.clear();
  const bare=new Player();const clear=connectAudioSession(bare as unknown as HTMLAudioElement,'Practice',()=>{},()=>{},{} as Navigator);
  await bare.play();assert.equal(bare.paused,false);clear();
});
