import { skillLibraryMeta, skills } from '../data/mockData.js';

export function getSkills() {
  return skills;
}

export function getSkillById(id) {
  return skills.find((item) => item.id === id) ?? skills[0];
}

export function getSkillLibraryMeta() {
  return skillLibraryMeta;
}
