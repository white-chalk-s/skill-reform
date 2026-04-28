import {
  homeCalendar,
  homeQuickEntries,
  htmlAssets as mockHtmlAssets,
  skills,
  taskContexts as mockTaskContexts,
  taskReports,
  tasks as mockTasks
} from '../data/mockData.js';

const STORAGE_KEY = 'skill-reform:mvp:v1';

const DEFAULT_HTML_PREVIEW = `
<section style="padding:24px;font-family:Arial,sans-serif;background:#f7fbff;border-radius:18px">
  <h2 style="margin:0 0 10px;color:#1f2c41">HTML 预览区</h2>
  <p style="margin:0;color:#617088;line-height:1.7">这里显示临时预览或已保存 HTML 成果的页面效果。</p>
</section>
`.trim();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowLabel() {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createInitialStore() {
  return {
    tasks: clone(mockTasks),
    taskContexts: clone(mockTaskContexts),
    htmlAssets: clone(mockHtmlAssets)
  };
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStore() {
  const initialStore = createInitialStore();

  if (!canUseStorage()) {
    return initialStore;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
    return initialStore;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : initialStore.tasks,
      taskContexts: Array.isArray(parsed.taskContexts) ? parsed.taskContexts : initialStore.taskContexts,
      htmlAssets: Array.isArray(parsed.htmlAssets) ? parsed.htmlAssets : initialStore.htmlAssets
    };
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
    return initialStore;
  }
}

function writeStore(store) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  return store;
}

function sortTasks(list) {
  return [...list].sort((left, right) => {
    const rightTime = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
    const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function sortAssets(list) {
  return [...list].sort((left, right) => {
    const rightTime = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
    const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function buildTaskSummary(title) {
  return `围绕「${title}」继续整理任务上下文、HTML 成果和后续沉淀。`;
}

function buildAssetName(taskTitle, htmlContent) {
  const titleMatch = htmlContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
  const heading = titleMatch?.[1]?.replace(/<[^>]+>/g, '').trim();
  if (heading) return heading;
  return `${taskTitle} HTML 成果`;
}

function buildAssetDescription(htmlContent) {
  const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plainText.slice(0, 60) || '已保存的 HTML 成果。';
}

function touchTask(store, taskId) {
  store.tasks = store.tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          updatedAt: nowLabel()
        }
      : task
  );
}

export function getTasks() {
  return sortTasks(readStore().tasks);
}

export function getTaskById(id) {
  return getTasks().find((item) => item.id === id) ?? null;
}

export function createTask(partial = {}) {
  const store = readStore();
  const timestamp = nowLabel();
  const task = {
    id: partial.id ?? createId('task'),
    title: partial.title?.trim() || `新建任务 ${nowTime()}`,
    status: partial.status?.trim() || '进行中',
    scheduledDate: partial.scheduledDate ?? nowDate(),
    scheduledTime: partial.scheduledTime ?? nowTime(),
    priority: partial.priority ?? '中优先级',
    updatedAt: timestamp,
    createdAt: timestamp,
    summary: partial.summary ?? buildTaskSummary(partial.title?.trim() || `新建任务 ${nowTime()}`),
    displayGroup: partial.displayGroup ?? 'today',
    notes: partial.notes ?? ''
  };

  store.tasks.unshift(task);
  store.taskContexts.unshift({
    taskId: task.id,
    goal: '',
    background: '',
    constraints: '',
    criteria: ''
  });

  writeStore(store);
  return task;
}

export function updateTask(taskId, updates = {}) {
  const store = readStore();
  const current = store.tasks.find((item) => item.id === taskId);
  if (!current) return null;

  const nextTask = {
    ...current,
    ...updates,
    title: updates.title?.trim() || current.title,
    status: updates.status?.trim() || current.status,
    summary: updates.summary?.trim() || current.summary,
    updatedAt: updates.updatedAt ?? nowLabel()
  };

  store.tasks = store.tasks.map((item) => (item.id === taskId ? nextTask : item));
  writeStore(store);
  return nextTask;
}

export function getTaskContext(taskId) {
  return readStore().taskContexts.find((item) => item.taskId === taskId) ?? null;
}

export function saveTaskContext(taskId, updates = {}) {
  const store = readStore();
  const current = store.taskContexts.find((item) => item.taskId === taskId);
  const nextContext = {
    taskId,
    goal: updates.goal ?? current?.goal ?? '',
    background: updates.background ?? current?.background ?? '',
    constraints: updates.constraints ?? current?.constraints ?? '',
    criteria: updates.criteria ?? current?.criteria ?? ''
  };

  if (current) {
    store.taskContexts = store.taskContexts.map((item) => (item.taskId === taskId ? nextContext : item));
  } else {
    store.taskContexts.unshift(nextContext);
  }

  touchTask(store, taskId);
  writeStore(store);
  return nextContext;
}

export function getHtmlAssetsByTaskId(taskId) {
  return sortAssets(readStore().htmlAssets.filter((item) => item.taskId === taskId));
}

export function createHtmlAsset(taskId, draft) {
  const store = readStore();
  const task = store.tasks.find((item) => item.id === taskId);
  if (!task) return null;

  const htmlContent = draft?.htmlContent?.trim() || DEFAULT_HTML_PREVIEW;
  const timestamp = nowLabel();
  const asset = {
    id: createId('asset'),
    taskId,
    name: draft?.name?.trim() || buildAssetName(task.title, htmlContent),
    description: draft?.description?.trim() || buildAssetDescription(htmlContent),
    htmlContent,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  store.htmlAssets.unshift(asset);
  touchTask(store, taskId);
  writeStore(store);
  return asset;
}

export function getTaskReport(taskId) {
  return taskReports.find((item) => item.taskId === taskId) ?? null;
}

export function getHomePageData() {
  const currentTasks = getTasks();
  const currentAssets = sortAssets(readStore().htmlAssets);
  const todayTasks = currentTasks.filter((item) => item.displayGroup !== 'history');
  const historyTasks = currentTasks.filter((item) => item.displayGroup === 'history');
  const recentAssets = currentAssets.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.name,
    meta: item.updatedAt,
    type: 'html'
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
      { id: 'in-progress', label: '进行中任务', value: String(currentTasks.filter((item) => item.status === '进行中').length), tone: 'blue' },
      { id: 'skill-count', label: '已沉淀 Skill', value: String(skills.length), tone: 'green' },
      { id: 'html-assets', label: 'HTML 成果', value: String(currentAssets.length), tone: 'purple' }
    ],
    calendar: homeCalendar,
    todayTasks,
    quickEntries: homeQuickEntries,
    historyTasks,
    recentAssets,
    recentSkills
  };
}
