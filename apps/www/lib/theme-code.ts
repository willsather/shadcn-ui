import template from "lodash/template"

import { BaseColor, BaseColorOKLCH } from "@/registry/registry-base-colors";

export function getThemeCode(theme: BaseColor | undefined, radius: number) {
  if (!theme) {
    return ""
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    radius: radius.toString(),
  })
}

export function getThemeCodeOKLCH(theme: BaseColorOKLCH | undefined, radius: number) {
  if (!theme) {
    return ""
  }

  return ":root {\n  --radius: " +
    radius +
    "rem;\n" +
    Object.entries(theme.light)
      .map((entry) => "  --" + entry[0] + ": " + entry[1] + ";")
      .join("\n") +
    "\n}\n\n.dark {\n" +
    Object.entries(theme.dark)
      .map((entry) => "  --" + entry[0] + ": " + entry[1] + ";")
      .join("\n") +
    "\n}\n"
}

export function getThemeRegistryItem(theme: BaseColor | undefined, radius: number) {
  if (!theme) {
    return ""
  }

  return template(BASE_STYLE_REGISTRY_ITEM)({
    colors: theme.cssVars,
    radius: radius.toString(),
  });
}

const BASE_STYLES_WITH_VARIABLES = `
@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: <%- radius %>rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}
`
const BASE_STYLE_REGISTRY_ITEM = `{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "shadcn-registry",
  "type": "registry:style",
  "cssVars": {
    "theme": {
      "background": "var(--background)",
      "foreground": "var(--foreground)",
      "card": "var(--card)",
      "card-foreground": "var(--card-foreground)",
      "popover": "var(--popover)",
      "popover-foreground": "var(--popover-foreground)",
      "primary": "var(--primary)",
      "primary-foreground": "var(--primary-foreground)",
      "secondary": "var(--secondary)",
      "secondary-foreground": "var(--secondary-foreground)",
      "muted": "var(--muted)",
      "muted-foreground": "var(--muted-foreground)",
      "accent": "var(--accent)",
      "accent-foreground": "var(--accent-foreground)",
      "destructive": "var(--destructive)",
      "destructive-foreground": "var(--destructive-foreground)",
      "border": "var(--border)",
      "input": "var(--input)",
      "ring": "var(--ring)",
      "chart-1": "var(--chart-1)",
      "chart-2": "var(--chart-2)",
      "chart-3": "var(--chart-3)",
      "chart-4": "var(--chart-4)",
      "chart-5": "var(--chart-5)",
      "sidebar": "var(--sidebar)",
      "sidebar-foreground": "var(--sidebar-foreground)",
      "sidebar-primary": "var(--sidebar-primary)",
      "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
      "sidebar-accent": "var(--sidebar-accent)",
      "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
      "sidebar-border": "var(--sidebar-border)",
      "sidebar-ring": "var(--sidebar-ring)"
    },
    "light": {
      "background": "<%- colors.light['background'] %>",
      "foreground": "<%- colors.light['foreground'] %>",
      "card": "<%- colors.light['card'] %>",
      "card-foreground": "<%- colors.light['card-foreground'] %>",
      "popover": "<%- colors.light['popover'] %>",
      "popover-foreground": "<%- colors.light['popover-foreground'] %>",
      "primary": "<%- colors.light['primary'] %>",
      "primary-foreground": "<%- colors.light['primary-foreground'] %>",
      "secondary": "<%- colors.light['secondary'] %>",
      "secondary-foreground": "<%- colors.light['secondary-foreground'] %>",
      "muted": "<%- colors.light['muted'] %>",
      "muted-foreground": "<%- colors.light['muted-foreground'] %>",
      "accent": "<%- colors.light['accent'] %>",
      "accent-foreground": "<%- colors.light['accent-foreground'] %>",
      "destructive": "<%- colors.light['destructive'] %>",
      "destructive-foreground": "<%- colors.light['destructive-foreground'] %>",
      "border": "<%- colors.light['border'] %>",
      "input": "<%- colors.light['input'] %>",
      "ring": "<%- colors.light['ring'] %>",
      "chart-1": "<%- colors.light['chart-1'] %>",
      "chart-2": "<%- colors.light['chart-2'] %>",
      "chart-3": "<%- colors.light['chart-3'] %>",
      "chart-4": "<%- colors.light['chart-4'] %>",
      "chart-5": "<%- colors.light['chart-5'] %>",
      "sidebar": "<%- colors.light['sidebar'] %>",
      "sidebar-foreground": "<%- colors.light['sidebar-foreground'] %>",
      "sidebar-primary": "<%- colors.light['sidebar-primary'] %>",
      "sidebar-primary-foreground": "<%- colors.light['sidebar-primary-foreground'] %>",
      "sidebar-accent": "<%- colors.light['sidebar-accent'] %>",
      "sidebar-accent-foreground": "<%- colors.light['sidebar-accent-foreground'] %>",
      "sidebar-border": "<%- colors.light['sidebar-border'] %>",
      "sidebar-ring": "<%- colors.light['sidebar-ring'] %>",
      "radius": "<%- radius %>rem"
    },
    "dark": {
      "background": "<%- colors.dark['background'] %>",
      "foreground": "<%- colors.dark['foreground'] %>",
      "card": "<%- colors.dark['card'] %>",
      "card-foreground": "<%- colors.dark['card-foreground'] %>",
      "popover": "<%- colors.dark['popover'] %>",
      "popover-foreground": "<%- colors.dark['popover-foreground'] %>",
      "primary": "<%- colors.dark['primary'] %>",
      "primary-foreground": "<%- colors.dark['primary-foreground'] %>",
      "secondary": "<%- colors.dark['secondary'] %>",
      "secondary-foreground": "<%- colors.dark['secondary-foreground'] %>",
      "muted": "<%- colors.dark['muted'] %>",
      "muted-foreground": "<%- colors.dark['muted-foreground'] %>",
      "accent": "<%- colors.dark['accent'] %>",
      "accent-foreground": "<%- colors.dark['accent-foreground'] %>",
      "destructive": "<%- colors.dark['destructive'] %>",
      "destructive-foreground": "<%- colors.dark['destructive-foreground'] %>",
      "border": "<%- colors.dark['border'] %>",
      "input": "<%- colors.dark['input'] %>",
      "ring": "<%- colors.dark['ring'] %>",
      "chart-1": "<%- colors.dark['chart-1'] %>",
      "chart-2": "<%- colors.dark['chart-2'] %>",
      "chart-3": "<%- colors.dark['chart-3'] %>",
      "chart-4": "<%- colors.dark['chart-4'] %>",
      "chart-5": "<%- colors.dark['chart-5'] %>",
      "sidebar": "<%- colors.dark['sidebar'] %>",
      "sidebar-foreground": "<%- colors.dark['sidebar-foreground'] %>",
      "sidebar-primary": "<%- colors.dark['sidebar-primary'] %>",
      "sidebar-primary-foreground": "<%- colors.dark['sidebar-primary-foreground'] %>",
      "sidebar-accent": "<%- colors.dark['sidebar-accent'] %>",
      "sidebar-accent-foreground": "<%- colors.dark['sidebar-accent-foreground'] %>",
      "sidebar-border": "<%- colors.dark['sidebar-border'] %>",
      "sidebar-ring": "<%- colors.dark['sidebar-ring'] %>"
    }
  }
}`
