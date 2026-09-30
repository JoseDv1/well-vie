import {useEffect, useRef, useState} from 'react';
import {Menu, X, Leaf, Sparkles, BookOpen, CalendarDays, Users, UserRound} from 'lucide-react';

const destinations = [
  {path:'/check-in',label:'Check in',icon:Leaf},
  {path:'/toolkit',label:'Toolkit',icon:Sparkles},
  {path:'/journal',label:'Journal',icon:BookOpen},
  {path:'/gatherings',label:'Gatherings',icon:CalendarDays},
  {path:'/reset',label:'The Reset',icon:Leaf},
  {path:'/circle',label:'Circle',icon:Users},
  {path:'/profile',label:'My profile',icon:UserRound},
];

export function NavigationDrawer({active, unread, go}:{active:string;unread:number;go:(path:string)=>void}) {
  const panel=useRef<HTMLDialogElement>(null);
  const [open,setOpen]=useState(false);
  const close=()=>{panel.current?.close();setOpen(false);};
  useEffect(()=>{
    if(!open)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=previous;};
  },[open]);
  return <>
    <button className="icon-button drawer-trigger" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={open}
      onClick={()=>{panel.current?.showModal();setOpen(true);}}><Menu size={24}/></button>
    <dialog ref={panel} className="navigation-drawer" aria-label="Navigation" onClose={()=>setOpen(false)}
      onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}}>
      <div className="drawer-heading"><img src="/app/assets/wordmark.png" alt="Well-Vie"/><button className="icon-button" aria-label="Close navigation" onClick={close}><X size={23}/></button></div>
      <nav aria-label="Main navigation">{destinations.map(({path,label,icon:Icon})=><button key={path} aria-current={active===path?'page':undefined} onClick={()=>{close();go(path);}}><Icon size={23}/><span>{label}</span>{path==='/circle'&&unread>0&&<small className="badge">{unread>99?'99+':unread}</small>}</button>)}</nav>
    </dialog>
  </>;
}
