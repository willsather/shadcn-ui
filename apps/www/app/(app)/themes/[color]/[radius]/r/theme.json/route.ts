import { NextResponse } from "next/server"
import { baseColors, ThemeName } from "@/registry/registry-base-colors"
import { getThemeCode } from "@/lib/theme-code"

export const dynamicParams = false

export function generateStaticParams() {
  // limit radius to available radii
  const availableRadii = [0, 0.3, 0.5, 0.75, 1];

  // limit themes to only the color themes
  const availableThemes = baseColors.filter((theme) =>
    !["slate", "stone", "gray", "neutral"].includes(theme.name)
  );

  const params = [];

  for (const theme of availableThemes) {
    for (const radius of availableRadii) {
      params.push({
        themeId: theme.name,
        radius: radius.toString(),
      });
    }
  }

  return params;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ color: ThemeName, radius: number }> }
) {
  const { color, radius } = await params

  const theme = baseColors.find((theme) => theme.name === color)

  return NextResponse.json({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    type: "registry:theme",
    title: "Shadcn Theme",
    description: "Shadcn themed styles using Tailwind v3",
    files: [
      {
        path: "src/app/globals.css",
        content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${getThemeCode(theme, radius)}`,
        type: "registry:file",
        target: "app/globals.css"
      },
      {
        path: "src/app/starters/tailwind.config.ts",
        content: "import type { Config } from \"tailwindcss\";\n\nconst config: Config = {\n  content: [\n    \"./pages/**/*.{ts,tsx,js,jsx,mdx}\",\n    \"./components/**/*.{ts,tsx,js,jsx,mdx}\",\n    \"./app/**/*.{ts,tsx,js,jsx,mdx}\",\n    \"*.{ts,tsx,js,jsx,mdx}\",\n  ],\n  theme: {\n    extend: {\n      colors: {\n        background: \"var(--background)\",\n        foreground: \"var(--foreground)\",\n\n        card: \"var(--card)\",\n        \"card-foreground\": \"var(--card-foreground)\",\n\n        popover: \"var(--popover)\",\n        \"popover-foreground\": \"var(--popover-foreground)\",\n\n        primary: \"var(--primary)\",\n        \"primary-foreground\": \"var(--primary-foreground)\",\n\n        secondary: \"var(--secondary)\",\n        \"secondary-foreground\": \"var(--secondary-foreground)\",\n\n        muted: \"var(--muted)\",\n        \"muted-foreground\": \"var(--muted-foreground)\",\n\n        accent: \"var(--accent)\",\n        \"accent-foreground\": \"var(--accent-foreground)\",\n\n        destructive: \"var(--destructive)\",\n        \"destructive-foreground\": \"var(--destructive-foreground)\",\n\n        border: \"var(--border)\",\n        input: \"var(--input)\",\n        ring: \"var(--ring)\",\n\n        chart: {\n          1: \"var(--chart-1)\",\n          2: \"var(--chart-2)\",\n          3: \"var(--chart-3)\",\n          4: \"var(--chart-4)\",\n          5: \"var(--chart-5)\",\n        },\n\n        sidebar: {\n          DEFAULT: \"var(--sidebar)\",\n          foreground: \"var(--sidebar-foreground)\",\n          primary: \"var(--sidebar-primary)\",\n          \"primary-foreground\": \"var(--sidebar-primary-foreground)\",\n          accent: \"var(--sidebar-accent)\",\n          \"accent-foreground\": \"var(--sidebar-accent-foreground)\",\n          border: \"var(--sidebar-border)\",\n          ring: \"var(--sidebar-ring)\",\n        },\n      },\n      borderRadius: {\n        lg: \"var(--radius)\",\n        md: \"calc(var(--radius) - 2px)\",\n        sm: \"calc(var(--radius) - 4px)\",\n      },\n      boxShadow: {\n        \"2xs\": \"var(--shadow-2xs)\",\n        xs: \"var(--shadow-xs)\",\n        sm: \"var(--shadow-sm)\",\n        DEFAULT: \"var(--shadow)\",\n        md: \"var(--shadow-md)\",\n        lg: \"var(--shadow-lg)\",\n        xl: \"var(--shadow-xl)\",\n        \"2xl\": \"var(--shadow-2xl)\",\n      },\n      fontFamily: {\n        sans: [\"var(--font-sans)\", \"sans-serif\"],\n        mono: [\"var(--font-mono)\", \"monospace\"],\n      },\n      keyframes: {\n        \"fade-in-scale\": {\n          \"0%\": { opacity: \"0\", transform: \"scale(0.95)\" },\n          \"100%\": { opacity: \"1\", transform: \"scale(1)\" },\n        },\n      },\n      animation: {\n        \"fade-in-scale\": \"fade-in-scale 0.3s ease-out\",\n      },\n    },\n  },\n  plugins: [require(\"tailwindcss-animate\")],\n};\nexport default config;\n",
        type: "registry:file",
        target: "tailwind.config.ts"
      },
      {
        "path": "src/app/starters/root-layout.tsx",
        "content": "import { Geist, Geist_Mono } from \"next/font/google\";\nimport React, { type ReactNode } from \"react\";\n\nimport { cn } from \"@/lib/utils\";\n\nimport \"@/app/globals.css\";\n\nconst GeistSans = Geist({\n  subsets: [\"latin\"],\n  variable: \"--font-geist-sans\",\n});\n\nconst GeistMono = Geist_Mono({\n  subsets: [\"latin\"],\n  variable: \"--font-geist-mono\",\n});\nexport default function RootLayout({\n  children,\n}: Readonly<{\n  children: ReactNode;\n}>) {\n  return (\n    <html\n      lang=\"en\"\n      className={cn(\n        GeistSans.variable,\n        GeistMono.variable,\n        \"bg-background text-foreground\",\n      )}\n    >\n      <body>\n        <main className=\"mt-16 flex w-full justify-center\">\n          <div className=\"container\">{children}</div>\n        </main>\n      </body>\n    </html>\n  );\n}\n",
        "type": "registry:file",
        "target": "app/layout.tsx"
      }
    ]
  })
}
