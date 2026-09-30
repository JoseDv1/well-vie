import {useEffect,useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {Reply} from 'lucide-react';
import {inwardSwipe} from './message-gesture';

export function MessageBubble({own,label,children,actions,onReply}:{own:boolean;label:string;children:ReactNode;actions?:ReactNode;onReply?:()=>void}){
  const root=useRef<HTMLElement>(null),menu=useRef<HTMLDivElement>(null);
  const gesture=useRef<{x:number;y:number;long:boolean;cancelled:boolean}|null>(null),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const [anchor,setAnchor]=useState<{x:number;y:number}|null>(null),[offset,setOffset]=useState(0);
  const [position,setPosition]=useState({left:0,top:0});
  const clear=()=>clearTimeout(timer.current);
  const show=(x?:number,y?:number)=>{if(!actions)return;clear();setOffset(0);const r=root.current!.getBoundingClientRect();setAnchor({x:x??r.left+r.width/2,y:y??r.top+r.height/2});};
  useEffect(()=>()=>clear(),[]);
  useLayoutEffect(()=>{if(!anchor||!menu.current)return;const viewport=window.visualViewport;const bounds=menu.current.getBoundingClientRect();const top=viewport?.offsetTop??0,left=viewport?.offsetLeft??0,width=viewport?.width??window.innerWidth,height=viewport?.height??window.innerHeight;setPosition({left:Math.max(left+12,Math.min(anchor.x-bounds.width/2,left+width-bounds.width-12)),top:Math.max(top+12,Math.min(anchor.y-bounds.height-12,top+height-bounds.height-12))});menu.current.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});},[anchor]);
  useEffect(()=>{if(!anchor)return;const outside=(event:PointerEvent)=>{if(!menu.current?.contains(event.target as Node))setAnchor(null);};const keys=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setAnchor(null);root.current?.focus({preventScroll:true});}};const scroll=(event:Event)=>{if(!menu.current?.contains(event.target as Node))setAnchor(null);};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',keys);document.addEventListener('scroll',scroll,true);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',keys);document.removeEventListener('scroll',scroll,true);};},[anchor]);
  return <div className={'message-wrap '+(own?'own':'')}>
    {onReply&&<Reply className="swipe-reply-hint" size={20} style={{opacity:Math.min(1,Math.abs(offset)/40)}} aria-hidden="true"/>}
    <article ref={root} className={'message '+(own?'own':'')} tabIndex={actions?0:undefined} aria-label={label} aria-haspopup={actions?'dialog':undefined} style={{transform:offset?`translateX(${offset}px)`:undefined}} data-swiping={offset!==0}
      onContextMenu={event=>{if(actions){event.preventDefault();show(event.clientX,event.clientY);}}}
      onKeyDown={event=>{if(actions&&(event.key==='ContextMenu'||(event.shiftKey&&event.key==='F10')||event.key==='Enter'&&event.target===event.currentTarget)){event.preventDefault();show();}}}
      onPointerDown={event=>{if(event.button!==0||(event.target as Element).closest('button,a,input,audio,video'))return;gesture.current={x:event.clientX,y:event.clientY,long:false,cancelled:false};event.currentTarget.setPointerCapture(event.pointerId);clear();if(actions)timer.current=setTimeout(()=>{if(!gesture.current||gesture.current.cancelled)return;gesture.current.long=true;show(gesture.current.x,gesture.current.y);},450);}}
      onPointerMove={event=>{const start=gesture.current;if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.hypot(dx,dy)>8)clear();if(start.long||start.cancelled)return;if(Math.abs(dy)>Math.abs(dx)+10){start.cancelled=true;setOffset(0);return;}if(onReply)setOffset(inwardSwipe(own,dx,dy).offset);}}
      onPointerUp={event=>{clear();const start=gesture.current;gesture.current=null;setOffset(0);if(start&&!start.long&&!start.cancelled&&onReply&&inwardSwipe(own,event.clientX-start.x,event.clientY-start.y).reply)onReply();}}
      onPointerCancel={()=>{clear();gesture.current=null;setOffset(0);}}
      onClickCapture={event=>{if(gesture.current?.long){event.preventDefault();event.stopPropagation();}}}>
      {children}
    </article>
    {anchor&&createPortal(<div ref={menu} className="message-popover" role="dialog" aria-label="Message options" style={position} onClick={event=>{if((event.target as Element).closest('button')){setAnchor(null);}}}>{actions}</div>,document.body)}
  </div>;
}
