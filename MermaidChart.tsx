import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Eye, 
  Cpu, 
  Activity,
  ArrowRight,
  GitCommit,
  Layers,
  Sparkles
} from 'lucide-react';

// Initialize mermaid once with resilient defaults
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  suppressErrorRendering: true,
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  themeVariables: {
    darkMode: true,
    background: 'transparent',
    mainBkg: '#0f172a',
    primaryColor: '#0f172a',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#10b981',
    lineColor: '#34d399',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    edgeLabelBackground: '#1e293b',
    clusterBkg: 'rgba(15, 23, 42, 0.7)',
    clusterBorder: '#38bdf8',
    nodeBorder: '#10b981',
    actorBorder: '#10b981',
    labelColor: '#f1f5f9'
  }
});

interface MermaidProps {
  chart: string;
}

interface ParsedNode {
  id: string;
  label: string;
  title: string;
  specs?: string;
  shape: 'box' | 'diamond' | 'stadium' | 'cylinder' | 'circle';
  subgraphId?: string;
}

interface ParsedEdge {
  from: string;
  to: string;
  label?: string;
}

interface ParsedSubgraph {
  id: string;
  title: string;
  nodeIds: string[];
}

/**
 * Intelligent sanitizer and syntax fixer for Mermaid diagrams.
 * Fixes unquoted labels, unescaped < and >, subgraphs with spaces,
 * unsupported legacy syntax, and malformed tags.
 */
