import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';  // Assuming you're using React Router v6+
import HomeComponent from './Home.jsx';
import AboutUs from './AboutUs.jsx';
import Services from './Services.jsx';
import Portfolio from './Portfolio.jsx';
import Blog from './Blog.jsx';
import Contact from './Contact.jsx';
import Demo from './Demo.jsx';
import Shop from './Shop.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';

// Define routes with proper JSX elements
const routes = [
  { path: '/', element: <HomeComponent /> },
  { path: '/about', element: <AboutUs /> },
  { path: '/services', element: <Services /> },
  { path: '/portfolio', element: <Portfolio /> },
  { path: '/blog', element: <Blog /> },
  { path: '/contact', element: <Contact /> },
  { path: '/demo', element: <Demo /> },
  { path: '/shop', element: <Shop /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
];

// Create a router with these routes
const router = createBrowserRouter(routes);

// This component should be used in your main App component
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

// Export routes for use elsewhere if needed
export default routes;