import {
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  FolderKanban,
  Sparkles,
  Workflow
} from 'lucide-react';
import { createTask, getHomePageData } from '../services/taskService.js';

const statIcons = {
  blue: FolderKanban,
  green: Sparkles,
  purple: FileText
};

const quickIcons = {
  blue: Code2,
  green: FileText,
  purple: Workflow,
  orange: FolderKanban
};

const skillGlyphs = {
  purple: 'A',
  blue: 'B',
  orange: 'C',
  green: 'D'
};

const thumbLabel = {
  report: '报告',
  flow: '流程图',
  html: 'HTML'
};

export function HomePage() {
  const homeDashboard = getHomePageData();

  function handleCreateTask() {
    const task = createTask();
    window.location.href = `/tasks/${task.id}`;
  }

  return (
    <div className="home-page">
      <section className="page-card home-hero">
        <div className="home-hero-text">
          <h1>欢迎使用任务方法沉淀平台 / AI Skill 生成平台</h1>
          <p>先把任务主流程跑通，再把过程沉淀成可复用的方法与后续能力。</p>
          <div className="home-hero-actions">
            <button className="primary-btn home-hero-btn" type="button" onClick={handleCreateTask}>
              + 新建任务
            </button>
            <a className="outline-btn home-hero-btn" href="/skills">
              查看 Skill 库
            </a>
          </div>
        </div>

        <div className="home-stat-row">
          {homeDashboard.stats.map((stat) => {
            const Icon = statIcons[stat.tone];

            return (
              <div className="home-stat-card" key={stat.id}>
                <div className={`home-stat-icon ${stat.tone}`}>
                  <Icon size={18} strokeWidth={2.3} />
                </div>
                <div className="home-stat-content">
                  <span className="home-stat-label">{stat.label}</span>
                  <b className="home-stat-value">{stat.value}</b>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-grid">
        <section className="card home-calendar">
          <div className="card-head">
            <h3>任务日历</h3>
            <a className="link" href="/tasks/demo-task">
              查看全部
            </a>
          </div>
          <div className="card-body">
            <div className="home-calendar-top">
              <div className="home-month-nav">
                <button className="home-nav-btn" aria-label="上个月">
                  <ChevronLeft size={16} />
                </button>
                <span>{homeDashboard.calendar.title}</span>
                <button className="home-nav-btn" aria-label="下个月">
                  <ChevronRight size={16} />
                </button>
              </div>
              <button className="home-today-btn">今天</button>
            </div>

            <div className="home-calendar-grid">
              {homeDashboard.calendar.weekNames.map((name) => (
                <div className="home-day-name" key={name}>
                  {name}
                </div>
              ))}

              {homeDashboard.calendar.days.map((day, index) => (
                <div className={`home-day ${day.muted ? 'muted' : ''} ${day.active ? 'active' : ''}`} key={`${day.num}-${index}`}>
                  <span className="home-day-num">{day.num}</span>
                  {day.dots?.length ? (
                    <div className="home-dots">
                      {day.dots.map((tone) => (
                        <i className={`home-dot ${tone}`} key={tone} />
                      ))}
                    </div>
                  ) : null}
                  {day.label ? <span className={`home-mini-label ${day.labelTone}`}>{day.label}</span> : null}
                </div>
              ))}
            </div>

            <div className="home-legend">
              {homeDashboard.calendar.legend.map((item) => (
                <span key={item.label}>
                  <i className={`home-dot ${item.tone}`} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="card home-today">
          <div className="card-head">
            <h3>今日待处理</h3>
            <a className="link" href="/tasks/demo-task">
              查看全部
            </a>
          </div>
          <div className="card-body home-task-list">
            {homeDashboard.todayTasks.map((task) => (
              <a className="home-task" href={`/tasks/${task.id}`} key={task.id}>
                <span className="home-checkbox" />
                <div>
                  <b>{task.title}</b>
                  <span>{task.priority}</span>
                </div>
                <span className={`status ${task.status === '进行中' ? 'orange' : task.status === '待处理' ? 'blue' : 'gray'}`}>{task.status}</span>
                <span className="home-time">{task.scheduledTime}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="card home-quick">
          <div className="card-head">
            <h3>快速入口</h3>
          </div>
          <div className="card-body home-quick-grid">
            {homeDashboard.quickEntries.map((entry) => {
              const Icon = quickIcons[entry.tone];

              return (
                <a className="home-quick-item" href={entry.href} key={entry.id}>
                  <div className={`home-quick-icon ${entry.tone}`}>
                    <Icon size={18} strokeWidth={2.4} />
                  </div>
                  <span className="home-quick-title">{entry.title}</span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="card home-history">
          <div className="card-head">
            <h3>历史任务</h3>
            <a className="link" href="/tasks/demo-task">
              查看全部
            </a>
          </div>
          <div className="card-body home-history-list">
            {homeDashboard.historyTasks.map((item) => (
              <a className="home-history-item" href={`/tasks/${item.id}`} key={item.id}>
                <div>
                  <b>{item.title}</b>
                  <small>{item.summary}</small>
                </div>
                <span className={`status ${item.status === '已完成' ? 'green' : 'orange'}`}>{item.status}</span>
                <small>更新于 {item.updatedAt}</small>
                <span className="home-arrow">›</span>
              </a>
            ))}
          </div>
        </section>

        <section className="card home-recent">
          <div className="card-head">
            <h3>最近沉淀</h3>
            <a className="link" href="/skills">
              查看全部
            </a>
          </div>
          <div className="card-body home-recent-grid">
            {homeDashboard.recentAssets.map((item) => (
              <article className="home-recent-card" key={item.id}>
                <div className={`home-thumb ${item.type}`}>
                  <span>{thumbLabel[item.type]}</span>
                </div>
                <div className="home-recent-info">
                  <b>{item.title}</b>
                  <small>{item.meta}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card home-skills">
          <div className="card-head">
            <h3>最近使用 Skill</h3>
            <a className="link" href="/skills">
              查看全部
            </a>
          </div>
          <div className="card-body home-skill-list">
            {homeDashboard.recentSkills.map((item) => (
              <div className="home-skill-item" key={item.id}>
                <div className={`home-skill-icon ${item.tone}`}>{skillGlyphs[item.tone]}</div>
                <div>
                  <b>{item.title}</b>
                  <small>{item.category}</small>
                </div>
                <span className="tag blue">{item.usage}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <footer className="home-footer">© 2025 任务方法沉淀平台</footer>
    </div>
  );
}
