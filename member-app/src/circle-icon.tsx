/** Same geometry as native CircleInboxIcon, including the unread count at its heart. */
export function CircleIcon({count=0,size=44}:{count?:number;size?:number}){
  const positions=[0,120,240];
  return <svg className="circle-inbox-icon" width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
    <circle cx="22" cy="22" r="18" fill="var(--wash)" opacity={count>0?.45:.8}/>
    <circle cx="22" cy="22" r="17.2" fill="none" stroke="var(--heading)" strokeWidth="1.6"/>
    {count>0&&<circle cx="22" cy="22" r="14.65" fill="none" stroke="var(--green)" strokeOpacity=".32" strokeWidth=".7"/>}
    {positions.map(angle=><circle key={angle} cx="22" cy="4.8" r="2.25" transform={`rotate(${angle} 22 22)`} fill="var(--heading)" stroke="var(--paper)" strokeWidth="1.3"/>)}
    {count>0?<text x="22" y="22" dy=".35em" textAnchor="middle" fill="var(--heading)" style={{fontFamily:'var(--font-system)',fontSize:count>99?12:16,fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{count>99?'99+':count}</text>:<>
      {positions.map(angle=><circle key={'fill'+angle} cx="22" cy="17.5" r="7" transform={`rotate(${angle} 22 22)`} fill="var(--green)" fillOpacity=".16"/>)}
      {positions.map(angle=><circle key={'line'+angle} cx="22" cy="17.5" r="6.55" transform={`rotate(${angle} 22 22)`} fill="none" stroke="var(--sage)" strokeOpacity=".8" strokeWidth=".9"/>)}
    </>}
  </svg>;
}
