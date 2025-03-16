import { HomeComponent as Home } from '../src/components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import Services from './components/Services.jsx';
import Portfolio from './components/Portfolio.jsx';
import Blog from './components/Blog.jsx';
import Contact from './components/Contact.jsx';
import Demo from './components/Demo.jsx';
import Shop from './components/Shop.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import ARScene from './ARScene.jsx';
import AIContentGenerator from './components/AIContentGenerator.jsx';

const routes = [
{ path: '/', element: <Home /> },
  { path: '/ar', element: <ARScene /> },
  { path: '/ai-content-generator', element: <AIContentGenerator /> },
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

export default routes;
