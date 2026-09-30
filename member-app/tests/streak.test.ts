import assert from 'node:assert/strict';
import test from 'node:test';
import {gentleStreak} from '../src/data.ts';
test('Private streaks count calendar days once and keep yesterday alive before today is completed',()=>{const now=new Date(2026,9,1,12);assert.equal(gentleStreak([new Date(2026,8,30,22).toISOString(),new Date(2026,8,30,8).toISOString(),new Date(2026,8,29,8).toISOString()],now),2);assert.equal(gentleStreak([new Date(2026,8,29,8).toISOString()],now),0);assert.equal(gentleStreak([new Date(2026,9,1,8).toISOString(),new Date(2026,8,30,22).toISOString()],now),2);});
