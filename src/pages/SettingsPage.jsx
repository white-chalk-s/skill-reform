import { useState } from 'react';
import { getSettings, getSettingsPageMeta } from '../services/settingsService.js';
import { getTemplatesByType } from '../services/templateService.js';

export function SettingsPage() {
  const settings = getSettings();
  const pageMeta = getSettingsPageMeta();
  const [activeId, setActiveId] = useState(pageMeta.sections[0].id);
  const reportTemplates = getTemplatesByType('report');
  const skillTemplates = getTemplatesByType('skill');
  const aiInputTemplate = getTemplatesByType('ai_input')[0];
  const aiOutputTemplate = getTemplatesByType('ai_output')[0];

  function scrollToSection(id) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <section className="page-card hero-panel">
        <div>
          <h1>设置：定义模板、AI 回传规则和本地保存路径</h1>
          <p>这里是平台的规则中枢。通过固定模板约束 AI 输出，管理本地数据路径和备份策略。</p>
        </div>
        <div className="hero-actions">
          <button className="ghost-btn">导入配置</button>
          <button className="outline-btn">导出配置</button>
          <button className="primary-btn">保存全部设置</button>
        </div>
      </section>

      <section className="three-column-layout">
        <aside className="card">
          <div className="card-head"><h2>设置导航</h2></div>
          <div className="card-body">
            {pageMeta.sections.map((section) => (
              <button key={section.id} className={activeId === section.id ? 'setting-nav-item active' : 'setting-nav-item'} onClick={() => scrollToSection(section.id)}>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="panel-scroll">
          <section className="card setting-section" id="report">
            <div className="card-head"><h2>当前任务报告模板</h2><span className="tag blue">默认启用</span></div>
            <div className="card-body list-stack">
              {reportTemplates.map((item) => <TemplateItem key={item.id} item={item} />)}
            </div>
          </section>

          <section className="card setting-section" id="organize">
            <div className="card-head"><h2>当前整理模板</h2><span className="tag purple">右侧面板字段</span></div>
            <div className="card-body"><div className="template-item">{pageMeta.organizeFieldSummary}</div></div>
          </section>

          <section className="card setting-section" id="skill">
            <div className="card-head"><h2>Skill 生成模板</h2><span className="tag green">方法沉淀核心</span></div>
            <div className="card-body list-stack">
              {skillTemplates.map((item) => <TemplateItem key={item.id} item={item} />)}
            </div>
          </section>

          <section className="card setting-section" id="ai">
            <div className="card-head"><h2>本地 AI 输入/回传模板</h2><span className="tag blue">JSON</span></div>
            <div className="card-body list-stack">
              <pre className="code-box">{aiInputTemplate?.promptText}</pre>
              <pre className="code-box">{aiOutputTemplate?.promptText}</pre>
            </div>
          </section>

          <section className="card setting-section" id="path">
            <div className="card-head"><h2>备份与保存路径</h2><span className="tag green">本地优先</span></div>
            <div className="card-body list-stack">
              <div className="path-item"><b>SQLite 数据库</b><small>{settings.databasePath}</small></div>
              <div className="path-item"><b>HTML 成果目录</b><small>{settings.htmlAssetsPath}</small></div>
              <div className="path-item"><b>导出文件目录</b><small>{settings.exportPath}</small></div>
              <div className="path-item"><b>自动备份目录</b><small>{settings.backupPath}</small></div>
            </div>
          </section>

          <section className="card setting-section" id="export">
            <div className="card-head"><h2>数据导入导出</h2><span className="tag orange">归档恢复</span></div>
            <div className="card-body">{pageMeta.exportSummary}</div>
          </section>
        </main>

        <aside className="card">
          <div className="card-head"><h2>设置说明</h2></div>
          <div className="card-body list-stack">
            <div className="list-item"><b>关键原则</b><small>{pageMeta.principleSummary}</small></div>
            <div className="list-item"><b>开关控制</b><small>{pageMeta.toggleSummary}</small></div>
          </div>
        </aside>
      </section>
    </>
  );
}

function TemplateItem({ item }) {
  return (
    <div className="template-item">
      <b>{item.name}</b>
      <small>{item.type} · {item.version}</small>
    </div>
  );
}
