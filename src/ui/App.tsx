import React, { useRef, useState } from 'react';
import { SankeyEditor } from './SankeyEditor';

export default function App(){
  const edRef = useRef<{exportSVG:()=>string, getJSON:()=>any, setJSON:(x:any)=>void}|null>(null);
  const [jsonText, setJsonText] = useState('');
  const onExportJSON = () => {
    const j = edRef.current?.getJSON();
    const s = JSON.stringify(j, null, 2);
    setJsonText(s);
  };
  const onImportJSON = () => {
    try { const obj = JSON.parse(jsonText); edRef.current?.setJSON(obj); } catch {}
  };
  const onExportSVG = () => {
    const svg = edRef.current?.exportSVG() || '';
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sankey.svg'; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className="header">
        <strong>BosonIT Sankey Studio</strong>
        <div className="toolbar">
          <button onClick={onExportJSON}>Export JSON</button>
          <button onClick={onExportSVG}>Export SVG</button>
        </div>
      </div>
      <div className="split">
        <div className="panel">
          <h3>Data (JSON)</h3>
          <textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} rows={20} style={{width:'100%'}} />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button onClick={onImportJSON}>Import</button>
          </div>
          <h3>Tips</h3>
          <p style={{color:'var(--muted)'}}>Use Export JSON, edit, then Import to update graph.</p>
        </div>
        <div className="svghost">
          <SankeyEditor ref={edRef} />
        </div>
      </div>
    </div>
  );
}
