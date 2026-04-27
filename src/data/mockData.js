/*
 * Development-only mock data.
 * These records exist only for layout restoration, interaction demos, and page validation.
 * They will be replaced by local SQLite-backed data access in a later stage.
 */

export const tasks = [
  {
    id: 'demo-task',
    title: 'HTML 原型设计平台任务区重构',
    status: '进行中',
    scheduledDate: '2025-05-15',
    scheduledTime: '10:30',
    priority: '高优先级',
    updatedAt: '2025-05-15 18:36',
    createdAt: '2026-04-27',
    summary: '基于 PRD 与四个高保真原型，搭建任务方法沉淀平台的前端基础结构。',
    displayGroup: 'today'
  },
  {
    id: 'skill-draft',
    title: '生成原型设计 Skill 并沉淀',
    status: '待处理',
    scheduledDate: '2025-05-15',
    scheduledTime: '14:00',
    priority: '中优先级',
    updatedAt: '2025-05-15 14:00',
    createdAt: '2026-04-27',
    summary: '把原型设计任务拆解为可复用 Skill 草稿，沉淀输入、步骤与标准。',
    displayGroup: 'today'
  },
  {
    id: 'flowchart-task',
    title: '需求文档转流程图',
    status: '待处理',
    scheduledDate: '2025-05-15',
    scheduledTime: '15:30',
    priority: '中优先级',
    updatedAt: '2025-05-15 15:30',
    createdAt: '2026-04-27',
    summary: '将当前任务报告中的关键步骤整理为可编辑流程图节点。',
    displayGroup: 'today'
  },
  {
    id: 'weekly-report-task',
    title: '市场周报生成与整理',
    status: '未开始',
    scheduledDate: '2025-05-15',
    scheduledTime: '17:00',
    priority: '低优先级',
    updatedAt: '2025-05-15 17:00',
    createdAt: '2026-04-27',
    summary: '汇总本周项目进展，生成标准化周报结构并整理归档。',
    displayGroup: 'today'
  },
  {
    id: 'competitor-report-task',
    title: '竞品分析报告沉淀',
    status: '未开始',
    scheduledDate: '2025-05-15',
    scheduledTime: '18:30',
    priority: '低优先级',
    updatedAt: '2025-05-15 18:30',
    createdAt: '2026-04-27',
    summary: '将竞品分析过程中的比较维度和输出规则沉淀为复用模板。',
    displayGroup: 'today'
  },
  {
    id: 'enterprise-site-redesign',
    title: '企业官网改版原型设计',
    status: '已完成',
    scheduledDate: '2025-05-14',
    scheduledTime: '18:20',
    priority: '高优先级',
    updatedAt: '2025-05-14 18:20',
    createdAt: '2025-05-10',
    summary: '完成企业官网信息架构调整与原型设计。',
    displayGroup: 'history'
  },
  {
    id: 'prd-analysis',
    title: '产品需求分析与文档整理',
    status: '进行中',
    scheduledDate: '2025-05-05',
    scheduledTime: '09:15',
    priority: '中优先级',
    updatedAt: '2025-05-05 09:15',
    createdAt: '2025-05-02',
    summary: '梳理需求并输出 PRD 文档，待评审补充细节。',
    displayGroup: 'history'
  },
  {
    id: 'industry-competitor-analysis',
    title: '行业竞品分析报告',
    status: '已完成',
    scheduledDate: '2025-05-02',
    scheduledTime: '17:45',
    priority: '中优先级',
    updatedAt: '2025-05-02 17:45',
    createdAt: '2025-04-29',
    summary: '完成主流竞品功能对比与分析，形成可视化结论报告。',
    displayGroup: 'history'
  }
];

export const taskContexts = [
  {
    taskId: 'demo-task',
    goal: '生成中高保真 HTML 原型，并沉淀为可复用任务方法。',
    background: '已有 PRD 与首页、任务区、Skill 库、设置页四个 HTML 原型。',
    constraints: '沿用原型视觉风格，不改一级导航，不删核心模块。',
    criteria: '页面布局、文案、按钮和卡片层级尽量还原原型。'
  }
];

