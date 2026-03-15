import { RouterProvider } from 'react-router';
import './i18n';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
