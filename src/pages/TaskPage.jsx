import { useState } from 'react';
import { getHtmlAssetsByTaskId, getTaskById, getTaskContext, getTaskReport } from '../services/taskService.js';

const tabs = ['工作视图', '当前任务报告', '流程图', 'Skill 化'];

export function TaskPage({ taskId }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const task = getTaskById(taskId);
  const context = getTaskContext(task.id);
  const report = getTaskReport(task.id);
  const assets = getHtmlAssetsByTaskId(task.id);
  const primaryAsset = assets[0] ?? null;

  const reportSections = report
    ? [
        { label: '任务概述', value: report.overview },
        { label: '上下文依据', value: report.contextBasis },
        { label: 'HTML 成果说明', value: report.htmlAssetsSummary },
        { label: '当前结论', value: report.currentConclusion },
        { label: '风险边界', value: report.riskBoundary },
        { label: '后续行动与流程图建议', value: report.nextActionsAndFlowchart }
      ]
    : [];

  return (
    <>
      <section className="page-card hero-panel">
        <div>
          <h1>任务标题：{task.title}</h1>
          <p>{task.status} · 创建时间：{task.createdAt} · 最后更新：{task.updatedAt}</p>
        </div>
        <div className="hero-actions">
          <button className="outline-btn">导出任务区</button>
          <button className="soft-btn">复制报告输入</button>
          <button className="primary-btn">生成当前任务报告</button>
        </div>
      </section>

      <section className="page-card task-tabs">
        <div className="tabs">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <span className="tag blue">当前使用 mock 数据</span>
      </section>

      <section className="workspace-layout">
        <aside className="card">
          <div className="card-head"><h2>任务素材</h2></div>
          <div className="card-body list-stack">
            <div className="list-item"><b>目标</b><small>{context?.goal}</small></div>
            <div className="list-item"><b>背景</b><small>{context?.background}</small></div>
            <div className="list-item"><b>HTML 粘贴入口</b><small>{primaryAsset?.name}</small></div>
          </div>
        </aside>

        <main className="card">
          <div className="card-head"><h2>{activeTab}</h2></div>
          <div className="card-body">
            {activeTab === '工作视图' && <div className="preview-frame" dangerouslySetInnerHTML={{ __html: primaryAsset?.htmlContent ?? '' }} />}
            {activeTab === '当前任务报告' && (
              <div className="list-stack">
                {reportSections.map((section) => (
                  <div className="list-item" key={section.label}>
                    <b>{section.label}</b>
                    <small>{section.value}</small>
                  </div>
                ))}
              </div>
            )}
            {activeTab === '流程图' && <div className="preview-frame">流程图节点预览占位，后续阶段再接复杂流程图数据。</div>}
            {activeTab === 'Skill 化' && <div className="preview-frame">从当前任务报告与流程图生成 Skill 草稿的占位视图。</div>}
          </div>
        </main>

        <aside className="card">
          <div className="card-head"><h2>当前整理</h2></div>
          <div className="card-body list-stack">
            <div className="list-item"><b>当前结论</b><small>{report?.currentConclusion}</small></div>
            <div className="list-item"><b>关键依据</b><small>{context?.constraints}</small></div>
            <div className="list-item"><b>行动项</b><small>{report?.nextActionsAndFlowchart}</small></div>
          </div>
        </aside>
      </section>
    </>
  );
}
