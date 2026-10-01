import brochure from './brochure.json';
import facultyList from './faculty.json';
import projectBoard from './project-board.json';
import projectList from './project-list.json';
import projectInfo from './project-info.json';
import { mergeProjectRecords, personSlug } from '../lib/catalog.mjs';
import type { ProjectRecord } from '../lib/catalog.mjs';

export type Verification = 'brochure' | 'verified-external' | 'editorial-draft';
export const source = { url: '/lab-brochure.pdf', title: 'Supplied lab brochure', status: 'brochure' as Verification, note: 'The lab’s history, facilities, and equipment are recorded in the supplied, undated lab brochure. Current details await lab confirmation.' };
/** Documents supplied by the lab for the October 2026 update. */
export const labUpdate = { label: 'October 2026', faculty: facultyList.source, board: projectBoard.source, list: projectList.source };
export const lab = { ...brochure.lab, source, mission: 'Connect hands-on learning in embedded systems, IoT, and robotics with real-world problem solving.', vision: 'A shared space for creativity and innovation across physical and digital systems.', missionStatus: 'Editorial paraphrase of the brochure, page 1' };
export const directions = [
  { title: 'Embedded Systems', number: '01', icon: 'cpu', description: 'Intelligence at the edge. Exploring the hardware and software that make physical systems responsive.', category: 'Embedded Systems' },
  { title: 'Internet of Things', number: '02', icon: 'network', description: 'Connecting sensors, devices, and environments to bring useful information into everyday spaces.', category: 'Internet of Things' },
  { title: 'Robotics', number: '03', icon: 'bot', description: 'Turning computation into movement through control, sensing, and hands-on robotic prototypes.', category: 'Robotics' },
  { title: 'Digital Twins', number: '04', icon: 'boxes', description: 'Exploring the relationship between physical systems and their digital representations.', category: 'Digital Twins' },
];
/** Display order for project categories in filters. */
export const categoryOrder = ['Embedded Systems', 'Internet of Things', 'Robotics', 'Digital Twins', 'AI & Computer Vision', 'Other projects'];

export type ProjectSourceId = 'brochure' | 'board' | 'list';
export const projectSources: Record<ProjectSourceId, { title: string; note: string }> = {
  board: { title: 'In-house project board', note: 'Lab project board supplied in October 2026' },
  list: { title: 'Faculty project list', note: 'Lab project list supplied in October 2026' },
  brochure: { title: 'Lab brochure', note: 'Supplied, undated lab brochure' },
};
/** Where each project's status comes from, shown beside the status on project pages. */
export const statusNotes: Record<ProjectSourceId, string> = {
  board: 'Built prototype on the lab’s in-house project board',
  list: 'On the lab’s current faculty project list',
  brochure: 'As recorded in the undated lab brochure; current stage awaiting confirmation',
};

interface ProjectInfo { category: string; summary: string; keywords: string; technologies: string[] }
const info: Record<string, ProjectInfo> = projectInfo.projects;
const fallbackInfo: ProjectInfo = { category: 'Other projects', summary: 'Project documentation is awaiting confirmation.', keywords: '', technologies: [] };

export interface Project extends ProjectRecord { category: string; summary: string; keywords: string; technologies: readonly string[]; mentorSlugs: string[] }
// Editorial details are keyed by the exact display title, so source records may be reordered safely.
export const projects: Project[] = mergeProjectRecords({ brochure, board: projectBoard, list: projectList, faculty: facultyList.faculty })
  .map(record => ({ ...record, ...(info[record.title] || fallbackInfo), mentorSlugs: record.mentors.map(personSlug) }));
export const featuredProjects = ['automated-kuthuvilakku', 'ai-powered-autonomous-poultry-monitoring-rover', 'empowering-elderly-with-visual-impairments-through-intelligent-dispensing-technology'].map(slug => projects.find(p => p.slug === slug)).filter((p): p is Project => Boolean(p));
export const mentors = facultyList.faculty.map(person => ({ name: person.name, role: person.role, email: person.email, image: person.image, slug: personSlug(person.name), affiliation: 'Department of Computing Technologies · SRM IST', projects: projects.filter(project => project.mentors.includes(person.name)) }));

