import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TaskProvider } from './context/TaskContext';

export default function App() {
  return (
    <ErrorBoundary>
      <TaskProvider>
        <RouterProvider router={router} />
      </TaskProvider>
    </ErrorBoundary>
  );
}