export const htmlAssets = [
  {
    id: 'asset-home',
    taskId: 'demo-task',
    name: '首页 Dashboard 原型',
    description: '任务日历、今日待处理、历史任务、最近沉淀与最近使用 Skill 的首页布局。',
    htmlContent: '<section><h1>首页 Dashboard 原型</h1><p>HTML 成果预览占位</p></section>',
    includeInReport: true,
    createdAt: '2025-05-15 16:40',
    updatedAt: '2025-05-15 17:12',
    homeRecentType: 'report',
    homeRecentMeta: '报告 · 2 小时前',
    showOnHomeRecent: true
  },
  {
    id: 'asset-flow',
    taskId: 'flowchart-task',
    name: '任务沉淀流程图',
    description: '从当前任务报告提炼出的关键执行节点与连线关系。',
    htmlContent: '<section><h1>任务沉淀流程图</h1><p>流程图成果预览占位</p></section>',
    includeInReport: false,
    createdAt: '2025-05-15 13:00',
    updatedAt: '2025-05-15 13:20',
    homeRecentType: 'flow',
    homeRecentMeta: '流程图 · 5 小时前',
    showOnHomeRecent: true
  },
  {
    id: 'asset-skill-draft',
    taskId: 'skill-draft',
    name: 'Skill 草稿：生成原型',
    description: '将高保真原型生成流程沉淀为可复用的 Skill 草稿。',
    htmlContent: '<section><h1>Skill 草稿：生成原型</h1><p>Skill 草稿预览占位</p></section>',
    includeInReport: false,
    createdAt: '2025-05-14 18:22',
    updatedAt: '2025-05-14 18:22',
    homeRecentType: 'html',
    homeRecentMeta: 'Skill 草稿 · 昨天 18:22',
    showOnHomeRecent: true
  }
];

export const taskReports = [
  {
    id: 'report-demo',
    taskId: 'demo-task',
    templateId: 'task-report-template-v1',
    overview: '当前任务围绕任务方法沉淀平台的项目骨架与首页还原展开，目标是完成可迭代的前端基础结构。',
    contextBasis: '依据 PRD、四个 HTML 原型、既定设计规范和路由约束进行页面还原与结构搭建。',
    htmlAssetsSummary: '已形成首页 Dashboard 原型与相关布局结构，用于后续任务区和 Skill 库页面复用。',
    currentConclusion: '基础架构已经可运行，首页样式已进入原型级还原阶段。',
    riskBoundary: '当前阶段仅做 mock 数据和静态交互，不接真实数据库，不处理复杂流程图存储。',
    nextActionsAndFlowchart: '下一步建议逐页完善任务区、Skill 库和设置页，并补齐 service 层与模板结构。',
    status: 'draft',
    updatedAt: '2025-05-15 18:36'
  }
];

