import { ArrowRight, ArrowUpRight, Search, Cpu, Network, Bot, Boxes, ScanEye, Shapes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { directions, source } from '../data/content';
import optimizedImages from '../data/optimized-images.json';
import type { Project } from '../data/content';

export function SafeImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const optimized = (optimizedImages as Record<string,{src:string;srcSet:string}>)[props.src || ''];
  return failed ? <div className={`image-fallback ${props.className || ''}`} role="img" aria-label={props.alt}><Boxes/><span>Image unavailable</span></div> : <img {...props} src={optimized?.src || props.src} srcSet={optimized?.srcSet || props.srcSet} sizes={props.sizes || '(max-width: 600px) 100vw, 60vw'} decoding="async" onError={() => setFailed(true)} />;
}
export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) { return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children}</div>; }
export function SourceNote({ children, brochureLink = true }: {children?: ReactNode; brochureLink?: boolean}) { return <div className="source-note"><span className="note-mark">i</span><p>{children || source.note}{brochureLink && <> <a href="/lab-brochure.pdf" target="_blank" rel="noreferrer">View source brochure <ArrowUpRight size={13}/></a></>}</p></div>; }
export function SectionHeading({ number, eyebrow, title, link, linkText }: {number?: string; eyebrow: string; title: string; link?: string; linkText?: string}) { return <div className="section-heading"><div><span className="eyebrow">{number && `${number} / `}{eyebrow}</span><h2>{title}</h2></div>{link && <Link className="text-link" to={link}>{linkText} <ArrowUpRight size={17}/></Link>}</div>; }
export function ResearchDirections() { const icons = [Cpu, Network, Bot, Boxes]; return <div className="directions-grid">{directions.map((direction, index) => { const Icon = icons[index]; return <Link to={`/projects?category=${encodeURIComponent(direction.category)}`} key={direction.title} className="direction"><div className="direction-top"><Icon size={28} strokeWidth={1.25}/><span>{direction.number}</span></div><h3>{direction.title}</h3><p>{direction.description}</p><span className="direction-link">Explore projects <ArrowRight size={17}/></span></Link>; })}</div>; }

type Motif = 'circuit' | 'network' | 'arm' | 'twin' | 'detect' | 'none';
/** Each category has its own accent colour and drawing motif, so cards without photographs stay distinguishable. */
const categoryArt: Record<string, { accent: string; icon: LucideIcon; motif: Motif }> = {
  'Embedded Systems': { accent: '#b9f3df', icon: Cpu, motif: 'circuit' },
  'Internet of Things': { accent: '#a8d4ea', icon: Network, motif: 'network' },
  'Robotics': { accent: '#e6d3a3', icon: Bot, motif: 'arm' },
  'Digital Twins': { accent: '#8edfc9', icon: Boxes, motif: 'twin' },
  'AI & Computer Vision': { accent: '#c3cbf6', icon: ScanEye, motif: 'detect' },
};
const otherArt = { accent: '#cfd9d4', icon: Shapes, motif: 'none' as Motif };

