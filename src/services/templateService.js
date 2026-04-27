import { templates } from '../data/mockData.js';

export function getTemplates() {
  return templates;
}

export function getTemplateById(id) {
  return templates.find((item) => item.id === id) ?? null;
}

export function getTemplatesByType(type) {
  return templates.filter((item) => item.type === type);
}
