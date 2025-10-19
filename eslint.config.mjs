// .eslintrc.ts
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js preporučeni plugin i pravila za core web vitals
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Ignorisi foldere koje Next.js automatski generiše
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Dozvoli <img> element i bezbedno koristi alt tekst
      "@next/next/no-img-element": "off",
      // TypeScript pravila
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // React pravila
      "react/no-unescaped-entities": "off",
    },
  },
];

