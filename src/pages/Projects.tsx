import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, SlidersHorizontal, RotateCcw, UserRound } from 'lucide-react';
import { EmptyState, PageIntro, ProjectArt, ProjectCard, SafeImage, SearchField, SourceNote } from '../components/Shared';
import { categoryOrder, mentors, projectSources, projects, statusNotes } from '../data/content';
import optimizedImages from '../data/optimized-images.json';
import { filterProjects } from '../lib/filters.mjs';
import type { Project } from '../data/content';

const pageSize = 12;

export function Projects() {
  const [params, setParams] = useSearchParams();
  // Show the first 12 matches; 'Show more' adds 12 at a time and resets whenever the filters change.
  const [shown, setShown] = useState({ key: '', count: pageSize });
  const filterKey = params.toString();
  const visibleCount = shown.key === filterKey ? shown.count : pageSize;
  const query = params.get('q') || '';
  const category = params.get('category') || 'All';
  const status = params.get('status') || 'All';
  const mentor = params.get('mentor') || 'All';
  const categories = ['All', ...categoryOrder.filter(c => projects.some(p => p.category === c))];
  const statuses = ['All', ...new Set(projects.map(p => p.status))];
  const mentorOptions = mentors.filter(m => m.projects.length);
  const filtered: Project[] = filterProjects(projects, query, category, status, mentor);
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if (!value || value === 'All') next.delete(key); else next.set(key,value); setParams(next, {replace: key === 'q', preventScrollReset:true}); };
  return <div className="container page-bottom"><PageIntro eyebrow="PROJECT EXPLORER" title="Curiosity, made tangible." description="Explore the lab’s project records, from connected devices and robotic systems to digital twins and computer vision."/>
    <div className="filter-panel"><div className="filter-top"><SearchField label="Search projects" placeholder="Search by project, topic, or mentor…" value={query} onChange={v => update('q',v)}/>
      <label className="select-field"><SlidersHorizontal size={17}/><span className="sr-only">Project status</span><select value={status} onChange={e=>update('status',e.target.value)}>{!statuses.includes(status) && <option value={status}>Unknown status</option>}{statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}</select></label>
      <label className="select-field mentor-select"><UserRound size={17}/><span className="sr-only">Faculty mentor</span><select value={mentor} onChange={e=>update('mentor',e.target.value)}>{mentor !== 'All' && !mentorOptions.some(m => m.slug === mentor) && <option value={mentor}>Unknown mentor</option>}<option value="All">All mentors</option>{mentorOptions.map(m => <option key={m.slug} value={m.slug}>{m.name} ({m.projects.length})</option>)}</select></label></div>
      <div className="filter-chips" role="group" aria-label="Project category">{categories.map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'filter-chip selected' : 'filter-chip'} onClick={()=>update('category',c)}>{c === 'All' ? 'All projects' : c}</button>)}</div></div>
    <h2 className="sr-only">Project results</h2><div className="results-bar"><p role="status" aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? 'project' : 'projects'}{query && <> matching “{query}”</>}</p><button className="reset-button" onClick={()=>setParams({})}><RotateCcw size={14}/>Reset filters</button></div>
    {filtered.length ? <><div className="projects-grid">{filtered.slice(0, visibleCount).map(p => <ProjectCard key={p.slug} project={p}/>)}</div>{filtered.length > visibleCount && <div className="show-more"><p aria-live="polite">Showing {visibleCount} of {filtered.length} projects</p><button className="button button-outline" onClick={()=>setShown({ key: filterKey, count: visibleCount + pageSize })}>Show more projects <ArrowDown size={16}/></button></div>}</> : <EmptyState title="A little outside our current map." description="Try another topic or clear the filters to explore all project records." onReset={()=>setParams({})}/>}
    <SourceNote>Project titles and mentors come from the lab’s faculty project list and in-house project board (both supplied in October 2026) and from the earlier lab brochure. Photographs and descriptions are from the project board. Categories and short summaries are editorial.</SourceNote></div>;
}

const documentation: Record<Project['statusSource'], string> = {
  board: 'The project board gives an overview and a photograph. The research question, student team, evaluation, and outcomes have not been supplied for this website yet.',
  list: 'The lab’s project list gives the title and faculty mentor. The research question, approach, student team, and outcomes have not been supplied for this website yet.',
  brochure: 'The brochure provides a project listing. The research question, approach, evaluation, and outcomes have not yet been supplied for this website.',
};

