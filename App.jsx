import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NeonMenu from './NeonMenu';

// کامپوننت‌های صفحات (برای نمونه)
const Home = () => <div className="min-h-screen p-8">صفحه اصلی</div>;
const About = () => <div className="min-h-screen p-8">درباره ما</div>;
const Services = () => <div className="min-h-screen p-8">خدمات</div>;
const Portfolio = () => <div className="min-h-screen p-8">نمونه کارها</div>;
const Blog = () => <div className="min-h-screen p-8">وبلاگ</div>;
const Contact = () => <div className="min-h-screen p-8">تماس با ما</div>;
const Login = () => <div className="min-h-screen p-8">ورود</div>;
const Register = () => <div className="min-h-screen p-8">ثبت نام</div>;
const Dashboard = () => <div className="min-h-screen p-8">داشبورد</div>;

// تعریف مسیرها با برچسب‌ها
const routes = [
  { path: '/', element: <Home />, label: 'خانه' },
  { path: '/about', element: <About />, label: 'درباره ما' },
  { path: '/services', element: <Services />, label: 'خدمات' },
  { path: '/portfolio', element: <Portfolio />, label: 'نمونه کارها' },
  { path: '/blog', element: <Blog />, label: 'وبلاگ' },
  { path: '/contact', element: <Contact />, label: 'تماس با ما' },
  { path: '/login', element: <Login />, label: 'ورود' },
  { path: '/register', element: <Register />, label: 'ثبت نام' },
  { path: '/dashboard', element: <Dashboard />, label: 'داشبورد' }
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <header className="py-4 px-6">
          <NeonMenu routes={routes} />
        </header>
        
        <main className="container mx-auto py-8">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
