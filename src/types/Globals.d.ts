declare module "*.css";
declare module "*.svg?react";

interface ImportMetaEnv {
  readonly VITE_LOGO_PUB: string;
  // Add more VITE_ env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