export function sanitizeMermaidCode(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw.trim();

  // Strip markdown code fences if present
  text = text.replace(/^```(?:mermaid)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  text = text.trim();

  // Extract lines
  const lines = text.split('\n');
  let firstLine = lines[0]?.trim() || '';
  const hasValidHeader = /^(?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|xychart-beta|packet-beta|kanban|architecture)\b/i.test(firstLine);

  if (!hasValidHeader) {
    text = 'flowchart TD\n' + text;
  } else if (/^graph\s+(TD|TB|LR|RL|BT)/i.test(firstLine)) {
    // Flowchart in Mermaid 11 handles quoting and html entities much better than legacy graph
    lines[0] = lines[0].replace(/^graph\s+/i, 'flowchart ');
    text = lines.join('\n');
  }

  // Fix subgraphs with multi-word titles without brackets/quotes:
  // e.g., "subgraph AI Control Loop" -> "subgraph sg_ai_control_loop ["AI Control Loop"]"
  text = text.replace(/^(\s*subgraph\s+)(?!["\[])(.+)$/gim, (match, prefix, rest) => {
    const trimmed = rest.trim();
    if (trimmed.includes(' ') && !trimmed.includes('[')) {
      const cleanId = 'sg_' + trimmed.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      return `${prefix}${cleanId} ["${trimmed}"]`;
    }
    return match;
  });

  // Fix node shapes and quote all text to prevent lexer errors with special characters (<, >, &, /, %, etc.)
  // Handles: A[...], B(...), C{...}, D([...]), E{{...}}, F[(...)], G((...))
  const shapeRegex = /([a-zA-Z0-9_-]+)\s*(\(\[|\[\/|\[\\|\{\{|\(\(|\(\>|\[|\{|\()([^\n]+?)(\]\)|\/\]|\\\]|\}\}|\)\)|\>\]|\]|\}|\))/g;
  
  text = text.replace(shapeRegex, (full, id, openShape, innerText, closeShape) => {
    let label = innerText.trim();
    // Strip existing outer quotes if present to avoid nesting
    if (label.startsWith('"') && label.endsWith('"')) {
      label = label.slice(1, -1);
    }
    
    // Replace unescaped HTML-breaking characters (< and >)
    label = label.replace(/<(?!\s*\/?br\s*\/?>)/gi, '&lt;');
    label = label.replace(/(?<!<br\s*\/?)>/gi, '&gt;');
    label = label.replace(/<br\s*\/?>/gi, '<br/>');
    // Escape unescaped internal double quotes
    label = label.replace(/(?<!\\)"/g, "'");

    return `${id}${openShape}"${label}"${closeShape}`;
  });

  // Fix edge labels with unescaped special chars: -->|label|
  text = text.replace(/(--+[>x]?)\s*\|([^|\n]+)\|/g, (match, arrow, label) => {
    let cleanLabel = label.trim();
    cleanLabel = cleanLabel.replace(/<(?!\s*\/?br\s*\/?>)/gi, '&lt;').replace(/>/gi, '&gt;');
    cleanLabel = cleanLabel.replace(/"/g, '');
    return `${arrow}|"${cleanLabel}"|`;
  });

  return text;
}

/**
 * Secondary aggressive fallback sanitizer if primary sanitizer fails
 */
function aggressiveSanitize(raw: string): string {
  let clean = sanitizeMermaidCode(raw);
  
  // Replace any remaining complex shapes with standard [ "text" ]
  clean = clean.replace(/([a-zA-Z0-9_-]+)\s*\{"([^"]+)"\}/g, '$1["$2 (Decision)"]');
  clean = clean.replace(/([a-zA-Z0-9_-]+)\s*\(\["([^"]+)"\]\)/g, '$1["$2"]');
  clean = clean.replace(/([a-zA-Z0-9_-]+)\s*\(\("([^"]+)"\)\)/g, '$1["$2"]');

  // Strip complex HTML from node labels
  clean = clean.replace(/<br\s*\/?>/gi, ' - ');
  
  return clean;
}

/**
 * Parses flowchart text to produce a structured graph for fallback SVG rendering
 */
function parseFlowchartTopology(raw: string): {
  nodes: ParsedNode[];
  edges: ParsedEdge[];
  subgraphs: ParsedSubgraph[];
} {
  const nodesMap = new Map<string, ParsedNode>();
  const edges: ParsedEdge[] = [];
  const subgraphs: ParsedSubgraph[] = [];
  let currentSubgraph: ParsedSubgraph | null = null;

  const lines = raw.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%') || /^flowchart|graph\b/i.test(trimmed)) {
      continue;
    }

    // Check subgraph start
    const sgMatch = trimmed.match(/^subgraph\s+([^\s\[]+)?(?:\s*\["?(.*?)"?\])?/i);
    if (sgMatch) {
      const sgTitle = sgMatch[2] || sgMatch[1] || 'Subsystem';
      const sgId = sgMatch[1] || `sg_${subgraphs.length}`;
      currentSubgraph = {
        id: sgId,
        title: sgTitle.replace(/^"|"$/g, ''),
        nodeIds: []
      };
      subgraphs.push(currentSubgraph);
      continue;
    }

    if (trimmed === 'end' && currentSubgraph) {
      currentSubgraph = null;
      continue;
    }

    // Match nodes in lines: e.g. A[Label] or A{"Label"} or A(Label)
    const nodeMatches = trimmed.matchAll(/([a-zA-Z0-9_-]+)\s*(\(\[|\[\/|\[\\|\{\{|\(\(|\(\>|\[|\{|\()([^\n]+?)(\]\)|\/\]|\\\]|\}\}|\)\)|\>\]|\]|\}|\))/g);
    for (const match of nodeMatches) {
      const id = match[1];
      const openShape = match[2];
      let rawLabel = match[3].trim().replace(/^"|"$/g, '');
      rawLabel = rawLabel.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

      let shape: ParsedNode['shape'] = 'box';
      if (openShape === '{' || openShape === '{{') shape = 'diamond';
      else if (openShape === '([' || openShape === '(') shape = 'stadium';
      else if (openShape === '((') shape = 'circle';

      // Split on <br/> or \n to extract title and specs
      const parts = rawLabel.split(/<br\s*\/?>|\n/i);
      const title = parts[0]?.trim() || id;
      const specs = parts.slice(1).join(' • ').trim();

      const node: ParsedNode = {
        id,
        label: rawLabel,
        title,
        specs: specs || undefined,
        shape,
        subgraphId: currentSubgraph?.id
      };

      nodesMap.set(id, node);
      if (currentSubgraph && !currentSubgraph.nodeIds.includes(id)) {
        currentSubgraph.nodeIds.push(id);
      }
    }

    // Match edge connections: e.g. A --> B or A -->|label| B or A --- B
    const edgeMatch = trimmed.match(/([a-zA-Z0-9_-]+)\s*(?:--+|==+)(?:>|[xX])?(?:\|"?(.*?)"?\|)?\s*([a-zA-Z0-9_-]+)/);
    if (edgeMatch) {
      const from = edgeMatch[1];
      const label = edgeMatch[2]?.replace(/^"|"$/g, '').trim();
      const to = edgeMatch[3];

      edges.push({
        from,
        to,
        label: label || undefined
      });

      // Ensure nodes exist in map even if they had no explicit brackets on this line
      if (!nodesMap.has(from)) {
        nodesMap.set(from, { id: from, label: from, title: from, shape: 'box', subgraphId: currentSubgraph?.id });
      }
      if (!nodesMap.has(to)) {
        nodesMap.set(to, { id: to, label: to, title: to, shape: 'box', subgraphId: currentSubgraph?.id });
      }
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
    subgraphs
  };
}

export const MermaidChart: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Attempt multi-tier rendering
  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      setSvg('');
      setUseFallback(false);

      const uniqueId = `mermaid_${Math.random().toString(36).substring(2, 9)}`;

      // Tier 1: Primary Sanitized Render
      try {
        const sanitized = sanitizeMermaidCode(chart);
        const isDark = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark') ||
                       localStorage.getItem('theme') === 'dark';

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          suppressErrorRendering: true,
          fontFamily: 'Inter, system-ui, sans-serif'
        });

        const { svg: renderedSvg } = await mermaid.render(uniqueId, sanitized);
        if (isMounted) {
          setSvg(renderedSvg);
          return;
        }
      } catch (tier1Err: any) {
        console.warn("Mermaid Tier 1 render warning, attempting Tier 2 repair...", tier1Err);
        cleanupOrphanElements(uniqueId);
      }

      // Tier 2: Aggressive Sanitized Render
      try {
        const aggressiveCode = aggressiveSanitize(chart);
        const secondId = `${uniqueId}_r2`;
        const { svg: secondSvg } = await mermaid.render(secondId, aggressiveCode);
        if (isMounted) {
          setSvg(secondSvg);
          return;
        }
      } catch (tier2Err: any) {
        console.warn("Mermaid Tier 2 render failed. Activating native visual diagram fallback.", tier2Err);
        cleanupOrphanElements(`${uniqueId}_r2`);
      }

      // Tier 3: Native Visual Diagram Fallback
      if (isMounted) {
        setUseFallback(true);
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const cleanupOrphanElements = (id: string) => {
    const badElement = document.getElementById(id);
    if (badElement) badElement.remove();
    const bindElement = document.getElementById(`d${id}`);
    if (bindElement) bindElement.remove();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    let svgContent = svg;
    if (!svgContent && containerRef.current) {
      const svgEl = containerRef.current.querySelector('svg');
      if (svgEl) {
        svgContent = new XMLSerializer().serializeToString(svgEl);
      }
    }
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'process-diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const topology = React.useMemo(() => parseFlowchartTopology(chart), [chart]);

  return (
    <div 
      className={`my-6 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950/95 shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-slate-950' : 'relative'
      }`}
    >
      {/* Diagram Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Process Flow & System Architecture
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {useFallback ? 'Interactive Visual Engine' : 'Live Vector Diagram'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Code / Diagram */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              showCode 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={showCode ? "Switch to Visual Diagram" : "View Diagram Source Code"}
          >
            {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showCode ? 'Diagram' : 'Code'}</span>
          </button>

          {/* Zoom controls */}
          {!showCode && (
            <div className="flex items-center bg-slate-800/40 rounded-lg p-0.5 border border-slate-700/40">
              <button
                onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-1.5 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom(z => Math.min(2.0, z + 0.15))}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download SVG */}
          {svg && (
            <button
              onClick={handleDownloadSvg}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Download Vector SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`overflow-auto p-4 md:p-8 flex items-center justify-center min-h-[320px] ${isFullscreen ? 'flex-1' : ''}`}>
        {showCode ? (
          <div className="w-full max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Mermaid Diagram Source</span>
              <span className="text-[10px] text-emerald-400 font-mono">flowchart TD</span>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed shadow-inner">
              {chart}
            </pre>
          </div>
        ) : svg ? (
          <div 
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
            className="w-full flex justify-center items-center transition-transform duration-200 ease-out [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : useFallback ? (
          <InteractiveVisualDiagram topology={topology} zoom={zoom} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-xs font-medium tracking-wide text-slate-300">Compiling Process Architecture Diagram...</p>
          </div>
        )}
      </div>

      {/* Diagram Footer Bar */}
      <div className="px-5 py-2.5 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Engineered for industrial & biochemical scale-up
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          Nodes: {topology.nodes.length} • Streams: {topology.edges.length}
        </span>
      </div>
    </div>
  );
};

/**
 * High-Polish Interactive Visual Flowchart Fallback
 * Renders if Mermaid cannot parse, guaranteeing the user ALWAYS gets a real,
 * professional diagram with cards, metrics, decision gates, and AI control loops.
 */
interface InteractiveVisualDiagramProps {
  topology: {
    nodes: ParsedNode[];
    edges: ParsedEdge[];
    subgraphs: ParsedSubgraph[];
  };
  zoom: number;
}

const InteractiveVisualDiagram: React.FC<InteractiveVisualDiagramProps> = ({ topology, zoom }) => {
  const { nodes, edges, subgraphs } = topology;

  // Filter regular nodes vs subgraph nodes
  const aiSubgraph = subgraphs.find(sg => /ai|control|digital|sensor|twin/i.test(sg.title));
  const aiNodeIds = new Set(aiSubgraph ? aiSubgraph.nodeIds : []);
  
  const mainNodes = nodes.filter(n => !aiNodeIds.has(n.id));
  const aiNodes = nodes.filter(n => aiNodeIds.has(n.id));

  // Determine stage or node role
  const getNodeBadge = (node: ParsedNode, idx: number) => {
    if (node.shape === 'diamond' || /removal|check|decision|test|eval/i.test(node.title)) {
      return { text: 'Decision Gate', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
    if (idx === 0 || /raw|feedstock|inlet|water/i.test(node.title)) {
      return { text: 'Inlet Feed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    }
    if (/fuel|saf|eor|product|stream|permeate/i.test(node.title)) {
      return { text: 'Product Stream', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    }
    if (/ai|digital|pinn|sensor/i.test(node.title)) {
      return { text: 'Autonomous AI', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    }
    return { text: 'Unit Operation', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
  };

  return (
    <div 
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
      className="w-full max-w-5xl transition-transform duration-200 space-y-8 py-2"
    >
      {/* Main Process Stream Flow */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
          <Layers className="w-4 h-4 text-emerald-400" />
          Primary Industrial Process Sequence
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainNodes.map((node, idx) => {
            const badge = getNodeBadge(node, idx);
            const isDecision = node.shape === 'diamond' || badge.text === 'Decision Gate';

            return (
              <div
                key={node.id}
                className={`relative group rounded-2xl p-4 transition-all duration-300 border shadow-lg ${
                  isDecision
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-700/60 hover:border-emerald-500/60 hover:shadow-emerald-500/10'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-200">
                    {node.id}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>

                {/* Node Title */}
                <h4 className="text-sm font-bold text-slate-100 leading-snug mb-2 group-hover:text-emerald-300 transition-colors">
                  {node.title}
                </h4>

                {/* Specifications / Stream Parameters */}
                {node.specs && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 bg-slate-950/50 px-2.5 py-1.5 rounded-xl">
                    <span className="text-emerald-400 font-semibold mr-1">Param:</span>
                    {node.specs}
                  </div>
                )}

                {/* Next Step Connections Indicator */}
                {(() => {
                  const outgoing = edges.filter(e => e.from === node.id);
                  if (!outgoing.length) return null;

                  return (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {outgoing.map((e, eIdx) => (
                        <span 
                          key={eIdx}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/50"
                        >
                          <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                          To <strong className="text-emerald-300 font-mono">{e.to}</strong>
                          {e.label && <span className="text-slate-400 italic">({e.label})</span>}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Control Loop & Closed-Loop Feedback Subgraph */}
      {(aiSubgraph || aiNodes.length > 0) && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/30 border border-purple-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                {aiSubgraph?.title || 'Autonomous AI Control Loop & Digital Twin'}
              </h4>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              PINN Predictive Optimization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiNodes.map(node => (
              <div key={node.id} className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                    {node.id}
                  </span>
                  <h5 className="text-sm font-bold text-slate-100">{node.title}</h5>
                </div>
                {node.specs && (
                  <p className="text-xs font-mono text-purple-300/80 bg-purple-950/40 p-2 rounded-lg">
                    {node.specs}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Feedback Tuning Edges */}
          {(() => {
            const aiEdges = edges.filter(e => aiNodeIds.has(e.from));
            if (!aiEdges.length) return null;

            return (
              <div className="pt-2 border-t border-purple-500/20 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-semibold text-purple-300">Real-time Tuning Channels:</span>
                {aiEdges.map((e, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-900/30 text-purple-200 border border-purple-500/30 text-xs font-mono"
                  >
                    <GitCommit className="w-3 h-3 text-purple-400" />
                    <strong>{e.from}</strong>
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <strong>Node {e.to}</strong>
                    {e.label && <span className="text-purple-300 font-sans italic">[{e.label}]</span>}
                  </span>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Stream Routing Summary Table */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          Material & Energy Stream Linkages
        </h5>
        <div className="flex flex-wrap gap-2">
          {edges.map((edge, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-slate-300"
            >
              <span className="font-bold text-emerald-400">{edge.from}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="font-bold text-cyan-400">{edge.to}</span>
              {edge.label && (
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {edge.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
