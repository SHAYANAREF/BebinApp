export function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('dark-theme');
  if (isDark) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
}

// Load theme from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
  }
});