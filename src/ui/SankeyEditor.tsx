import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3sankey, sankeyLinkHorizontal, sankeyCenter, SankeyNodeMinimal, SankeyLinkMinimal } from 'd3-sankey';

export type SankeyData = { nodes: { name:string }[]; links: { source:number; target:number; value:number }[] };

const defaultData: SankeyData = {
  nodes: [ {name:'Input'}, {name:'Process'}, {name:'Output'} ],
  links: [ {source:0,target:1,value:5}, {source:1,target:2,value:5} ]
};

export const SankeyEditor = forwardRef(function SankeyEditor(_props, ref){
  const [data, setData] = useState<SankeyData>(defaultData);
  const svgRef = useRef<SVGSVGElement|null>(null);
  const width = 860, height = 520;

  useImperativeHandle(ref, () => ({
    exportSVG(){ return svgRef.current?.outerHTML || ''; },
    getJSON(){ return data; },
    setJSON(obj:any){ if(obj?.nodes && obj?.links) setData(obj as SankeyData); }
  }));

  const layout = useMemo(() => {
    const sankey = d3sankey<{name:string}, {source:number;target:number;value:number}>()
      .nodeId((d,i)=> i)
      .nodeAlign(sankeyCenter)
      .nodeWidth(18)
      .nodePadding(12)
      .extent([[1,1],[width-1,height-1]]);
    const nodes = data.nodes.map(d=>({ ...d })) as (SankeyNodeMinimal<{name:string}, any>)[];
    const links = data.links.map(l=>({ ...l })) as (SankeyLinkMinimal<any, any>)[];
    // @ts-ignore
    const g = sankey({ nodes, links });
    return g;
  }, [data]);

  useEffect(()=>{
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    svg.append('g')
      .selectAll('path')
      .data(layout.links)
      .join('path')
      .attr('class','link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', d => Math.max(1, d.width || 1));

    const node = svg.append('g')
      .selectAll('g')
      .data(layout.nodes)
      .join('g')
      .attr('class','node');

    node.append('rect')
      .attr('x', d => d.x0!)
      .attr('y', d => d.y0!)
      .attr('height', d => (d.y1! - d.y0!))
      .attr('width', d => (d.x1! - d.x0!))
      .append('title')
      .text(d => `${(d as any).name}\n${d.value}`);

    node.append('text')
      .attr('x', d => d.x0! - 6)
      .attr('y', d => (d.y1! + d.y0!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => (d as any).name)
      .filter(d => d.x0! < width / 2)
      .attr('x', d => d.x1! + 6)
      .attr('text-anchor', 'start');
  }, [layout]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
});
