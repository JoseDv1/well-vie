export function inwardSwipe(own:boolean,dx:number,dy:number){
  const inward=own?-dx:dx;
  return {offset:Math.abs(dx)>Math.abs(dy)&&inward>0?(own?-1:1)*Math.min(80,inward*.8):0,reply:inward>=60&&Math.abs(dx)>Math.abs(dy)*1.5};
}
