import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

const plugin = (monacoEditorPlugin as any).default || monacoEditorPlugin;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    plugin({
      languageWorkers: ["editorWorkerService", "json"],
      customWorkers: [
        {
          label: "graphql",
          entry: "monaco-graphql/esm/graphql.worker.js",
        },
      ],
    }),
  ],
});
