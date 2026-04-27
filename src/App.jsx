import { useMemo } from 'react';
import { AppLayout } from './components/AppLayout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { TaskPage } from './pages/TaskPage.jsx';
import { SkillsPage } from './pages/SkillsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

function getRoute(pathname) {
  if (pathname === '/') return { key: 'home', params: {} };
  if (/^\/tasks\/[^/]+$/.test(pathname)) {
    return { key: 'tasks', params: { id: pathname.split('/')[2] } };
  }
  if (pathname === '/skills') return { key: 'skills', params: {} };
  if (pathname === '/settings') return { key: 'settings', params: {} };
  return { key: 'home', params: {} };
}

export default function App() {
  const route = useMemo(() => getRoute(window.location.pathname), []);

  return (
    <AppLayout activeRoute={route.key}>
      {route.key === 'home' && <HomePage />}
      {route.key === 'tasks' && <TaskPage taskId={route.params.id} />}
      {route.key === 'skills' && <SkillsPage />}
      {route.key === 'settings' && <SettingsPage />}
    </AppLayout>
  );
}
