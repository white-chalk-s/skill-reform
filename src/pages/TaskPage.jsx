import { useEffect, useMemo, useState } from 'react';
import { getHtmlAssetsByTaskId, getTaskById, getTaskContext, getTaskReport, getTasks } from '../services/taskService.js';

const DEFAULT_TASK_ID = 'demo-task';
const EMPTY_TASK_MESSAGE = '未找到当前任务，请返回首页重新选择任务。';
const TABS = [
  { key: 'work', label: '工作视图' },
  { key: 'report', label: '当前任务报告' },
  { key: 'flow', label: '流程图' },
  { key: 'skill', label: 'Skill 化' }
];

const DEFAULT_PREVIEW_HTML = `
  <section style="padding:24px;border-radius:18px;background:#f7fbff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;">
    <h2 style="margin:0 0 10px;color:#1f2c41;font-size:22px;">HTML 预览区</h2>
    <p style="margin:0;color:#617088;line-height:1.7;">当前还没有可展示的 HTML 成果。你可以先粘贴一段 HTML，再点击“临时预览”。</p>
  </section>
`.trim();

function buildReportSections(report) {
  if (!report) return [];

  return [
    { label: '任务概述', value: report.overview },
    { label: '上下文依据', value: report.contextBasis },
    { label: 'HTML 成果说明', value: report.htmlAssetsSummary },
    { label: '当前结论', value: report.currentConclusion },
    { label: '风险边界', value: report.riskBoundary },
    { label: '后续行动与流程图建议', value: report.nextActionsAndFlowchart }
  ];
}

function buildTaskInfoDraft(task, assets, report) {
  return {
    title: task?.title ?? '未命名任务',
    status: task?.status ?? '未知状态',
    createdAt: task?.createdAt ?? '--',
    updatedAt: task?.updatedAt ?? '--',
    htmlAssetCount: String(assets.length),
    reportVersion: report ? '当前任务报告 V1' : '未生成',
    notes: ''
  };
}

function buildContextDraft(context) {
  return {
    goal: context?.goal ?? '',
    background: context?.background ?? '',
    constraints: context?.constraints ?? '',
    criteria: context?.criteria ?? ''
  };
}

