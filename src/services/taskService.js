import { homeCalendar, homeQuickEntries, htmlAssets, skills, taskContexts, taskReports, tasks } from '../data/mockData.js';

export function getTasks() {
  return tasks;
}

export function getTaskById(id) {
  return tasks.find((item) => item.id === id) ?? tasks[0];
}

export function getTaskContext(taskId) {
  return taskContexts.find((item) => item.taskId === taskId) ?? null;
}

export function getHtmlAssetsByTaskId(taskId) {
  return htmlAssets.filter((item) => item.taskId === taskId);
}

export function getTaskReport(taskId) {
  return taskReports.find((item) => item.taskId === taskId) ?? null;
}

export function getHomePageData() {
  const todayTasks = tasks.filter((item) => item.displayGroup === 'today');
  const historyTasks = tasks.filter((item) => item.displayGroup === 'history');
  const recentAssets = htmlAssets
    .filter((item) => item.showOnHomeRecent)
    .map((item) => ({
      id: item.id,
      title: item.name,
      meta: item.homeRecentMeta,
      type: item.homeRecentType
    }));
  const recentSkills = skills
    .filter((item) => item.showOnHomeRecent)
    .slice(0, 4)
    .map((item, index) => ({
      id: item.id,
      title: item.name,
      category: item.category,
      usage: `使用 ${item.usageCount} 次`,
      tone: ['purple', 'blue', 'orange', 'green'][index] ?? 'blue'
    }));

  return {
    stats: [
      { id: 'in-progress', label: '进行中任务', value: String(tasks.filter((item) => item.status === '进行中').length), tone: 'blue' },
      { id: 'skill-count', label: '已沉淀 Skill', value: String(skills.length), tone: 'green' },
      { id: 'week-report', label: '本周报告', value: '6', tone: 'purple' }
    ],
    calendar: homeCalendar,
    todayTasks,
    quickEntries: homeQuickEntries,
    historyTasks,
    recentAssets,
    recentSkills
  };
}