export const skills = [
  {
    id: 'prototype',
    name: '如何生成中高保真 HTML 原型',
    category: '原型设计',
    status: '已发布',
    version: 'v1.4',
    scenario: '当用户提供需求文档、页面截图、参考作品或口头描述，希望生成中高保真 HTML 原型时使用。',
    inputs: ['需求文档或需求描述', '当前页面截图', '参考页面或风格要求', '用户对布局、交互、信息密度的偏好'],
    steps: ['阅读需求，提取页面目标', '拆分页面模块和信息层级', '确定布局结构和交互入口', '生成 HTML 原型', '检查视觉质量和概念清晰度', '根据反馈迭代并沉淀版本'],
    aiRoles: ['提炼需求重点', '输出页面结构和模块建议', '生成 HTML 原型初稿'],
    userCheckpoints: ['确认页面信息层级', '确认主要交互入口', '确认视觉方向是否接近预期'],
    qualityCriteria: ['页面接近中高保真，不是粗糙线框图', '信息层级清晰', '交互入口明确，便于继续迭代'],
    outputs: ['HTML 原型', '页面结构说明', '可复用的原型生成方法'],
    reusablePrompt: '请基于任务上下文、需求文档和参考截图，按“页面目标 → 模块拆分 → 布局结构 → 交互说明 → HTML 原型 → 检查清单”的流程生成中高保真 HTML 原型。',
    usageCount: 12,
    relatedTaskCount: 6,
    updatedAt: '2025-05-15 18:36',
    showOnHomeRecent: true
  },
  {
    id: 'requirement',
    name: '如何拆解需求文档',
    category: '需求分析',
    status: '已发布',
    version: 'v1.2',
    scenario: '当需求文档较长、信息混杂、目标不清晰时使用。',
    inputs: ['需求文档', '客户反馈', '已有截图或旧页面', '业务约束和交付目标'],
    steps: ['识别任务目标', '提取背景与约束', '拆解页面或功能模块', '整理待确认问题', '输出任务上下文和执行清单'],
    aiRoles: ['抽取结构化字段', '拆出模块边界', '整理待确认问题'],
    userCheckpoints: ['确认目标定义', '确认约束与优先级', '确认输出范围'],
    qualityCriteria: ['目标与场景清晰', '关键约束不遗漏', '输出结构便于下游执行'],
    outputs: ['任务上下文', '模块清单', '待确认问题列表'],
    reusablePrompt: '请将输入需求文档拆解为任务目标、背景、约束、判断标准、模块清单和待确认问题。',
    usageCount: 9,
    relatedTaskCount: 5,
    updatedAt: '2025-05-14 17:10',
    showOnHomeRecent: true
  },
  {
    id: 'report',
    name: '如何生成任务报告',
    category: '报告生成',
    status: '已发布',
    version: 'v1.0',
    scenario: '当单个任务形成阶段性成果，需要整理成固定结构报告时使用。',
    inputs: ['任务上下文', 'HTML 成果', '当前整理', '流程图节点'],
    steps: ['读取任务上下文', '套用固定六章模板', '生成报告草稿', '校验字段完整性', '人工修订并保存'],
    aiRoles: ['按模板生成章节', '提炼风险边界', '输出后续行动项'],
    userCheckpoints: ['确认关键结论', '确认风险边界', '确认后续行动项'],
    qualityCriteria: ['章节齐全', '字段命名稳定', '结论可追溯到输入材料'],
    outputs: ['当前任务报告', '可用于流程图的后续行动与节点建议'],
    reusablePrompt: '请基于任务上下文、HTML 成果和当前整理，按固定六章模板生成当前任务报告。',
    usageCount: 8,
    relatedTaskCount: 4,
    updatedAt: '2025-05-13 16:00',
    showOnHomeRecent: true
  },
  {
    id: 'flow',
    name: '如何梳理流程图',
    category: '流程梳理',
    status: '待优化',
    version: 'v0.9',
    scenario: '当需要把任务完成方法表达为流程图节点与连线时使用。',
    inputs: ['任务报告', '行动项', '流程节点草稿', '人工确认点'],
    steps: ['提取流程节点', '判断节点顺序', '生成连线关系', '编辑节点说明', '保存并导出流程图'],
    aiRoles: ['抽取节点结构', '补全节点描述', '输出节点顺序建议'],
    userCheckpoints: ['确认节点是否完整', '确认连接关系是否合理'],
    qualityCriteria: ['节点标题简洁', '节点顺序清晰', '流程图可复用'],
    outputs: ['流程图节点结构', '流程图预览', '可复用流程定义'],
    reusablePrompt: '请基于当前任务报告与当前整理中的流程节点字段，生成可编辑的流程图节点与连线。',
    usageCount: 7,
    relatedTaskCount: 3,
    updatedAt: '2025-05-12 11:20',
    showOnHomeRecent: true
  },
  {
    id: 'compete',
    name: '如何做竞品能力对比',
    category: '竞品分析',
    status: '草稿',
    version: 'v0.8',
    scenario: '当需要比较两个或多个产品能力，并输出结构化结论时使用。',
    inputs: ['竞品资料', '自身产品资料', '对比维度', '客户关注点'],
    steps: ['确定对比维度', '整理双方能力', '统一表达粒度', '输出表格和结论', '检查无依据描述'],
    aiRoles: ['整理对比维度', '生成表格结构', '输出对比摘要'],
    userCheckpoints: ['确认对比维度', '确认结论依据', '确认输出范围'],
    qualityCriteria: ['结论有依据', '维度一致', '输出可复用'],
    outputs: ['对比维度表', '能力对比摘要', '竞品分析草稿'],
    reusablePrompt: '请按统一对比维度整理竞品与自身产品能力，并输出结构化差异结论。',
    usageCount: 5,
    relatedTaskCount: 2,
    updatedAt: '2025-05-09 19:40',
    showOnHomeRecent: false
  },
  {
    id: 'review',
    name: '如何复盘一次任务过程',
    category: '复盘',
    status: '草稿',
    version: 'v0.6',
    scenario: '当任务结束后，希望把经验转成下次可复用的方法时使用。',
    inputs: ['任务报告', '执行过程', '问题记录', '最终结果'],
    steps: ['回顾目标和结果', '识别有效步骤', '记录判断标准', '提炼可复用流程', '生成 Skill 草稿'],
    aiRoles: ['梳理过程节点', '提炼可复用经验', '整理复盘结构'],
    userCheckpoints: ['确认哪些经验可复用', '确认哪些问题需要保留警示'],
    qualityCriteria: ['复盘不流于总结', '沉淀的是方法而非常识', '可直接服务下次任务'],
    outputs: ['任务复盘摘要', 'Skill 草稿', '复用建议'],
    reusablePrompt: '请从结果、过程、判断、失误和可复用经验中提炼任务方法，生成复盘结论与 Skill 草稿。',
    usageCount: 3,
    relatedTaskCount: 1,
    updatedAt: '2025-05-08 20:00',
    showOnHomeRecent: false
  }
];