function buildOrganizeDraft(context, report, assets) {
  const hasAsset = assets.length > 0;

  return {
    currentConclusion: report?.currentConclusion ?? '暂未生成当前任务报告，当前整理区先保持为空。',
    keyBasis: report?.contextBasis ?? context?.constraints ?? '暂无关键依据，请先检查任务上下文。',
    pendingQuestions: hasAsset
      ? '当前 HTML 成果是否需要补充更多页面状态？\n当前任务报告是否需要再确认一次重点摘要？'
      : '当前没有 HTML 成果，是否先补充一个可预览版本？',
    actionItems: report?.nextActionsAndFlowchart ?? '先补充或选择一个 HTML 成果，再进入报告页继续整理。',
    flowchartNodes: hasAsset
      ? '整理任务上下文\n切换 HTML 成果预览\n生成当前任务报告\n人工确认整理结果'
      : '整理任务上下文\n补充 HTML 成果\n生成当前任务报告'
  };
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

function splitLines(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function TaskModal({ title, children, onClose, onSave, saveLabel }) {
  return (
    <div className="task-overlay" role="presentation" onClick={onClose}>
      <div className="task-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="task-modal__head">
          <h2>{title}</h2>
          <button className="soft-btn task-mini-btn" type="button" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="task-modal__body">{children}</div>
        <div className="task-modal__actions">
          <button className="outline-btn" type="button" onClick={onClose}>
            取消
          </button>
          <button className="primary-btn" type="button" onClick={onSave}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TaskPage({ taskId }) {
  const safeTaskId = taskId?.trim() || DEFAULT_TASK_ID;
  const tasks = useMemo(() => getTasks(), []);
  const hasCurrentTask = tasks.some((item) => item.id === safeTaskId);
  const task = hasCurrentTask ? getTaskById(safeTaskId) : null;
  const context = task ? getTaskContext(task.id) : null;
  const report = task ? getTaskReport(task.id) : null;
  const assets = task ? getHtmlAssetsByTaskId(task.id) ?? [] : [];
  const reportSections = buildReportSections(report);

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id ?? '');
  const [htmlDraft, setHtmlDraft] = useState(assets[0]?.htmlContent ?? '');
  const [previewMode, setPreviewMode] = useState(assets[0] ? 'asset' : 'draft');
  const [taskInfoDraft, setTaskInfoDraft] = useState(() => buildTaskInfoDraft(task, assets, report));
  const [contextDraft, setContextDraft] = useState(() => buildContextDraft(context));
  const [organizeDraft, setOrganizeDraft] = useState(() => buildOrganizeDraft(context, report, assets));
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isOrganizeOpen, setIsOrganizeOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setActiveTab(TABS[0].key);
    setSelectedAssetId(assets[0]?.id ?? '');
    setHtmlDraft(assets[0]?.htmlContent ?? '');
    setPreviewMode(assets[0] ? 'asset' : 'draft');
    setTaskInfoDraft(buildTaskInfoDraft(task, assets, report));
    setContextDraft(buildContextDraft(context));
    setOrganizeDraft(buildOrganizeDraft(context, report, assets));
    setIsTaskInfoOpen(false);
    setIsContextOpen(false);
    setIsOrganizeOpen(false);
    setIsFullscreen(false);
  }, [safeTaskId]);

  if (!hasCurrentTask || !task) {
    return (
      <section className="page-card hero-panel">
        <div>
          <h1>任务区</h1>
          <p>{EMPTY_TASK_MESSAGE}</p>
        </div>
        <div className="hero-actions">
          <a className="primary-btn" href="/">
            返回首页
          </a>
        </div>
      </section>
    );
  }

  const selectedAsset = assets.find((item) => item.id === selectedAssetId) ?? assets[0] ?? null;
  const previewLabel = previewMode === 'draft' ? '临时预览' : selectedAsset?.name ?? 'HTML 预览';
  const previewHtml =
    previewMode === 'draft'
      ? htmlDraft.trim() || DEFAULT_PREVIEW_HTML
      : selectedAsset?.htmlContent ?? (htmlDraft.trim() || DEFAULT_PREVIEW_HTML);

  function handlePreviewDraft() {
    setPreviewMode('draft');
  }

  function handleSelectAsset(assetId) {
    setSelectedAssetId(assetId);
    setPreviewMode('asset');
  }

  function handleSaveCurrent() {
    setTaskInfoDraft((prev) => ({ ...prev, updatedAt: nowLabel() }));
  }

  function handleGenerateReport() {
    setTaskInfoDraft((prev) => ({
      ...prev,
      updatedAt: nowLabel(),
      reportVersion: prev.reportVersion === '未生成' ? '当前任务报告 V1' : prev.reportVersion
    }));
    setActiveTab('report');
  }

  function handleSaveTaskInfo() {
    setTaskInfoDraft((prev) => ({ ...prev, updatedAt: nowLabel() }));
    setIsTaskInfoOpen(false);
  }

  function handleSaveContext() {
    setIsContextOpen(false);
  }

  function handleSaveOrganize() {
    setIsOrganizeOpen(false);
  }

  return (
    <>
      <section className="page-card hero-panel task-head-card">
        <div className="task-head-card__main">
          <div className="task-head-card__meta">
            <a className="link" href="/">
              返回首页
            </a>
            <span className="tag blue">{taskInfoDraft.status}</span>
          </div>
          <h1>{taskInfoDraft.title}</h1>
        </div>

        <div className="task-head-tabs" role="tablist" aria-label="任务区视图切换">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'task-head-tab active' : 'task-head-tab'}
              type="button"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hero-actions task-head-card__actions">
          <button className="outline-btn task-mini-btn" type="button" onClick={() => setIsTaskInfoOpen(true)}>
            任务信息
          </button>
          <button className="outline-btn task-mini-btn" type="button" onClick={handleSaveCurrent}>
            保存当前
          </button>
          <button className="primary-btn task-mini-btn task-mini-btn--primary" type="button" onClick={handleGenerateReport}>
            生成任务报告
          </button>
          <button className="soft-btn task-mini-btn" type="button">
            更多
          </button>
        </div>
      </section>

      {activeTab === 'work' && (
        <section className="task-workspace-shell">
          <aside className="card task-workspace-shell__side">
            <div className="card-head task-material-head">
              <h2>任务素材</h2>
              <button className="soft-btn task-micro-btn" type="button" onClick={() => setIsContextOpen(true)}>
                任务上下文
              </button>
            </div>
            <div className="card-body list-stack">
              <div className="list-item">
                <b>HTML 粘贴入口</b>
                <textarea
                  className="task-lite-textarea"
                  value={htmlDraft}
                  placeholder="粘贴 HTML 代码后，可做临时预览。"
                  onChange={(event) => setHtmlDraft(event.target.value)}
                />
                <div className="task-inline-actions">
                  <button className="soft-btn task-micro-btn" type="button" onClick={handlePreviewDraft}>
                    临时预览
                  </button>
                </div>
              </div>

              <div className="list-item">
                <b>HTML 成果列表</b>
                {assets.length > 0 ? (
                  <div className="task-asset-lines">
                    {assets.map((asset) => (
                      <button
                        key={asset.id}
                        className={asset.id === selectedAsset?.id && previewMode === 'asset' ? 'task-asset-line active' : 'task-asset-line'}
                        type="button"
                        onClick={() => handleSelectAsset(asset.id)}
                      >
                        {asset.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <small>当前没有 HTML 成果。</small>
                )}
              </div>
            </div>
          </aside>

          <main className="card task-preview-panel">
            <div className="card-head task-preview-panel__head">
              <div>
                <h2>HTML 原型预览</h2>
                <small>{previewLabel}</small>
              </div>
              <div className="task-inline-actions">
                <button className="outline-btn task-micro-btn" type="button" onClick={() => setIsOrganizeOpen(true)}>
                  当前整理
                </button>
                <button className="soft-btn task-micro-btn" type="button" onClick={() => setIsFullscreen(true)}>
                  全屏预览
                </button>
              </div>
            </div>
            <div className="card-body task-preview-panel__body">
              <div className="preview-frame task-preview-surface" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </main>
        </section>
      )}

      {activeTab === 'report' && (
        <section className="card task-detail-panel">
          <div className="card-head">
            <h2>当前任务报告</h2>
          </div>
          <div className="card-body list-stack">
            {reportSections.length > 0 ? (
              reportSections.map((section) => (
                <div className="list-item" key={section.label}>
                  <b>{section.label}</b>
                  <small>{section.value ?? '暂无内容'}</small>
                </div>
              ))
            ) : (
              <div className="preview-frame">当前还没有任务报告，请先返回工作视图整理任务内容。</div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'flow' && (
        <section className="card task-detail-panel">
          <div className="card-head">
            <h2>流程图</h2>
          </div>
          <div className="card-body">
            <div className="preview-frame">{report?.nextActionsAndFlowchart ?? '流程图数据暂未生成，后续可继续补充。'}</div>
          </div>
        </section>
      )}

      {activeTab === 'skill' && (
        <section className="card task-detail-panel">
          <div className="card-head">
            <h2>Skill 化</h2>
          </div>
          <div className="card-body">
            <div className="preview-frame">{report?.currentConclusion ?? 'Skill 化内容暂未生成，后续可基于当前任务报告继续沉淀。'}</div>
          </div>
        </section>
      )}

      {isTaskInfoOpen && (
        <TaskModal title="任务信息" onClose={() => setIsTaskInfoOpen(false)} onSave={handleSaveTaskInfo} saveLabel="保存信息">
          <div className="task-form-grid">
            <label className="task-field">
              <span>任务标题</span>
              <input
                value={taskInfoDraft.title}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, title: event.target.value }))}
              />
            </label>
            <label className="task-field">
              <span>任务状态</span>
              <input
                value={taskInfoDraft.status}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, status: event.target.value }))}
              />
            </label>
            <label className="task-field">
              <span>创建时间</span>
              <input
                value={taskInfoDraft.createdAt}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, createdAt: event.target.value }))}
              />
            </label>
            <label className="task-field">
              <span>更新时间</span>
              <input
                value={taskInfoDraft.updatedAt}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, updatedAt: event.target.value }))}
              />
            </label>
            <label className="task-field">
              <span>HTML 成果数</span>
              <input
                value={taskInfoDraft.htmlAssetCount}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, htmlAssetCount: event.target.value }))}
              />
            </label>
            <label className="task-field">
              <span>报告版本</span>
              <input
                value={taskInfoDraft.reportVersion}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, reportVersion: event.target.value }))}
              />
            </label>
            <label className="task-field task-field--full">
              <span>任务备注</span>
              <textarea
                value={taskInfoDraft.notes}
                onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, notes: event.target.value }))}
              />
            </label>
          </div>
        </TaskModal>
      )}

      {isContextOpen && (
        <TaskModal title="任务上下文" onClose={() => setIsContextOpen(false)} onSave={handleSaveContext} saveLabel="保存上下文">
          <div className="task-form-grid">
            <label className="task-field task-field--full">
              <span>任务目标</span>
              <textarea
                value={contextDraft.goal}
                onChange={(event) => setContextDraft((prev) => ({ ...prev, goal: event.target.value }))}
              />
            </label>
            <label className="task-field task-field--full">
              <span>背景资料</span>
              <textarea
                value={contextDraft.background}
                onChange={(event) => setContextDraft((prev) => ({ ...prev, background: event.target.value }))}
              />
            </label>
            <label className="task-field task-field--full">
              <span>约束条件</span>
              <textarea
                value={contextDraft.constraints}
                onChange={(event) => setContextDraft((prev) => ({ ...prev, constraints: event.target.value }))}
              />
            </label>
            <label className="task-field task-field--full">
              <span>判断标准</span>
              <textarea
                value={contextDraft.criteria}
                onChange={(event) => setContextDraft((prev) => ({ ...prev, criteria: event.target.value }))}
              />
            </label>
          </div>
        </TaskModal>
      )}

      {isOrganizeOpen && (
        <div className="task-drawer-wrap" role="presentation" onClick={() => setIsOrganizeOpen(false)}>
          <aside className="task-drawer" role="dialog" aria-modal="true" aria-label="当前整理" onClick={(event) => event.stopPropagation()}>
            <div className="task-drawer__head">
              <h2>当前整理</h2>
              <button className="soft-btn task-mini-btn" type="button" onClick={() => setIsOrganizeOpen(false)}>
                关闭
              </button>
            </div>
            <div className="task-drawer__body">
              <label className="task-field task-field--full">
                <span>当前结论</span>
                <textarea
                  value={organizeDraft.currentConclusion}
                  onChange={(event) => setOrganizeDraft((prev) => ({ ...prev, currentConclusion: event.target.value }))}
                />
              </label>
              <label className="task-field task-field--full">
                <span>关键依据</span>
                <textarea
                  value={organizeDraft.keyBasis}
                  onChange={(event) => setOrganizeDraft((prev) => ({ ...prev, keyBasis: event.target.value }))}
                />
              </label>
              <label className="task-field task-field--full">
                <span>待确认问题</span>
                <textarea
                  value={organizeDraft.pendingQuestions}
                  onChange={(event) => setOrganizeDraft((prev) => ({ ...prev, pendingQuestions: event.target.value }))}
                />
              </label>
              <label className="task-field task-field--full">
                <span>行动项</span>
                <textarea
                  value={organizeDraft.actionItems}
                  onChange={(event) => setOrganizeDraft((prev) => ({ ...prev, actionItems: event.target.value }))}
                />
              </label>
              <label className="task-field task-field--full">
                <span>流程图节点</span>
                <textarea
                  value={organizeDraft.flowchartNodes}
                  onChange={(event) => setOrganizeDraft((prev) => ({ ...prev, flowchartNodes: event.target.value }))}
                />
              </label>

              <div className="task-drawer__chips">
                {splitLines(organizeDraft.flowchartNodes).map((item) => (
                  <span className="tag blue" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="task-drawer__actions">
              <button className="outline-btn" type="button" onClick={() => setIsOrganizeOpen(false)}>
                取消
              </button>
              <button className="primary-btn" type="button" onClick={handleSaveOrganize}>
                保存整理
              </button>
            </div>
          </aside>
        </div>
      )}

      {isFullscreen && (
        <div className="task-overlay task-overlay--dark" role="presentation" onClick={() => setIsFullscreen(false)}>
          <div className="task-fullscreen" role="dialog" aria-modal="true" aria-label="HTML 原型预览" onClick={(event) => event.stopPropagation()}>
            <div className="task-fullscreen__head">
              <h2>HTML 原型预览</h2>
              <button className="outline-btn task-mini-btn" type="button" onClick={() => setIsFullscreen(false)}>
                退出全屏
              </button>
            </div>
            <div className="task-fullscreen__body">
              <div className="preview-frame task-preview-surface task-preview-surface--fullscreen" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
