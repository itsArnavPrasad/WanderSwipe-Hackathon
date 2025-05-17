import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 dark:focus:ring-offset-bg-primary group"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={spring}
        className="relative w-6 h-6"
      >
        <motion.svg
          className={`w-6 h-6 text-text-primary absolute top-0 left-0 transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={false}
          animate={{ scale: isDark ? 0.5 : 1 }}
          transition={spring}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </motion.svg>

        <motion.svg
          className={`w-6 h-6 text-text-primary absolute top-0 left-0 transition-opacity ${isDark ? 'opacity-100' : 'opacity-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={false}
          animate={{ scale: isDark ? 1 : 0.5 }}
          transition={spring}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </motion.svg>
      </motion.div>
      <div className="absolute inset-0 rounded-lg bg-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}; 