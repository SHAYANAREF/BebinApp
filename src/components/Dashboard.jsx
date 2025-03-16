import React from 'react';
import Menu from './Menu.jsx';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const Dashboard = () => {
  const files = [
    { id: 1, name: 'file1.txt' },
    { id: 2, name: 'file2.txt' },
    { id: 3, name: 'file3.txt' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Menu items={menuItems} />
      <h1 className="text-4xl font-bold text-neonBlue">Dashboard</h1>
      <p className="text-xl mt-4">Welcome to your dashboard!</p>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="mt-4">
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
