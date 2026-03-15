import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { FacilityDetail } from './pages/FacilityDetail';
import { Calendar } from './pages/Calendar';
import { BookNow } from './pages/BookNow';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Licensing } from './pages/Licensing';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'facilities/:slug', Component: FacilityDetail },
      { path: 'calendar', Component: Calendar },
      { path: 'book', Component: BookNow },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'admin/dashboard', Component: AdminDashboard },
      { path: 'dashboard', Component: UserDashboard },
      { path: 'privacy', Component: Privacy },
      { path: 'terms', Component: Terms },
      { path: 'licensing', Component: Licensing },
      { path: '*', Component: NotFound },
    ],
  },
]);