export interface Resource { title: string; description: string; type: string; topic: string; category: string; url: string; origin: 'External resource' | 'Lab brochure'; verification: Verification; source: string; download?: boolean; }
export const resources: Resource[] = [
  { title: 'Spatial Computing Lab brochure', description: 'The supplied overview of the lab, faculty, equipment, and project records. Publication date not specified.', type: 'PDF · 4 MB', topic: 'Lab overview', category: 'Lab guides & downloads', url: '/lab-brochure.pdf', origin: 'Lab brochure', verification: 'brochure', source: 'Supplied document', download: true },
  { title: 'Introduction to A-Frame', description: 'Build an introductory immersive scene using HTML and reusable components.', type: 'Getting started', topic: 'Immersive web', category: 'Getting started', url: 'https://aframe.io/docs/1.8.0/introduction/', origin: 'External resource', verification: 'verified-external', source: 'A-Frame' },
  { title: 'three.js Manual', description: 'Build foundations in 3D graphics, scenes, cameras, lighting, and interactive experiences.', type: 'Tutorials', topic: '3D graphics', category: 'Tutorials & learning paths', url: 'https://threejs.org/manual/', origin: 'External resource', verification: 'verified-external', source: 'three.js' },
  { title: 'Working with point clouds', description: 'Load and visualize point clouds, then explore downsampling, normals, and segmentation.', type: 'Tutorial', topic: 'Spatial perception', category: 'Tutorials & learning paths', url: 'https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html', origin: 'External resource', verification: 'verified-external', source: 'Open3D' },
  { title: 'WebXR Device API', description: 'Explore browser APIs for immersive sessions, spatial tracking, rendering, and input.', type: 'Documentation', topic: 'WebXR', category: 'Tools & documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API', origin: 'External resource', verification: 'verified-external', source: 'MDN Web Docs' },
  { title: 'OpenXR', description: 'Learn about the common API standard for applications across augmented and virtual reality devices.', type: 'Open standard', topic: 'XR interoperability', category: 'Tools & documentation', url: 'https://www.khronos.org/openxr/', origin: 'External resource', verification: 'verified-external', source: 'Khronos Group' },
  { title: 'OpenCV Tutorials', description: 'Study image processing, feature matching, camera calibration, and 3D reconstruction.', type: 'Tutorials', topic: 'Computer vision', category: 'Tutorials & learning paths', url: 'https://docs.opencv.org/4.x/d9/df8/tutorial_root.html', origin: 'External resource', verification: 'verified-external', source: 'OpenCV' },
  { title: 'Build for visionOS', description: 'Explore Apple’s tools and learning pathways for spatial applications.', type: 'Developer guide', topic: 'Spatial interfaces', category: 'Tools & documentation', url: 'https://developer.apple.com/visionos/', origin: 'External resource', verification: 'verified-external', source: 'Apple Developer' },
  { title: 'Unity XR Manual', description: 'Learn how Unity supports XR and how to configure an XR project.', type: 'Documentation', topic: 'XR development', category: 'Tools & documentation', url: 'https://docs.unity3d.com/Manual/XR.html', origin: 'External resource', verification: 'verified-external', source: 'Unity' },
];
export interface GalleryItem { id: string; src: string; alt: string; caption: string; category: string; width: number; height: number; source: string; position?: string; contain?: boolean; link?: string; }
const labPhotos: GalleryItem[] = [
  ['page-1-image-5-X13.jpg', 'Lab Spaces', 'A space to connect ideas', 'Lab interior with workstations and equipment table', 922, 692, 1],
  ['page-2-image-17-X35.jpg', 'At Work', 'From an idea to a working prototype', 'Students working at an electronics bench with a laptop', 816, 615, 2],
  ['page-1-image-4-X12.jpg', 'Equipment', 'The tools behind the questions', 'Electronics development boards and robotics equipment on a lab worktable', 922, 692, 1],
  ['page-2-image-18-X36.jpg', 'At Work', 'Working through the details', 'Student at a coding workstation', 816, 615, 2],
  ['page-2-image-20-X38.jpg', 'Lab Spaces', 'Ideas grow through conversation', 'A group discussion in the lab', 816, 615, 2],
  ['page-2-image-23-X41.jpg', 'At Work', 'Learning, together', 'Students working with electronics and laptops', 816, 615, 2],
].map(([file, category, caption, alt, width, height, page], i) => ({ id: `gallery-${i+1}`, src: `/images/${file}`, category: String(category), caption: String(caption), alt: String(alt), width: Number(width), height: Number(height), source: `Lab brochure, page ${page} · Date not supplied` }));
// Prototype photographs from the in-house project board, each linking to its project page.
const projectPhotos: GalleryItem[] = projects.filter(project => project.image && project.statusSource === 'board').map((project, i) => ({ id: `gallery-${labPhotos.length + i + 1}`, src: project.image!, category: 'Projects', caption: project.title, alt: project.imageAlt || project.title, width: project.imageWidth || 800, height: project.imageHeight || 600, source: 'In-house project board · Date not supplied', position: project.imagePosition, contain: (project.imageHeight || 0) > (project.imageWidth || 0) * 1.6, link: `/projects/${project.slug}` }));
export const gallery: GalleryItem[] = [...labPhotos, ...projectPhotos];
export const equipment = ['ESP32 development board', 'Raspberry Pi 3 Model B+', 'Altera Cyclone IV FPGA DE0-Nano', 'STM32 Nucleo boards', 'LPC2148 development board', 'ATmega2560 development board', 'P89V51RD2 development board', 'Tiva Launchpad'];
