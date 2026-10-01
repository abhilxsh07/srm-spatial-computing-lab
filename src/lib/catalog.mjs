/**
 * Pure helpers that assemble faculty and project records from the lab's source documents.
 * Used by src/data/content.ts and the gallery page.
 */

/** @param {string} text */
export const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Comparison key for a person's name: ignores the "Dr" prefix, spaces, dots and letter case. */
export const nameKey = (/** @type {string} */ name) => name.toLowerCase().replace(/^\s*dr\.?\s*/, '').replace(/[^a-z]/g, '');

/** URL-safe identifier for a person, used for mentor anchors and the project filter. */
export const personSlug = (/** @type {string} */ name) => slugify(name.replace(/^\s*Dr\.?\s*/i, ''));

/**
 * @typedef {{ name: string, role: string, email: string, image: string, source_name?: string, aliases?: string[] }} FacultyRecord
 * @typedef {{ id: 'brochure' | 'board' | 'list', title: string, page?: number, status?: string }} ProjectSourceRef
 * @typedef {{ title: string, slug: string, status: string, statusSource: 'brochure' | 'board' | 'list', mentors: string[],
 *   sources: ProjectSourceRef[], details: string[], highlights: [string, string][],
 *   image?: string, imageAlt?: string, imageWidth?: number, imageHeight?: number, imagePosition?: string, imageNote?: string }} ProjectRecord
 */

/**
 * Find a faculty member by any spelling used in the source documents.
 * @param {string} name
 * @param {FacultyRecord[]} faculty
 * @returns {FacultyRecord | undefined}
 */
export function findFaculty(name, faculty) {
  const key = nameKey(name);
  return faculty.find(person => [person.name, person.source_name, ...(person.aliases || [])].some(variant => variant && nameKey(variant) === key));
}

/**
 * Combine the three project sources into one ordered list.
 * Order: in-house board projects (which have photographs), then the faculty project list, then brochure-only projects.
 * A board entry describing a brochure project (same title, or `same_as`) is merged into that record and keeps the
 * brochure title, so existing project URLs do not change.
 * @param {{ brochure: any, board: any, list: any, faculty: FacultyRecord[] }} sources
 * @returns {ProjectRecord[]}
 */
export function mergeProjectRecords({ brochure, board, list, faculty }) {
  const canonical = (/** @type {string} */ name) => findFaculty(name, faculty)?.name ?? name;
  /** @type {Map<string, any>} */
  const brochureByTitle = new Map(brochure.projects.map((/** @type {any} */ project) => [project.title, project]));
  const merged = new Set();
  /** @type {Omit<ProjectRecord, 'slug'>[]} */
  const records = [];
  for (const item of board.projects) {
    const match = brochureByTitle.get(item.same_as || item.title);
    if (match) merged.add(match.title);
    records.push({
      title: match ? match.title : item.title,
      status: board.status,
      statusSource: 'board',
      mentors: (match ? match.mentors : []).map(canonical),
      sources: [
        { id: 'board', page: item.board_page, title: item.title },
        ...(match ? [{ id: /** @type {const} */ ('brochure'), page: match.source_page, status: match.status, title: match.title }] : []),
      ],
      details: item.details || [],
      highlights: item.highlights || [],
      image: item.image,
      imageAlt: item.image_alt,
      imageWidth: item.width,
      imageHeight: item.height,
      imagePosition: item.image_position,
      imageNote: item.image_note,
    });
  }
  for (const item of list.projects) {
    records.push({ title: item.title, status: list.status, statusSource: 'list', mentors: [canonical(item.mentor)], sources: [{ id: 'list', title: item.title }], details: [], highlights: [] });
  }
  for (const item of brochure.projects) {
    if (merged.has(item.title)) continue;
    records.push({ title: item.title, status: item.status, statusSource: 'brochure', mentors: item.mentors.map(canonical), sources: [{ id: 'brochure', page: item.source_page, status: item.status, title: item.title }], details: [], highlights: [] });
  }
  return records.map(record => ({ ...record, slug: slugify(record.title) }));
}

/**
 * Decide which gallery tiles span two columns in the three-column desktop grid.
 * Only wide landscape photographs are widened, and only where the tile fits on the current row, so rows never leave gaps.
 * @param {{ width: number, height: number }[]} items
 * @returns {boolean[]}
 */
export function galleryWideTiles(items) {
  let column = 0;
  let sinceWide = 4;
  return items.map(item => {
    const canSpan = item.width >= 700 && item.width / item.height >= 1.3;
    if (canSpan && sinceWide >= 4 && column < 2) { column = (column + 2) % 3; sinceWide = 0; return true; }
    column = (column + 1) % 3;
    sinceWide += 1;
    return false;
  });
}
