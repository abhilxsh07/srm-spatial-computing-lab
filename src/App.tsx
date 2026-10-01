import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, Box, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import { Projects, ProjectDetail, NotFound } from './pages/Projects';
import Mentors from './pages/Mentors';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import PageMetadata from './components/PageMetadata';
import { lab } from './data/content';

const nav = ['About', 'Projects', 'Mentors', 'Resources', 'Gallery', 'Contact'];

function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key === 'Tab') {
        const links = Array.from(menu.current?.querySelectorAll('a') || []);
        if (e.shiftKey && document.activeElement === links[0]) { e.preventDefault(); toggle.current?.focus(); }
        else if (!e.shiftKey && document.activeElement === links.at(-1)) { e.preventDefault(); toggle.current?.focus(); }
        else if (document.activeElement === toggle.current) { e.preventDefault(); (e.shiftKey ? links.at(-1) : links[0])?.focus(); }
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);
  return <header className="site-header"><div className="container header-inner">
    <Link className="identity" to="/" aria-label="Spatial Computing Lab home"><Box aria-hidden="true"/><span>Spatial Computing Lab<small>SRM IST · Kattankulathur</small></span></Link>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}<span>{open ? 'Close' : 'Menu'}</span></button>
    <nav id="main-navigation" ref={menu} className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">{nav.map(item => <NavLink key={item} onClick={() => setOpen(false)} to={`/${item.toLowerCase()}`}>{item}</NavLink>)}</nav>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-top"><div><Link className="identity" to="/"><Box aria-hidden="true"/><span>Spatial Computing Lab<small>SRM IST · Kattankulathur</small></span></Link><p>Bringing physical spaces and<br/>digital possibilities closer together.</p></div><div className="footer-links"><span className="eyebrow">EXPLORE</span>{nav.slice(0, 3).map(n => <Link key={n} to={`/${n.toLowerCase()}`}>{n}</Link>)}</div><div className="footer-links"><span className="eyebrow">CONNECT</span>{nav.slice(3).map(n => <Link key={n} to={`/${n.toLowerCase()}`}>{n}</Link>)}</div><div className="footer-links"><span className="eyebrow">OUR INSTITUTION</span><a href="https://www.srmist.edu.in/" target="_blank" rel="noreferrer">SRM Institute of Science<br/>and Technology <ArrowUpRight size={14}/></a><span>Kattankulathur, Tamil Nadu<br/>India</span><a href={`mailto:${lab.email}`}>{lab.email}</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Spatial Computing Lab · Website preview</span><span>Designed for curiosity.</span></div></footer>;
}

export function Collaboration() { return <section className="collaboration"><div className="container collaboration-inner"><div><span className="eyebrow">LET’S EXPLORE WHAT’S NEXT</span><h2>Great questions deserve<br/>a shared space.</h2><p>Start a conversation about learning, research, or collaboration.</p></div><Link to="/contact" className="button button-mint">Contact the Lab <ArrowUpRight size={18}/></Link></div></section>; }

export default function App() {
  const { pathname, hash } = useLocation();
  const previousPath=useRef(pathname);
  // New pages start at the top; links with a fragment (for example /mentors#p-rama) scroll to that element instead.
  useEffect(() => { const target=hash?document.getElementById(decodeURIComponent(hash.slice(1))):null;if(target)target.scrollIntoView();else window.scrollTo(0, 0);if(previousPath.current!==pathname){document.getElementById('main')?.focus({preventScroll:true});previousPath.current=pathname;} }, [pathname, hash]);
  return <><PageMetadata/><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:slug" element={<ProjectDetail/>}/><Route path="/mentors" element={<Mentors/>}/><Route path="/resources" element={<Resources/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer/></>;
}


