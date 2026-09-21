// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  shims: true,
  // This adds the #!/usr/bin/env node line to the top of the compiled file
  // so your OS knows it's an executable script.
  banner: {
    js: "#!/usr/bin/env node",
  },
});
