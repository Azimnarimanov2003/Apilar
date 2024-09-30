import React from 'react';
  import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Modals from './Modals';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  },
  {
    path : '/home',
    element: <Home />,
  },
  {
    path : '/modals',
    element: <Modals />,
  }

]);

export default router;
