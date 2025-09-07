import React, { useRef, useState } from 'react';
import { SankeyEditor } from './SankeyEditor';

function svgToPng(svgText: string, width=860, height=520, scale=2): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(width * scale));
        canvas.height = Math.max(1, Math.floor(height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no 2d ctx');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(pngUrl);
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = url;
  });
}

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
  const onExportPNG = async () => {
    const svg = edRef.current?.exportSVG() || '';
    // Try to read width/height from svg
    const mW = svg.match(/width=\"(\d+)/); const mH = svg.match(/height=\"(\d+)/);
    const width = mW ? parseInt(mW[1],10) : 860; const height = mH ? parseInt(mH[1],10) : 520;
    const png = await svgToPng(svg, width, height, 2);
    const a = document.createElement('a'); a.href = png; a.download = 'sankey.png'; a.click();
  };
  return (
    <div>
      <div className="header">
        <strong>BosonIT Sankey Studio</strong>
        <div className="toolbar">
          <button onClick={onExportJSON}>Export JSON</button>
          <button onClick={onExportSVG}>Export SVG</button>
          <button onClick={onExportPNG}>Export PNG</button>
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
