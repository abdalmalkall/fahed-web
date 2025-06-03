import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/fahed-web/', // هذا مهم لنشر الموقع في المسار الصحيح
  plugins: [react()],
});
