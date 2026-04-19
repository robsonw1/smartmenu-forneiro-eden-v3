import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ✅ CACHE BUSTING: Plugin para forçar atualização automática
const cachebusting = () => ({
  name: 'cache-busting',
  transformIndexHtml(html: string) {
    // Adicionar timestamp no HTML para invalidar cache
    const timestamp = new Date().getTime();
    return html.replace(
      '</head>',
      `<meta name="version-timestamp" content="${timestamp}" />\n  </head>`
    );
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), cachebusting()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ✅ Adicionar hash nos files para cache busting automático
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
}));
