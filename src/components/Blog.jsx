import React from 'react';
import Menu from './Menu.jsx';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const Blog = () => {
  const blogPosts = [
    { id: 1, title: 'First Blog Post', content: 'This is the first blog post.' },
    { id: 2, title: 'Second Blog Post', content: 'This is the second blog post.' },
    { id: 3, title: 'Third Blog Post', content: 'This is the third blog post.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Menu items={menuItems} />
      <h1 className="text-4xl font-bold text-neonBlue">Blog</h1>
      <p className="text-xl mt-4">Read our latest blog posts here.</p>
      <ul>
        {blogPosts.map((post) => (
          <li key={post.id} className="mt-4">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
