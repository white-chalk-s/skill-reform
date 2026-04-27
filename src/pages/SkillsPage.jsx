import { useState } from 'react';
import { getSkillById, getSkillLibraryMeta, getSkills } from '../services/skillService.js';

export function SkillsPage() {
  const allSkills = getSkills();
  const libraryMeta = getSkillLibraryMeta();
  const [selectedId, setSelectedId] = useState(allSkills[0]?.id ?? '');
  const selected = getSkillById(selectedId);

  return (
    <>
      <section className="page-card hero-panel">
        <div>
          <h1>Skill 库：把任务方法沉淀成可复用流程</h1>
          <p>这里管理已经沉淀的方法流程。每个 Skill 都包含适用场景、输入材料、执行步骤、AI 分工、人工确认点和输出标准。</p>
        </div>
        <div className="hero-actions">
          <button className="ghost-btn">导入 Skill</button>
          <button className="outline-btn">从任务生成 Skill</button>
          <button className="primary-btn">新建 Skill</button>
        </div>
      </section>

      <section className="three-column-layout">
        <aside className="card">
          <div className="card-head"><h2>筛选与概览</h2></div>
          <div className="card-body list-stack">
            <div className="stat-grid">
              <div className="stat-card"><span>已沉淀 Skill</span><b>{allSkills.length}</b></div>
              <div className="stat-card"><span>本周调用</span><b>{libraryMeta.weeklyUsageCount}</b></div>
            </div>
            <div className="list-item"><b>全部 Skill</b><small>{libraryMeta.filterDescription}</small></div>
            <div className="list-item"><b>Skill 模板规则</b><small>{libraryMeta.ruleSummary}</small></div>
          </div>
        </aside>

        <main className="skill-grid">
          {allSkills.map((skill) => (
            <button key={skill.id} className={selectedId === skill.id ? 'skill-card active' : 'skill-card'} onClick={() => setSelectedId(skill.id)}>
              <h3>{skill.name}</h3>
              <p>{skill.scenario}</p>
              <div className="skill-meta">
                <span className="tag blue">{skill.category}</span>
                <span className="tag green">{skill.status}</span>
                <span className="tag gray">{skill.version}</span>
              </div>
            </button>
          ))}
        </main>

        <aside className="card">
          <div className="card-head"><h2>Skill 详情</h2></div>
          <div className="card-body panel-scroll">
            <section className="detail-section"><h3>{selected?.name}</h3><p>{selected?.scenario}</p></section>
            <section className="detail-section"><h3>适用场景</h3><p>{selected?.scenario}</p></section>
            <section className="detail-section"><h3>输入材料</h3><ul>{selected?.inputs.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section className="detail-section"><h3>执行流程</h3><ol>{selected?.steps.map((item) => <li key={item}>{item}</li>)}</ol></section>
          </div>
        </aside>
      </section>
    </>
  );
}
