import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '../data/content';

const pages:Record<string,[string,string]> = {
  '/': ['Spatial Computing Lab · SRM IST', 'Exploring computing beyond the screen. Discover the Spatial Computing Lab website preview, project records, and learning resources at SRM IST, Kattankulathur.'],
  '/about': ['About the Lab', 'Learn about Spatial Computing Lab, its documented focus areas, facilities, and institutional context at SRM IST, Kattankulathur.'],
  '/projects': ['Project Explorer', 'Search the Spatial Computing Lab’s projects in embedded systems, IoT, robotics, digital twins, and computer vision, by topic, status, or faculty mentor.'],
  '/mentors': ['Faculty Mentors', 'Meet the Spatial Computing Lab’s faculty mentors and explore the projects they guide.'],
  '/resources': ['Resource Library', 'Explore verified external spatial computing learning resources and download the supplied lab brochure.'],
  '/gallery': ['Inside the Lab', 'Explore photographs of the Spatial Computing Lab and its project prototypes.'],
  '/contact': ['Contact the Lab', 'Find the brochure-listed lab contact and prepare a student, research, or collaboration enquiry.'],
};
export default function PageMetadata(){const {pathname}=useLocation();useEffect(()=>{const project=projects.find(p=>pathname===`/projects/${p.slug}`);const [title,description]=project?[project.title,project.summary]:pages[pathname]||['Page not found','This page could not be found. Explore the Spatial Computing Lab website.'];const fullTitle=pathname==='/'?title:`${title} · Spatial Computing Lab`;document.title=fullTitle;for(const [selector,value] of [['meta[name="description"]',description],['meta[property="og:title"]',fullTitle],['meta[property="og:description"]',description]])document.querySelector(selector)?.setAttribute('content',value);},[pathname]);return null;}