/** Small deterministic random generator, so each project's illustration is stable between visits. */
function seededRandom(seed: string) {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
const n = (value: number) => value.toFixed(1);
const side = (random: () => number, left: [number, number], right: [number, number]) => random() < .5 ? left[0] + random() * (left[1] - left[0]) : right[0] + random() * (right[1] - right[0]);

function motifShapes(motif: Motif, random: () => number) {
  if (motif === 'circuit') return Array.from({ length: 7 }, (_, i) => {
    const fromLeft = i % 2 === 0, y = 18 + random() * 214, turn = fromLeft ? 40 + random() * 100 : 360 - random() * 100;
    const y2 = Math.min(236, Math.max(14, y + (random() - .5) * 80)), end = turn + (fromLeft ? 1 : -1) * (14 + random() * 34);
    return <g key={i}><path d={`M${fromLeft ? 0 : 400} ${n(y)}H${n(turn)}V${n(y2)}H${n(end)}`}/><circle cx={n(end)} cy={n(y2)} r="2.8"/></g>;
  });
  if (motif === 'network') {
    const hub = { x: side(random, [60, 120], [280, 340]), y: 50 + random() * 150 };
    const nodes = Array.from({ length: 7 }, () => ({ x: 20 + random() * 360, y: 18 + random() * 214 }));
    return <>{nodes.map((node, i) => <g key={i}><path d={`M${n(hub.x)} ${n(hub.y)}L${n(node.x)} ${n(node.y)}`} strokeDasharray={i % 2 ? '2 5' : undefined}/><circle cx={n(node.x)} cy={n(node.y)} r="3.2"/></g>)}<circle cx={n(hub.x)} cy={n(hub.y)} r="7"/><circle cx={n(hub.x)} cy={n(hub.y)} r="13" opacity=".5"/></>;
  }
  if (motif === 'arm') {
    const base = side(random, [55, 125], [275, 345]), j1 = { x: base + (random() - .5) * 50, y: 168 - random() * 30 };
    const j2 = { x: j1.x + (base < 200 ? 1 : -1) * (35 + random() * 30), y: j1.y - 45 - random() * 30 }, tip = { x: j2.x + (random() - .5) * 50, y: j2.y - 22 - random() * 20 };
    return <><path d={`M${n(base - 22)} 250H${n(base + 22)}M${n(base)} 250L${n(j1.x)} ${n(j1.y)}L${n(j2.x)} ${n(j2.y)}L${n(tip.x)} ${n(tip.y)}`}/>{[j1, j2].map((j, i) => <circle key={i} cx={n(j.x)} cy={n(j.y)} r="5"/>)}<path d={`M${n(tip.x - 7)} ${n(tip.y - 9)}V${n(tip.y)}H${n(tip.x + 7)}V${n(tip.y - 9)}`}/><ellipse cx={n(tip.x)} cy={n(tip.y)} rx={n(32 + random() * 18)} ry={n(11 + random() * 7)} strokeDasharray="3 5"/></>;
  }
  if (motif === 'twin') {
    const cube = (x: number, y: number, s: number, dashed: boolean, key: string) => { const w = s * .87; return <path key={key} strokeDasharray={dashed ? '3 4' : undefined} d={`M${n(x)} ${n(y - s)}L${n(x + w)} ${n(y - s / 2)}V${n(y + s / 2)}L${n(x)} ${n(y + s)}L${n(x - w)} ${n(y + s / 2)}V${n(y - s / 2)}ZM${n(x - w)} ${n(y - s / 2)}L${n(x)} ${n(y)}L${n(x + w)} ${n(y - s / 2)}M${n(x)} ${n(y)}V${n(y + s)}`}/>; };
    const size = 24 + random() * 14, a = { x: 55 + random() * 60, y: 65 + random() * 120 }, b = { x: 285 + random() * 60, y: 65 + random() * 120 };
    return <>{cube(a.x, a.y, size, false, 'a')}{cube(b.x, b.y, size, true, 'b')}<path d={`M${n(a.x + size)} ${n(a.y)}L${n(b.x - size)} ${n(b.y)}`} strokeDasharray="1 6"/></>;
  }
  if (motif === 'detect') return Array.from({ length: 3 }, (_, i) => {
    const w = 40 + random() * 50, h = 30 + random() * 42, x = i === 1 ? 300 + random() * (90 - w) : 12 + random() * (110 - w), y = 22 + random() * (205 - h), c = 9;
    return <g key={i}><path d={`M${n(x)} ${n(y + c)}V${n(y)}H${n(x + c)}M${n(x + w - c)} ${n(y)}H${n(x + w)}V${n(y + c)}M${n(x + w)} ${n(y + h - c)}V${n(y + h)}H${n(x + w - c)}M${n(x + c)} ${n(y + h)}H${n(x)}V${n(y + h - c)}`}/><rect x={n(x)} y={n(y - 8)} width="24" height="4" stroke="none" fill="currentColor" opacity=".6"/></g>;
  });
  return null;
}

/** Original SVG illustration for projects without a photograph: a mapped point cloud with the category's motif and symbol. Decorative only. */
export function ProjectArt({ project, large = false }: { project: Project; large?: boolean }) {
  const art = categoryArt[project.category] || otherArt;
  const { points, links, motif, glow } = useMemo(() => {
    const random = seededRandom(project.slug);
    const glow = { x: 30 + random() * 40, y: 28 + random() * 40 };
    const points = Array.from({ length: 30 }, () => ({ x: 18 + random() * 364, y: 16 + random() * 218, r: random() }));
    const links = points.slice(0, 12).map(point => [point, points.filter(other => other !== point).sort((a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y))[0]] as const);
    return { points, links, motif: motifShapes(art.motif, random), glow };
  }, [project.slug, art.motif]);
  const Icon = art.icon;
  return <div className={`project-art ${large ? 'project-art-large' : ''}`} aria-hidden="true" style={{ color: art.accent, background: `radial-gradient(circle at ${n(glow.x)}% ${n(glow.y)}%, ${art.accent}24, transparent 62%), #10171c` }}>
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="#769b91" strokeWidth=".6" opacity=".18">
        {Array.from({ length: 11 }, (_, i) => <path key={`a${i}`} d={`M${-60 + i * 48} 250L${90 + i * 48} 0`}/>)}
        {Array.from({ length: 11 }, (_, i) => <path key={`b${i}`} d={`M${-60 + i * 48} 0L${90 + i * 48} 250`}/>)}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity=".5">{motif}</g>
      <g stroke="currentColor" strokeWidth=".6" opacity=".28">{links.map(([a, b], i) => <path key={i} d={`M${n(a.x)} ${n(a.y)}L${n(b.x)} ${n(b.y)}`}/>)}</g>
      <g fill="currentColor">{points.map((p, i) => <circle key={i} cx={n(p.x)} cy={n(p.y)} r={p.r > .86 ? 2 : 1.05} opacity={(.16 + p.r * .5).toFixed(2)}/>)}</g>
    </svg>
    <span className="project-art-icon" style={{ borderColor: `${art.accent}66` }}><Icon size={large ? 40 : 30} strokeWidth={1.2}/></span>
    <span className="project-art-label">{project.category}</span>
  </div>;
}

const isTall = (project: Project) => Boolean(project.imageWidth && project.imageHeight && project.imageHeight / project.imageWidth > 1.6);
/** The project's own photograph when one was supplied, otherwise its illustration. Very tall photos are shown whole on a blurred backdrop. */
export function ProjectVisual({ project, sizes, eager = false }: { project: Project; sizes?: string; eager?: boolean }) {
  if (!project.image) return <ProjectArt project={project}/>;
  const photo = <SafeImage src={project.image} alt={project.imageAlt || ''} width={project.imageWidth} height={project.imageHeight} loading={eager ? 'eager' : 'lazy'} sizes={sizes} className={isTall(project) ? 'project-photo-contained' : undefined} style={!isTall(project) && project.imagePosition ? { objectPosition: project.imagePosition } : undefined}/>;
  if (!isTall(project)) return photo;
  const backdrop = (optimizedImages as Record<string,{src:string}>)[project.image]?.src || project.image;
  return <div className="project-photo-frame"><img className="project-photo-backdrop" src={backdrop} alt="" aria-hidden="true" loading={eager ? 'eager' : 'lazy'}/>{photo}</div>;
}

export function ProjectStatus({ project }: { project: Project }) { return <>{project.status}{project.statusSource === 'brochure' && <span className="status-source"> in brochure</span>}</>; }

export function ProjectCard({ project, featured = false }: {project: Project; featured?: boolean}) { return <article className={`project-card ${featured ? 'featured-project' : ''}`}><Link to={`/projects/${project.slug}`} className="project-image-link" aria-label={`Explore ${project.title}`}><ProjectVisual project={project} sizes={featured ? '(max-width: 600px) 100vw, 50vw' : '(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw'}/><span className="image-arrow"><ArrowUpRight size={20}/></span></Link><div className="project-card-body"><div className="project-meta"><span>{project.category}</span><span><ProjectStatus project={project}/></span></div><h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3><p>{project.summary}</p>{project.mentors.length > 0 && <p className="project-mentors">{project.mentors.join(' · ')}</p>}<Link className="text-link" to={`/projects/${project.slug}`}>Explore project <ArrowUpRight size={16}/></Link></div></article>; }
export function SearchField({ value, onChange, label, placeholder }: {value: string; onChange: (value: string)=>void; label: string; placeholder: string}) { return <label className="search-field"><Search size={19}/><span className="sr-only">{label}</span><input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/></label>; }
export function EmptyState({ title, description, onReset }: {title: string; description: string; onReset?: ()=>void}) { return <div className="empty-state"><Search size={32} strokeWidth={1.3}/><h2>{title}</h2><p>{description}</p>{onReset && <button className="button button-teal" onClick={onReset}>Reset filters <ArrowRight size={16}/></button>}</div>; }
