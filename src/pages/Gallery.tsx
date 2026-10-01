import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from 'lucide-react';
import { gallery } from '../data/content';
import { PageIntro, SafeImage } from '../components/Shared';
import { galleryWideTiles } from '../lib/catalog.mjs';

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const categories = ['All', ...new Set(gallery.map(i=>i.category))];
  const filtered = gallery.filter(item=>category==='All'||item.category===category);
  const wide = galleryWideTiles(filtered);
  const activeId = params.get('image');
  const selected = filtered.findIndex(i=>i.id===activeId);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const startTouch = useRef<number | null>(null);
  const [announcement,setAnnouncement] = useState('');
  const close = useCallback(()=>{ const next = new URLSearchParams(params); next.delete('image'); setParams(next,{replace:true,preventScrollReset:true}); },[params,setParams]);
  const move = (offset: number) => { const next=new URLSearchParams(params); next.set('image',filtered[(selected+offset+filtered.length)%filtered.length].id);setParams(next,{replace:true,preventScrollReset:true}); };
  useEffect(()=>{
    const el=dialog.current;
    if (selected>=0 && el && !el.open) { if (!opener.current) opener.current=document.activeElement as HTMLElement; el.showModal();closeButton.current?.focus(); }
    if (selected<0 && el?.open) {el.close();opener.current?.focus();opener.current=null;}
    document.body.style.overflow = selected>=0?'hidden':'';
    if (selected>=0) setAnnouncement(`Image ${selected+1} of ${filtered.length}: ${filtered[selected].caption}`);
    return ()=>{document.body.style.overflow='';};
  },[selected,filtered.length]);
  return <div className="container page-bottom"><PageIntro eyebrow="INSIDE THE LAB" title="The spaces between ideas." description="A look at the workbenches, people, and everyday exploration behind the lab’s projects."/><div className="gallery-toolbar"><div className="filter-chips" role="group" aria-label="Gallery category">{categories.map(c=><button key={c} className={category===c?'filter-chip selected':'filter-chip'} aria-pressed={category===c} onClick={()=>{const next=new URLSearchParams();if(c!=='All')next.set('category',c);setParams(next,{preventScrollReset:true});}}>{c==='All'?'All photographs':c}</button>)}</div><span role="status" className="gallery-count">{filtered.length} photographs</span></div>{filtered.length ? <div className="gallery-grid">{filtered.map((item,i)=><figure key={item.id} className={wide[i]?'gallery-wide':''}><button onClick={event=>{opener.current=event.currentTarget;const next=new URLSearchParams(params);next.set('image',item.id);setParams(next,{replace:true,preventScrollReset:true});}} aria-label={`Open photograph: ${item.caption}`}><SafeImage src={item.src} alt={item.alt} width={item.width} height={item.height} loading={i<2?'eager':'lazy'} style={item.contain?{objectFit:'contain'}:item.position?{objectPosition:item.position}:undefined}/><span className="gallery-expand"><Expand size={18}/></span></button><figcaption><div><span className="eyebrow">{item.category}</span><h2>{item.caption}</h2></div><span>{String(i+1).padStart(2,'0')}</span></figcaption></figure>)}</div>:<div className="empty-state"><h2>No photographs in this category.</h2><button className="button button-teal" onClick={()=>setParams({})}>Show all photographs</button></div>}<p className="section-note">Lab photographs are extracted from the supplied lab brochure; project photographs are from the lab’s in-house project board. Captions describe visible activity; event names, dates, and individual identities have not been inferred.</p><dialog ref={dialog} className="lightbox" aria-labelledby="lightbox-caption" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if(selected<0)return;if(event.key==='Tab'){const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}}><div className="lightbox-inner"><button ref={closeButton} className="lightbox-close" onClick={close} aria-label="Close photograph"><X size={24}/></button>{selected>=0 && <><div className="lightbox-image" onTouchStart={event=>{startTouch.current=event.touches[0].clientX;}} onTouchEnd={event=>{if(startTouch.current!==null){const delta=event.changedTouches[0].clientX-startTouch.current;if(Math.abs(delta)>50)move(delta<0?1:-1);}startTouch.current=null;}}><SafeImage key={filtered[selected].id} src={filtered[selected].src} alt={filtered[selected].alt} width={filtered[selected].width} height={filtered[selected].height}/></div><div className="lightbox-bottom"><div><h2 id="lightbox-caption">{filtered[selected].caption}</h2><p>{filtered[selected].source}</p>{filtered[selected].link&&<Link className="lightbox-link" to={filtered[selected].link!}>View project <ArrowUpRight size={15}/></Link>}</div><div className="lightbox-controls"><button aria-label="Previous photograph" onClick={()=>move(-1)}><ArrowLeft size={20}/></button><span>{selected+1} / {filtered.length}</span><button aria-label="Next photograph" onClick={()=>move(1)}><ArrowRight size={20}/></button></div></div><span className="sr-only" aria-live="polite">{announcement}</span></>}</div></dialog></div>;
}