export const templates = [
  {
    id: 'task-report-template-v1',
    name: '默认当前任务报告模板',
    type: 'report',
    version: 'v1.0.0',
    fields: [
      'overview',
      'contextBasis',
      'htmlAssetsSummary',
      'currentConclusion',
      'riskBoundary',
      'nextActionsAndFlowchart'
    ],
    promptText: '请严格按照当前任务报告模板输出，不得新增章节，不得省略必填章节。',
    isActive: true
  },
  {
    id: 'task-organize-template-v1',
    name: '默认当前整理模板',
    type: 'organize',
    version: 'v1.0.0',
    fields: [
      'currentConclusion',
      'keyBasis',
      'pendingQuestions',
      'actionItems',
      'flowchartNodes'
    ],
    promptText: '请输出当前结论、关键依据、待确认问题、行动项和流程图节点。',
    isActive: true
  },
  {
    id: 'skill-template-v1',
    name: '默认 Skill 生成模板',
    type: 'skill',
    version: 'v1.0.0',
    fields: [
      'name',
      'scenario',
      'inputs',
      'steps',
      'aiRoles',
      'userCheckpoints',
      'qualityCriteria',
      'outputs',
      'reusablePrompt'
    ],
    promptText: '请从任务中提炼可复用的任务方法，而不是记录基础知识或工具菜单。',
    isActive: true
  },
  {
    id: 'ai-input-template-v1',
    name: '本地 AI 输入模板',
    type: 'ai_input',
    version: 'v1.0.0',
    fields: ['taskContext', 'htmlAssets', 'currentOrganize', 'templateId'],
    promptText: '{ "taskContext": {}, "htmlAssets": [], "currentOrganize": {}, "templateId": "" }',
    isActive: true
  },
  {
    id: 'ai-output-template-v1',
    name: '本地 AI 回传模板',
    type: 'ai_output',
    version: 'v1.0.0',
    fields: ['taskReport', 'organizePanel', 'flowchart', 'skillDraft'],
    promptText: '{ "taskReport": {}, "organizePanel": {}, "flowchart": {}, "skillDraft": {} }',
    isActive: true
  }
];

