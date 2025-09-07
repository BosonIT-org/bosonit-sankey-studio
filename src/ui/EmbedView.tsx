import React, { useEffect, useRef } from 'react';
import { SankeyEditor } from './SankeyEditor';

function parseParams(){
  const p = new URLSearchParams(window.location.search);
  const url = p.get('url'); const data = p.get('data');
  return { url, data };
}

export default function EmbedView(){
  const ref = useRef<{ setJSON:(x:any)=>void }|null>(null);
  useEffect(()=>{
    const { url, data } = parseParams();
    if (data) {
      try{
        const json = JSON.parse(decodeURIComponent(data));
        ref.current?.setJSON(json);
      }catch{}
    } else if (url) {
      fetch(url).then(r=>r.json()).then(j=> ref.current?.setJSON(j)).catch(()=>{});
    }
  },[]);
  return (
    <div className="svghost" style={{padding:12}}>
      <SankeyEditor ref={ref as any} />
    </div>
  );
}
