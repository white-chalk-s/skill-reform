import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  createHtmlAsset,
  deleteHtmlAsset,
  getHtmlAssetsByTaskId,
  getTaskById,
  getTaskContext,
  getTasks,
  saveTaskContext,
  updateHtmlAsset,
  updateTask
} from '../services/taskService.js';

const DEFAULT_TASK_ID = 'demo-task';
const EMPTY_TASK_MESSAGE = '未找到当前任务，请返回首页重新选择任务。';
const TABS = [
  { key: 'work', label: '工作视图' },
  { key: 'flow', label: '流程图' },
  { key: 'skill', label: 'Skill 化' }
];

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

function buildTaskInfoDraft(task, assets) {
  return {
    title: task?.title ?? '未命名任务',
    status: task?.status ?? '进行中',
    createdAt: task?.createdAt ?? '--',
    updatedAt: task?.updatedAt ?? '--',
    htmlAssetCount: String(assets.length),
    reportVersion: '未启用',
    notes: task?.notes ?? ''
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

function buildOrganizeDraft(task, context, assets) {
  const assetNames = assets.map((item) => item.name).filter(Boolean);

  return {
    currentConclusion:
      assetNames.length > 0
        ? `当前任务已保存 ${assetNames.length} 个 HTML 成果，可继续围绕「${task?.title ?? '当前任务'}」整理。`
        : '当前任务还没有已保存的 HTML 成果，建议先完成上下文整理和首个预览版本保存。',
    keyBasis: [context?.goal, context?.constraints].filter(Boolean).join('\n') || '当前还没有补充任务上下文。',
    pendingQuestions:
      assetNames.length > 0
        ? '是否需要继续补充更多页面状态？\n是否需要统一 HTML 成果命名方式？'
        : '当前首个 HTML 成果是否已经达到可保存状态？',
    actionItems:
      assetNames.length > 0
        ? '回看任务上下文\n补充 HTML 细节\n保存更多成果版本'
        : '编辑任务上下文\n粘贴 HTML\n临时预览并保存成果',
    flowchartNodes:
      assetNames.length > 0
        ? '编辑任务上下文\n临时预览 HTML\n保存 HTML 成果\n切换成果预览'
        : '编辑任务上下文\n粘贴 HTML\n临时预览'
  };
}

function buildPreviewSrcDoc(source) {
  const hasContent = source.trim().length > 0;
  const body = hasContent
    ? source
    : `
      <div style="min-height:100vh;display:grid;place-items:center;padding:32px;color:#64748b;font:14px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;">
        暂无 HTML 预览。
      </div>
    `;

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: light;
      }
      html, body {
        margin: 0;
        min-height: 100%;
        background: #ffffff;
      }
      body {
        overflow: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      }
    </style>
  </head>
  <body>${body}</body>
</html>`;
}

function clampZoom(value) {
  return Math.min(1.5, Math.max(0.5, value));
}

function formatZoom(value) {
  return `${Math.round(value * 100)}%`;
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

function ZoomControls({ zoom, onDecrease, onReset, onIncrease }) {
  return (
    <div className="task-zoom-control" role="group" aria-label="预览缩放控制">
      <button className="soft-btn task-micro-btn" type="button" onClick={onDecrease} aria-label="缩小预览">
        -
      </button>
      <button className="outline-btn task-micro-btn task-zoom-control__value" type="button" onClick={onReset} aria-label="重置缩放">
        {formatZoom(zoom)}
      </button>
      <button className="soft-btn task-micro-btn" type="button" onClick={onIncrease} aria-label="放大预览">
        +
      </button>
    </div>
  );
}

function PreviewFrame({ html, title, zoom, fullscreen = false }) {
  const frameHeight = fullscreen ? 'calc(100dvh - 84px)' : 'calc(100vh - 250px)';

  return (
    <div className="task-preview-stage">
      <div className="task-preview-canvas">
        <iframe
          className="task-preview-iframe"
          sandbox="allow-same-origin"
          srcDoc={buildPreviewSrcDoc(html)}
          title={title}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: '100%',
            height: frameHeight,
            minHeight: frameHeight
          }}
        />
      </div>
    </div>
  );
}

function FullscreenPreview({ html, title, zoom, onDecreaseZoom, onResetZoom, onIncreaseZoom, onClose }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="task-fullscreen-overlay" role="presentation" onClick={onClose}>
      <div className="task-fullscreen-panel" role="dialog" aria-modal="true" aria-label="HTML 原型预览" onClick={(event) => event.stopPropagation()}>
        <div className="task-fullscreen-panel__head">
          <div className="task-fullscreen-panel__headline">
            <h2>HTML 原型预览</h2>
            <span className="task-fullscreen-panel__meta">当前成果：{title}</span>
          </div>
          <ZoomControls zoom={zoom} onDecrease={onDecreaseZoom} onReset={onResetZoom} onIncrease={onIncreaseZoom} />
          <button className="outline-btn task-mini-btn" type="button" onClick={onClose}>
            退出全屏
          </button>
        </div>
        <div className="task-fullscreen-panel__body">
          <PreviewFrame html={html} title="HTML 原型预览全屏" zoom={zoom} fullscreen />
        </div>
      </div>
    </div>,
    document.body
  );
}

function AiOrganizeDrawer({ open, draft, onClose, onChange, onRegenerate, onSave }) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="task-drawer-wrap" role="presentation" onClick={onClose}>
      <aside className="task-drawer" role="dialog" aria-modal="true" aria-label="AI 整理草稿" onClick={(event) => event.stopPropagation()}>
        <div className="task-drawer__header">
          <div className="task-drawer__title">
            <h2>AI 整理草稿</h2>
            <p>基于任务上下文、HTML 成果和操作过程生成结构化整理；当前阶段支持手动编辑保存。</p>
          </div>
          <button className="soft-btn task-mini-btn" type="button" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="task-drawer__body">
          <label className="task-field task-field--full">
            <span>当前结论</span>
            <textarea value={draft.currentConclusion} onChange={(event) => onChange('currentConclusion', event.target.value)} />
          </label>
          <label className="task-field task-field--full">
            <span>关键依据</span>
            <textarea value={draft.keyBasis} onChange={(event) => onChange('keyBasis', event.target.value)} />
          </label>
          <label className="task-field task-field--full">
            <span>待确认问题</span>
            <textarea value={draft.pendingQuestions} onChange={(event) => onChange('pendingQuestions', event.target.value)} />
          </label>
          <label className="task-field task-field--full">
            <span>行动项</span>
            <textarea value={draft.actionItems} onChange={(event) => onChange('actionItems', event.target.value)} />
          </label>
          <label className="task-field task-field--full">
            <span>流程图节点</span>
            <textarea value={draft.flowchartNodes} onChange={(event) => onChange('flowchartNodes', event.target.value)} />
          </label>
        </div>
        <div className="task-drawer__footer">
          <button className="outline-btn" type="button" onClick={onRegenerate}>
            重新生成整理
          </button>
          <button className="primary-btn" type="button" onClick={onSave}>
            保存整理
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}

export function TaskPage({ taskId }) {
  const safeTaskId = taskId?.trim() || DEFAULT_TASK_ID;
  const task = getTaskById(safeTaskId);
  const hasCurrentTask = useMemo(() => getTasks().some((item) => item.id === safeTaskId) || Boolean(task), [safeTaskId, task]);

  const initialContext = task ? getTaskContext(task.id) : null;
  const initialAssets = task ? getHtmlAssetsByTaskId(task.id) : [];

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssets[0]?.id ?? '');
  const [htmlDraft, setHtmlDraft] = useState(initialAssets[0]?.htmlContent ?? '');
  const [previewMode, setPreviewMode] = useState(initialAssets[0] ? 'asset' : 'draft');
  const [taskInfoDraft, setTaskInfoDraft] = useState(() => buildTaskInfoDraft(task, initialAssets));
  const [contextDraft, setContextDraft] = useState(() => buildContextDraft(initialContext));
  const [organizeDraft, setOrganizeDraft] = useState(() => buildOrganizeDraft(task, initialContext, initialAssets));
  const [toast, setToast] = useState('');
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isOrganizeOpen, setIsOrganizeOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [assetMenuId, setAssetMenuId] = useState('');
  const [renameAssetId, setRenameAssetId] = useState('');
  const [renameAssetName, setRenameAssetName] = useState('');
  const [deleteAssetId, setDeleteAssetId] = useState('');

  useEffect(() => {
    const nextTask = getTaskById(safeTaskId);
    const nextContext = nextTask ? getTaskContext(nextTask.id) : null;
    const nextAssets = nextTask ? getHtmlAssetsByTaskId(nextTask.id) : [];

    setActiveTab(TABS[0].key);
    setAssets(nextAssets);
    setSelectedAssetId(nextAssets[0]?.id ?? '');
    setHtmlDraft(nextAssets[0]?.htmlContent ?? '');
    setPreviewMode(nextAssets[0] ? 'asset' : 'draft');
    setTaskInfoDraft(buildTaskInfoDraft(nextTask, nextAssets));
    setContextDraft(buildContextDraft(nextContext));
    setOrganizeDraft(buildOrganizeDraft(nextTask, nextContext, nextAssets));
    setToast('');
    setIsTaskInfoOpen(false);
    setIsContextOpen(false);
    setIsOrganizeOpen(false);
    setIsFullscreen(false);
    setPreviewZoom(1);
    setAssetMenuId('');
    setRenameAssetId('');
    setRenameAssetName('');
    setDeleteAssetId('');
  }, [safeTaskId]);

  useEffect(() => {
    if (!isFullscreen || typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!assetMenuId || typeof document === 'undefined') return undefined;

    const handleDocumentClick = (event) => {
      if (event.target instanceof Element && event.target.closest('.task-asset-row')) return;
      setAssetMenuId('');
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [assetMenuId]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2000);
    return () => window.clearTimeout(timer);
  }, [toast]);

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
  const previewLabel =
    previewMode === 'draft'
      ? htmlDraft.trim()
        ? '临时预览'
        : '暂无 HTML 预览'
      : selectedAsset?.name ?? 'HTML 预览';
  const previewHtml = previewMode === 'draft' ? htmlDraft : selectedAsset?.htmlContent ?? htmlDraft;

  function refreshTaskState(nextTask = task, nextContext = getTaskContext(task.id), nextAssets = getHtmlAssetsByTaskId(task.id)) {
    setAssets(nextAssets);
    setTaskInfoDraft(buildTaskInfoDraft(nextTask, nextAssets));
    setContextDraft(buildContextDraft(nextContext));
    setOrganizeDraft(buildOrganizeDraft(nextTask, nextContext, nextAssets));
  }

  function handlePreviewDraft() {
    setAssetMenuId('');
    setPreviewMode('draft');
  }

  function handleSelectAsset(assetId) {
    setAssetMenuId('');
    setSelectedAssetId(assetId);
    setPreviewMode('asset');
  }

  function handleSaveCurrent() {
    const savedTask = updateTask(task.id, {
      title: taskInfoDraft.title,
      status: taskInfoDraft.status,
      createdAt: taskInfoDraft.createdAt,
      notes: taskInfoDraft.notes
    });

    if (!savedTask) return;

    refreshTaskState(savedTask);
    setToast('已保存');
  }

  function handleSaveTaskInfo() {
    handleSaveCurrent();
    setIsTaskInfoOpen(false);
  }

  function handleSaveContext() {
    const savedContext = saveTaskContext(task.id, contextDraft);
    const savedTask = getTaskById(task.id);
    const nextAssets = getHtmlAssetsByTaskId(task.id);

    if (savedContext && savedTask) {
      refreshTaskState(savedTask, savedContext, nextAssets);
      setToast('已保存');
    }

    setIsContextOpen(false);
  }

  function handleSaveAsset() {
    setAssetMenuId('');
    const savedAsset = createHtmlAsset(task.id, { htmlContent: htmlDraft });
    const savedTask = getTaskById(task.id);
    const nextAssets = getHtmlAssetsByTaskId(task.id);
    const nextContext = getTaskContext(task.id);

    if (!savedAsset || !savedTask) return;

    refreshTaskState(savedTask, nextContext, nextAssets);
    setSelectedAssetId(savedAsset.id);
    setPreviewMode('asset');
    setToast('HTML 成果已保存');
  }

  function handleStartRenameAsset(asset) {
    setAssetMenuId('');
    setRenameAssetId(asset.id);
    setRenameAssetName(asset.name);
  }

  function handleConfirmRenameAsset() {
    if (!renameAssetId) return;

    const renamedAsset = updateHtmlAsset(task.id, renameAssetId, { name: renameAssetName });
    const nextAssets = getHtmlAssetsByTaskId(task.id);
    const nextTask = getTaskById(task.id);
    const nextContext = getTaskContext(task.id);

    if (!renamedAsset || !nextTask) return;

    refreshTaskState(nextTask, nextContext, nextAssets);
    setSelectedAssetId(renamedAsset.id);
    setPreviewMode('asset');
    setRenameAssetId('');
    setRenameAssetName('');
    setToast('成果名称已更新');
  }

  function handleCopyAssetHtml(asset) {
    setAssetMenuId('');

    const writeClipboard = navigator?.clipboard?.writeText?.bind(navigator.clipboard);
    if (!writeClipboard) {
      setToast('复制失败，请手动复制');
      return;
    }

    writeClipboard(asset.htmlContent)
      .then(() => {
        setToast('HTML 已复制');
      })
      .catch(() => {
        setToast('复制失败，请手动复制');
      });
  }

  function handleAskDeleteAsset(asset) {
    setAssetMenuId('');
    setDeleteAssetId(asset.id);
  }

  function handleConfirmDeleteAsset() {
    if (!deleteAssetId) return;

    const currentIndex = assets.findIndex((item) => item.id === deleteAssetId);
    const deletedAsset = deleteHtmlAsset(task.id, deleteAssetId);
    const nextAssets = getHtmlAssetsByTaskId(task.id);
    const nextTask = getTaskById(task.id);
    const nextContext = getTaskContext(task.id);

    if (!deletedAsset || !nextTask) return;

    refreshTaskState(nextTask, nextContext, nextAssets);

    if (nextAssets.length > 0) {
      const nextSelected = nextAssets[Math.min(currentIndex, nextAssets.length - 1)] ?? nextAssets[nextAssets.length - 1];
      setSelectedAssetId(nextSelected.id);
      setPreviewMode('asset');
    } else {
      setSelectedAssetId('');
      setPreviewMode('draft');
    }

    setDeleteAssetId('');
    setToast('HTML 成果已删除');
  }

  function handleSaveOrganize() {
    setToast('整理已保存');
    setIsOrganizeOpen(false);
  }

  function handleRegenerateOrganize() {
    const nextTask = getTaskById(task.id);
    const nextContext = getTaskContext(task.id);
    const nextAssets = getHtmlAssetsByTaskId(task.id);

    setOrganizeDraft(buildOrganizeDraft(nextTask, nextContext, nextAssets));
    setToast('AI 整理能力后续接入');
  }

  function handleZoomIn() {
    setPreviewZoom((value) => clampZoom(Number((value + 0.1).toFixed(2))));
  }

  function handleZoomOut() {
    setPreviewZoom((value) => clampZoom(Number((value - 0.1).toFixed(2))));
  }

  function handleZoomReset() {
    setPreviewZoom(1);
  }

  function handleOrganizeDraftChange(field, value) {
    setOrganizeDraft((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <section className="task-page-shell">
        <section className="task-workbench">
          <header className="task-workbench-header task-head-card">
            <div className="task-head-card__left">
              <div className="task-head-card__meta">
                <a className="link" href="/">
                  返回首页
                </a>
                <span className="tag blue">{taskInfoDraft.status}</span>
              </div>
              <h1>{taskInfoDraft.title}</h1>
            </div>

            <div className="task-head-tabs task-head-card__center" role="tablist" aria-label="任务视图切换">
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

            <div className="hero-actions task-head-card__actions task-head-card__right">
              <button className="outline-btn task-mini-btn" type="button" onClick={() => setIsTaskInfoOpen(true)}>
                任务信息
              </button>
              <button className="outline-btn task-mini-btn" type="button" onClick={handleSaveCurrent}>
                保存当前
              </button>
              <button className="soft-btn task-mini-btn" type="button">
                更多
              </button>
            </div>
          </header>

          {activeTab === 'work' && (
            <section className="task-workbench-body task-workspace-shell">
              <aside className="task-workspace-shell__side task-workbench__side">
                <div className="card-head task-material-head">
                  <h2>任务素材</h2>
                  <button className="soft-btn task-micro-btn" type="button" onClick={() => setIsContextOpen(true)}>
                    任务上下文
                  </button>
                </div>
                <div className="card-body task-material-body list-stack">
                  <div className="list-item">
                    <b>HTML 粘贴入口</b>
                    <textarea
                      className="task-lite-textarea"
                      value={htmlDraft}
                      placeholder="粘贴 HTML 代码后，可以先做临时预览。"
                      onChange={(event) => setHtmlDraft(event.target.value)}
                    />
                    <div className="task-inline-actions">
                      <button className="soft-btn task-micro-btn" type="button" onClick={handlePreviewDraft}>
                        临时预览
                      </button>
                      <button className="outline-btn task-micro-btn" type="button" onClick={handleSaveAsset}>
                        保存成果
                      </button>
                    </div>
                  </div>

                  <div className="list-item task-asset-list-panel">
                    <div className="task-asset-list-panel__head">
                      <b>HTML 成果列表</b>
                      <small>共 {assets.length} 个</small>
                    </div>
                    {assets.length > 0 ? (
                      <div className="task-asset-list" onClick={() => setAssetMenuId('')}>
                        {assets.map((asset) => {
                          const isActive = asset.id === selectedAsset?.id && previewMode === 'asset';
                          const isMenuOpen = assetMenuId === asset.id;

                          return (
                            <div key={asset.id} className={isActive ? 'task-asset-row active' : 'task-asset-row'}>
                              <button className="task-asset-row__main" type="button" onClick={() => handleSelectAsset(asset.id)}>
                                <span className="task-asset-row__title">{asset.name}</span>
                                <span className="task-asset-row__meta">{asset.updatedAt ? `更新于 ${asset.updatedAt}` : '刚刚更新'}</span>
                              </button>
                              <div className="task-asset-row__moreWrap">
                                <button
                                  className="soft-btn task-micro-btn task-asset-row__more"
                                  type="button"
                                  aria-haspopup="menu"
                                  aria-expanded={isMenuOpen}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setAssetMenuId((current) => (current === asset.id ? '' : asset.id));
                                  }}
                                  >
                                    ⋯
                                  </button>
                              </div>
                              {isMenuOpen ? (
                                <div className="task-asset-menu" role="menu" onClick={(event) => event.stopPropagation()}>
                                  <button className="task-asset-menu__item" type="button" onClick={() => handleStartRenameAsset(asset)}>
                                    重命名
                                  </button>
                                  <button className="task-asset-menu__item" type="button" onClick={() => handleCopyAssetHtml(asset)}>
                                    复制 HTML
                                  </button>
                                  <button className="task-asset-menu__item danger" type="button" onClick={() => handleAskDeleteAsset(asset)}>
                                    删除
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="task-asset-empty">
                        <span>暂无 HTML 成果</span>
                        <small>粘贴 HTML 后点击“保存成果”即可添加</small>
                      </div>
                    )}
                  </div>
                </div>
              </aside>

              <main className="task-preview-panel task-workbench__main">
                <div className="card-head task-preview-panel__head">
                  <div className="task-preview-panel__headline">
                    <h2>预览区</h2>
                    <span className="task-preview-panel__tag" title={`当前成果：${previewLabel}`}>
                      当前成果：{previewLabel}
                    </span>
                  </div>
                  <div className="task-inline-actions">
                    <ZoomControls zoom={previewZoom} onDecrease={handleZoomOut} onReset={handleZoomReset} onIncrease={handleZoomIn} />
                    <button className="outline-btn task-micro-btn" type="button" onClick={() => setIsOrganizeOpen(true)}>
                      AI 整理草稿
                    </button>
                    <button className="soft-btn task-micro-btn" type="button" onClick={() => setIsFullscreen(true)}>
                      全屏预览
                    </button>
                  </div>
                </div>
                <div className="card-body task-preview-panel__body">
                  <PreviewFrame html={previewHtml} title={previewLabel} zoom={previewZoom} />
                </div>
              </main>
            </section>
          )}

          {activeTab === 'flow' && (
            <section className="task-workbench-panel task-detail-panel">
              <div className="card-head">
                <h2>流程图</h2>
              </div>
              <div className="card-body">
                <div className="preview-frame">当前阶段暂停流程图能力，后续在 MVP 主链路稳定后再恢复。</div>
              </div>
            </section>
          )}

          {activeTab === 'skill' && (
            <section className="task-workbench-panel task-detail-panel">
              <div className="card-head">
                <h2>Skill 化</h2>
              </div>
              <div className="card-body">
                <div className="preview-frame">当前阶段暂停 Skill 化能力，后续再继续推进。</div>
              </div>
            </section>
          )}
        </section>
      </section>

      {isTaskInfoOpen && (
        <TaskModal title="任务信息" onClose={() => setIsTaskInfoOpen(false)} onSave={handleSaveTaskInfo} saveLabel="保存信息">
          <div className="task-form-grid">
            <label className="task-field">
              <span>任务标题</span>
              <input value={taskInfoDraft.title} onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, title: event.target.value }))} />
            </label>
            <label className="task-field">
              <span>任务状态</span>
              <input value={taskInfoDraft.status} onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, status: event.target.value }))} />
            </label>
            <label className="task-field">
              <span>创建时间</span>
              <input value={taskInfoDraft.createdAt} onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, createdAt: event.target.value }))} />
            </label>
            <label className="task-field">
              <span>更新时间</span>
              <input value={taskInfoDraft.updatedAt} readOnly />
            </label>
            <label className="task-field">
              <span>HTML 成果数</span>
              <input value={taskInfoDraft.htmlAssetCount} readOnly />
            </label>
            <label className="task-field">
              <span>报告版本</span>
              <input value={taskInfoDraft.reportVersion} readOnly />
            </label>
            <label className="task-field task-field--full">
              <span>任务备注</span>
              <textarea value={taskInfoDraft.notes} onChange={(event) => setTaskInfoDraft((prev) => ({ ...prev, notes: event.target.value }))} />
            </label>
          </div>
        </TaskModal>
      )}

      {isContextOpen && (
        <TaskModal title="任务上下文" onClose={() => setIsContextOpen(false)} onSave={handleSaveContext} saveLabel="保存上下文">
          <div className="task-form-grid">
            <label className="task-field task-field--full">
              <span>任务目标</span>
              <textarea value={contextDraft.goal} onChange={(event) => setContextDraft((prev) => ({ ...prev, goal: event.target.value }))} />
            </label>
            <label className="task-field task-field--full">
              <span>背景资料</span>
              <textarea value={contextDraft.background} onChange={(event) => setContextDraft((prev) => ({ ...prev, background: event.target.value }))} />
            </label>
            <label className="task-field task-field--full">
              <span>约束条件</span>
              <textarea value={contextDraft.constraints} onChange={(event) => setContextDraft((prev) => ({ ...prev, constraints: event.target.value }))} />
            </label>
            <label className="task-field task-field--full">
              <span>判断标准</span>
              <textarea value={contextDraft.criteria} onChange={(event) => setContextDraft((prev) => ({ ...prev, criteria: event.target.value }))} />
            </label>
          </div>
        </TaskModal>
      )}

      {renameAssetId ? (
        <TaskModal title="重命名 HTML 成果" onClose={() => setRenameAssetId('')} onSave={handleConfirmRenameAsset} saveLabel="保存名称">
          <label className="task-field task-field--full">
            <span>成果名称</span>
            <input value={renameAssetName} onChange={(event) => setRenameAssetName(event.target.value)} />
          </label>
        </TaskModal>
      ) : null}

      {deleteAssetId ? (
        <TaskModal title="确认删除 HTML 成果？" onClose={() => setDeleteAssetId('')} onSave={handleConfirmDeleteAsset} saveLabel="确认删除">
          <p className="task-confirm-text">删除后无法恢复，请确认是否删除当前成果。</p>
        </TaskModal>
      ) : null}

      <AiOrganizeDrawer
        open={isOrganizeOpen}
        draft={organizeDraft}
        onClose={() => setIsOrganizeOpen(false)}
        onChange={handleOrganizeDraftChange}
        onRegenerate={handleRegenerateOrganize}
        onSave={handleSaveOrganize}
      />

      {toast ? <div className="task-toast" role="status" aria-live="polite">{toast}</div> : null}
      {isFullscreen && (
        <FullscreenPreview
          html={previewHtml}
          title={previewLabel}
          zoom={previewZoom}
          onDecreaseZoom={handleZoomOut}
          onResetZoom={handleZoomReset}
          onIncreaseZoom={handleZoomIn}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
