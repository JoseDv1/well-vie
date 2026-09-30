import {createContext,useContext,type ReactNode} from 'react';
import type {DB,Profile,Practice} from './data';
export type MemberContextValue={db:DB;profile:Profile;refreshProfile:()=>Promise<void>;go:(path:string)=>void;route:string;signOut:()=>Promise<void>;play:(p:Practice)=>Promise<void>;playing:Practice|null;paused:boolean;pause:()=>void;stop:()=>void;playbackEventID:string;completedPracticeID:number|null};
export const MemberContext=createContext<MemberContextValue>(null!);
export const useMember=()=>useContext(MemberContext);
export function MemberProvider({value,children}:{value:MemberContextValue;children:ReactNode}){return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;}
