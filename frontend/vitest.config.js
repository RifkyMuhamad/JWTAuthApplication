import { defineConfig } from "vitest/dist/config";

export default defineConfig({
    test: {
        dir: 'src/tests',
        globals:true
    }
});