export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);
  if (!project) return <NotFound project/>;
  const related = projects.filter(p => p.slug !== slug).sort((a,b)=>Number(b.category===project.category)-Number(a.category===project.category)).slice(0,3);
  const brochureSource = project.sources.find(s => s.id === 'brochure');
  const listed = project.mentors.join(' and ');
  const backdrop = project.image ? (optimizedImages as Record<string,{src:string}>)[project.image]?.src || project.image : '';
  return <div className="container page-bottom"><Link className="back-link" to="/projects"><ArrowLeft size={16}/>Back to projects</Link>
    <div className="project-detail-heading"><span className="eyebrow">{project.category} / PROJECT RECORD</span><h1>{project.title}</h1><p>{project.summary}</p><span className="record-status">{project.status}{project.statusSource === 'brochure' ? ' in source brochure' : ''}</span></div>
    {project.image ? <figure className="project-hero"><div className="project-hero-frame"><img className="project-hero-backdrop" src={backdrop} alt="" aria-hidden="true"/><SafeImage className="project-hero-photo" src={project.image} alt={project.imageAlt || ''} width={project.imageWidth} height={project.imageHeight} sizes="(max-width: 800px) 100vw, 900px" style={{ height: `min(100%, ${Math.round((project.imageHeight || 470) * 1.35)}px)` }}/></div><figcaption>Photograph from the lab’s in-house project board.{project.imageNote && ` ${project.imageNote}`}</figcaption></figure>
      : <figure className="project-hero project-hero-art"><ProjectArt project={project} large/><figcaption>Illustration only. No project photograph has been supplied yet.</figcaption></figure>}
    <div className="project-detail-grid"><div>
      <section><h2>About this project</h2>
        {project.details.length ? project.details.map(text => <p key={text}>{text}</p>) : <p>{project.summary}{project.statusSource === 'list' && ` This summary is based on the project title; the lab’s project list names ${listed} as faculty mentor.`}{project.statusSource === 'brochure' && ` The title and mentor attribution appear on page ${brochureSource?.page} of the lab brochure.`}</p>}
        {project.highlights.length > 0 && <ul className="project-highlights">{project.highlights.map(([label, text]) => <li key={label}><strong>{label}</strong><span>{text}</span></li>)}</ul>}
        {project.details.length > 0 && <p className="section-note">Description from the lab’s in-house project board.</p>}</section>
      <section className="documentation-note"><span className="eyebrow">PROJECT DOCUMENTATION</span><h3>The next layer of detail.</h3><p>{documentation[project.statusSource]}</p><p>{project.mentors.length ? 'Contact the listed mentor for project details, team information, or available demonstrations.' : 'Contact the lab for project details, team information, or available demonstrations.'}</p><Link className="text-link" to={`/contact?type=Project%20discussion`}>Ask about this project <ArrowUpRight size={16}/></Link></section>
      <section><h2>Technologies</h2>{project.technologies.length ? <div className="technology-list">{project.technologies.map(t=><span key={t}>{t}</span>)}</div> : <p>Technology details await the project team’s confirmation.</p>}<p className="section-note">Only technologies named in the project’s source title or description are listed.</p></section></div>
      <aside className="project-facts"><span className="eyebrow">PROJECT AT A GLANCE</span><dl>
        <dt>Research area</dt><dd>{project.category}<small>Editorial category</small></dd>
        <dt>Status</dt><dd>{project.status}<small>{statusNotes[project.statusSource]}</small></dd>
        <dt>Faculty mentors</dt><dd>{project.mentors.length ? project.mentors.map((m, i) => <Link key={m} to={`/mentors#${project.mentorSlugs[i]}`}>{m} <ArrowUpRight size={13}/></Link>) : <>Not named in source<small>The project board does not list mentors</small></>}</dd>
        <dt>Student team</dt><dd>Not specified in source</dd>
        <dt>{project.sources.length > 1 ? 'Sources' : 'Source'}</dt><dd className="project-sources">{project.sources.map(s => <span key={s.id}>{s.id === 'brochure' ? <a href={`/lab-brochure.pdf#page=${s.page}`} target="_blank" rel="noreferrer">Lab brochure · Page {s.page} <ArrowUpRight size={13}/></a> : <span className="source-name">{projectSources[s.id].title}{s.page ? ` · Page ${s.page}` : ''}</span>}<small>{s.id === 'brochure' ? (s.status !== project.status ? `Listed as ${s.status} in the brochure` : projectSources.brochure.note) : s.title !== project.title ? `Listed as “${s.title}”` : projectSources[s.id].note}</small></span>)}</dd>
      </dl></aside></div>
    <SourceNote brochureLink={Boolean(brochureSource)}>Titles, mentors, statuses, descriptions, and photographs come from the lab’s source documents listed above. Categories and short summaries are editorial.</SourceNote>
    <div className="related-heading"><h2>Continue exploring.</h2><Link className="text-link" to="/projects">All projects <ArrowUpRight size={16}/></Link></div><div className="projects-grid">{related.map(p=><ProjectCard key={p.slug} project={p}/>)}</div></div>;
}
export function NotFound({project = false}: {project?: boolean}) { return <section className="container not-found"><span className="eyebrow">404 / OUTSIDE THE MAP</span><h1>{project ? 'That project is not on our map.' : 'A space we haven’t mapped yet.'}</h1><p>{project ? 'The project may have moved, or the address may be incomplete. Explore the available project records below.' : 'This page could not be found. Let’s take you somewhere familiar.'}</p><Link to={project ? '/projects' : '/'} className="button button-teal"><ArrowLeft size={16}/>{project ? 'Back to project explorer' : 'Back to home'}</Link></section>; }
