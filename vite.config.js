import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Expose .env variables to the client-side
  const processEnvValues = {
    'process.env': {}
  };

  for (const key in env) {
    processEnvValues[`import.meta.env.VITE_${key}`] = JSON.stringify(env[key]);
  }
  

  return {
    define: processEnvValues,
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
});