export const settings = {
  databasePath: 'D:/TaskSkillPlatform/data/app.db',
  htmlAssetsPath: 'D:/TaskSkillPlatform/html_assets/',
  exportPath: 'D:/TaskSkillPlatform/exports/',
  backupPath: 'D:/TaskSkillPlatform/backups/',
  enableTemplateValidation: true,
  autoBackupBeforeGenerate: true,
  allowAiOverwriteConfirmedFields: false,
  keepReportGenerationHistory: true
};

export const homeCalendar = {
  title: '2025年5月',
  weekNames: ['日', '一', '二', '三', '四', '五', '六'],
  days: [
    { num: 27, muted: true },
    { num: 28, muted: true },
    { num: 29, muted: true },
    { num: 30, muted: true },
    { num: 1 },
    { num: 2, dots: ['orange'] },
    { num: 3 },
    { num: 4 },
    { num: 5 },
    { num: 6, label: '报告', labelTone: 'blue' },
    { num: 7 },
    { num: 8, label: 'Skill', labelTone: 'green' },
    { num: 9 },
    { num: 10 },
    { num: 11 },
    { num: 12 },
    { num: 13 },
    { num: 14 },
    { num: 15, active: true, dots: ['blue'] },
    { num: 16, label: '任务', labelTone: 'orange' },
    { num: 17, dots: ['orange'] },
    { num: 18 },
    { num: 19 },
    { num: 20 },
    { num: 21, label: '报告', labelTone: 'blue' },
    { num: 22 },
    { num: 23, label: 'Skill', labelTone: 'green' },
    { num: 24 },
    { num: 25 },
    { num: 26 },
    { num: 27 },
    { num: 28, label: '任务', labelTone: 'orange' },
    { num: 29 },
    { num: 30, label: '报告', labelTone: 'blue' },
    { num: 31 }
  ],
  legend: [
    { label: '任务 3', tone: 'orange' },
    { label: 'Skill 3', tone: 'green' },
    { label: '报告 3', tone: 'blue' },
    { label: '其他 2', tone: 'gray' }
  ]
};

export const homeQuickEntries = [
  { id: 'quick-1', title: '添加 HTML 成果', desc: '上传并沉淀成果', tone: 'blue', href: '/tasks/demo-task' },
  { id: 'quick-2', title: '查看任务报告', desc: '浏览历史报告', tone: 'green', href: '/tasks/demo-task' },
  { id: 'quick-3', title: '生成流程图', desc: 'AI 生成流程图', tone: 'purple', href: '/tasks/demo-task' },
  { id: 'quick-4', title: '进入 Skill 库', desc: '管理与复用 Skill', tone: 'orange', href: '/skills' }
];

export const skillLibraryMeta = {
  weeklyUsageCount: 36,
  filterDescription: '原型设计、需求分析、报告生成、流程梳理',
  ruleSummary: 'Skill 必须包含场景、输入、流程、AI 分工、确认点、判断标准和复用提示词。'
};

export const settingsPageMeta = {
  sections: [
    { id: 'report', label: '当前任务报告模板' },
    { id: 'organize', label: '当前整理模板' },
    { id: 'skill', label: 'Skill 生成模板' },
    { id: 'ai', label: '本地 AI 输入/回传模板' },
    { id: 'path', label: '备份与保存路径' },
    { id: 'export', label: '数据导入导出' }
  ],
  organizeFieldSummary: '当前结论、关键依据、待确认问题、行动项、流程图节点。',
  exportSummary: '支持导出任务包、HTML 成果、当前任务报告、Skill、流程图和模板设置。',
  principleSummary: 'AI 输出必须匹配模板字段，报告、整理和 Skill 草稿需要记录模板版本。',
  toggleSummary: '模板校验：开启；生成前备份：开启；AI 覆盖已确认字段：关闭。'
};
