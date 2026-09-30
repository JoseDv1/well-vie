import {useEffect,useMemo,useRef} from 'react';
import {LoaderCircle,Pause,Play} from 'lucide-react';

// Exact SplitMix64 sequence and particle parameters from iOS AudioMotion.swift.
export function haloParticles(seed:number) {
  const mask=(1n<<64n)-1n, step=0x9E3779B97F4A7C15n;
  let state=(BigInt(seed)+step)&mask;
  const next=()=>{state=(state+step)&mask;let value=state;value=((value^(value>>30n))*0xBF58476D1CE4E5B9n)&mask;value=((value^(value>>27n))*0x94D049BB133111EBn)&mask;return value^(value>>31n);};
  const unit=()=>Number(next()>>11n)/9007199254740992;
  return Array.from({length:150},()=>{const direction=(next()&1n)===0n?1:-1;return {angle:unit()*Math.PI*2,radius:.10+Math.sqrt(unit())*.72,dotRadius:.55+unit()*2.35,opacity:.28+unit()*.57,turns:(1+Number(next()%3n))*direction,wobble:.006+unit()*.018,phase:unit()*Math.PI*2};});
}

export function AudioHalo({seed,title,playing,loading,onToggle}:{seed:number;title:string;playing:boolean;loading:boolean;onToggle:()=>void}) {
  const canvas=useRef<HTMLCanvasElement>(null), elapsed=useRef(0);
  const particles=useMemo(()=>haloParticles(seed),[seed]);
  useEffect(()=>{elapsed.current=0;},[seed]);
  useEffect(()=>{
    const element=canvas.current;if(!element)return;
    const context=element.getContext('2d');if(!context)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,last=performance.now(),lastDraw=0;
    const draw=(now:number)=>{
      const moving=playing&&!loading&&!reduced.matches&&!document.hidden;
      if(moving)elapsed.current+=Math.max(0,now-last);last=now;
      if(now-lastDraw>=1000/30||!moving){
        lastDraw=now;
        const size=element.getBoundingClientRect().width,dpr=window.devicePixelRatio||1;
        if(element.width!==Math.round(size*dpr)){element.width=Math.round(size*dpr);element.height=element.width;}
        context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,size,size);
        const radius=size/2,phase=reduced.matches?0:(elapsed.current%120000)/120000;
        const dusk=document.documentElement.dataset.theme==='dusk';
        const halo=context.createRadialGradient(radius,radius,0,radius,radius,radius);
        halo.addColorStop(0,'#70835f');halo.addColorStop(.46,'rgba(156,175,134,.96)');halo.addColorStop(.74,dusk?'rgba(62,78,53,.76)':'rgba(212,220,206,.76)');halo.addColorStop(.90,dusk?'rgba(44,54,39,.30)':'rgba(234,240,228,.30)');halo.addColorStop(1,dusk?'rgba(44,54,39,0)':'rgba(234,240,228,0)');
        context.fillStyle=halo;context.fillRect(0,0,size,size);
        const radians=phase*Math.PI*2;
        for(const p of particles){
          const angle=p.angle+radians*p.turns,orbit=radius*(p.radius+Math.sin(radians*Math.abs(p.turns)+p.phase)*p.wobble);
          const x=Math.cos(angle)*orbit,y=Math.sin(angle)*orbit*(.82+(Math.abs(p.turns)-1)*.055),tilt=(p.radius-.20)*4.17;
          context.fillStyle=`rgba(242,248,200,${p.opacity*(.88+.12*Math.sin(radians*2+p.phase))})`;
          context.beginPath();context.arc(radius+x*Math.cos(tilt)-y*Math.sin(tilt),radius+x*Math.sin(tilt)+y*Math.cos(tilt),p.dotRadius,0,Math.PI*2);context.fill();
        }
      }
      if(moving)frame=requestAnimationFrame(draw);
    };
    const restart=()=>{cancelAnimationFrame(frame);last=performance.now();draw(last);};
    const observer=new ResizeObserver(restart);observer.observe(element);
    reduced.addEventListener('change',restart);document.addEventListener('visibilitychange',restart);restart();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();reduced.removeEventListener('change',restart);document.removeEventListener('visibilitychange',restart);};
  },[particles,playing,loading]);
  return <div className="audio-halo calm-enter" style={{animationDelay:'65ms'}}><canvas ref={canvas} aria-hidden="true"/><button className="halo-toggle" aria-label={`${loading?'Loading':playing?'Pause':'Play'} ${title}`} disabled={loading} onClick={onToggle}>{loading?<LoaderCircle className="spin" size={30}/>:playing?<Pause size={40} fill="currentColor"/>:<Play size={40} fill="currentColor"/>}</button></div>;
}

export function balancedTitle(title:string){const words=title.trim().split(/\s+/);if(words.length<3)return title;let split=1,difference=title.length;for(let i=1;i<words.length;i++){const delta=Math.abs(words.slice(0,i).join(' ').length-words.slice(i).join(' ').length);if(delta<difference){split=i;difference=delta;}}return words.slice(0,split).join(' ')+'\n'+words.slice(split).join(' ');}
