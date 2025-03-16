module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // فعال‌سازی حالت تاریک با استفاده از کلاس
  theme: {
    extend: {
      colors: {
        neonBlue: '#00f0ff',
        neonPurple: '#d400ff',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 5px #00f0ff, 0 0 15px #00f0ff' },
          '50%': { textShadow: '0 0 15px #00f0ff, 0 0 30px #00f0ff' },
        },
      },
    },
  },
  plugins: [],
}
