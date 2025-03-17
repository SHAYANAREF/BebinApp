import { HomeComponent as Home } from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Demo from './components/Demo';
import Shop from './components/Shop';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ARScene from './ARScene';
import AIContentGenerator from './components/AIContentGenerator';

const routes = [
  { path: '/', name: 'Home', element: <Home /> },
  { path: '/arscene', name: 'ARScene', element: <ARScene /> },
  { path: '/ai', name: 'AIContentGenerator', element: <AIContentGenerator /> },
  { path: '/about', name: 'About Us', element: <AboutUs /> },
  { path: '/services', name: 'Services', element: <Services /> },
  { path: '/portfolio', name: 'Portfolio', element: <Portfolio /> },
  { path: '/blog', name: 'Blog', element: <Blog /> },
  { path: '/contact', name: 'Contact', element: <Contact /> },
  { path: '/demo', name: 'Demo', element: <Demo /> },
  { path: '/shop', name: 'Purchase', element: <Shop /> },
  { path: '/register', name: 'Register', element: <Register /> },
  { path: '/login', name: 'Login', element: <Login /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
];

export default routes;
