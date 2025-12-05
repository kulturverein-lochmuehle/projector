import config, { setTsConfigRootDir } from '@enke.dev/lint';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  ...config,
  ...setTsConfigRootDir(import.meta.dirname),
});
