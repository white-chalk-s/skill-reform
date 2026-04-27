import { Bell, Search } from 'lucide-react';

const navItems = [
  { key: 'home', label: '首页', href: '/' },
  { key: 'tasks', label: '任务区', href: '/tasks/demo-task' },
  { key: 'skills', label: 'Skill 库', href: '/skills' },
  { key: 'settings', label: '设置', href: '/settings' }
];

export function AppLayout({ activeRoute, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-logo" aria-hidden="true" />
          <span>任务方法沉淀平台</span>
        </a>
        <nav className="nav" aria-label="一级导航">
          {navItems.map((item) => (
            <a key={item.key} className={activeRoute === item.key ? 'active' : ''} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="top-right">
          <label className="search-box">
            <Search size={16} />
            <input placeholder="搜索任务、Skill、报告..." />
          </label>
          <button className="icon-btn" aria-label="通知">
            <Bell size={17} />
            <span className="badge-dot">5</span>
          </button>
          <div className="user">
            <span className="avatar">U</span>
            <span>用户名</span>
          </div>
        </div>
      </header>
      <main className="page-bg">
        <div className="page-inner">{children}</div>
      </main>
    </div>
  );
}
