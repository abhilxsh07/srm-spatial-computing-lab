/** Pure filtering and validation used by the URL-driven project/resource filters and the contact form. */
export function filterProjects(items, query = '', category = 'All', status = 'All', mentor = 'All') {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => (category === 'All' || item.category === category) && (status === 'All' || item.status === status) && (mentor === 'All' || (item.mentorSlugs || []).includes(mentor)) && words.every(word => `${item.title} ${item.summary} ${item.keywords} ${(item.mentors || []).join(' ')}`.toLowerCase().includes(word)));
}
export function filterResources(items, query = '', category = 'All') {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => (category === 'All' || item.category === category) && words.every(word => `${item.title} ${item.description} ${item.topic} ${item.type} ${item.source}`.toLowerCase().includes(word)));
}
export function validateEnquiry(values) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email?.trim() || '')) errors.email = 'Please enter a valid email address.';
  if (!values.type) errors.type = 'Please select an enquiry type.';
  if (!values.message?.trim()) errors.message = 'Please enter a message.';
  return errors;
}
