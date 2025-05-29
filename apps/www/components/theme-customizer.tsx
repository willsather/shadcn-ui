"use client"

import React from "react"
import { Check, ClipboardIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer"
import { Label } from "@/registry/new-york/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover"
import { Separator } from "@/registry/new-york/ui/separator"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { type BaseColor, baseColors, baseColorsOKLCH } from "@/registry/registry-base-colors"
import { Input } from "@/registry/new-york/ui/input"

import "@/styles/mdx.css"
import { getThemeCode, getThemeCodeOKLCH } from "@/lib/theme-code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"

// Utility function to convert hex to HSL
function hexToHsl(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

// Function to generate lighter/darker variants of a color
function adjustLightness(hsl: string, adjustment: number): string {
  const [h, s, l] = hsl.split(" ")
  const lightness = Number.parseInt(l.replace("%", ""))
  const newLightness = Math.max(0, Math.min(100, lightness + adjustment))
  return `${h} ${s} ${newLightness}%`
}

// Function to generate custom theme CSS
function generateCustomThemeCSS(baseColor: string, primaryColor: string): string {
  const baseHsl = hexToHsl(baseColor)
  const primaryHsl = hexToHsl(primaryColor)

  // Generate light theme colors
  const lightTheme = {
    background: baseHsl,
    foreground: adjustLightness(baseHsl, -85),
    muted: adjustLightness(baseHsl, -5),
    "muted-foreground": adjustLightness(baseHsl, -50),
    popover: baseHsl,
    "popover-foreground": adjustLightness(baseHsl, -85),
    card: baseHsl,
    "card-foreground": adjustLightness(baseHsl, -85),
    border: adjustLightness(baseHsl, -10),
    input: adjustLightness(baseHsl, -10),
    primary: primaryHsl,
    "primary-foreground": adjustLightness(primaryHsl, 40),
    secondary: adjustLightness(baseHsl, -15), // Derived from base
    "secondary-foreground": adjustLightness(baseHsl, -75), // Derived from base
    accent: adjustLightness(baseHsl, -5),
    "accent-foreground": adjustLightness(baseHsl, -60),
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "210 20% 98%",
    ring: primaryHsl,
  }

  // Generate dark theme colors
  const darkTheme = {
    background: adjustLightness(baseHsl, -90),
    foreground: adjustLightness(baseHsl, 90),
    muted: adjustLightness(baseHsl, -70),
    "muted-foreground": adjustLightness(baseHsl, 30),
    popover: adjustLightness(baseHsl, -90),
    "popover-foreground": adjustLightness(baseHsl, 90),
    card: adjustLightness(baseHsl, -90),
    "card-foreground": adjustLightness(baseHsl, 90),
    border: adjustLightness(baseHsl, -70),
    input: adjustLightness(baseHsl, -70),
    primary: adjustLightness(primaryHsl, -10),
    "primary-foreground": adjustLightness(primaryHsl, 40),
    secondary: adjustLightness(baseHsl, -80), // Derived from base
    "secondary-foreground": adjustLightness(baseHsl, 15), // Derived from base
    accent: adjustLightness(baseHsl, -70),
    "accent-foreground": adjustLightness(baseHsl, 90),
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "210 20% 98%",
    ring: adjustLightness(primaryHsl, -10),
  }

  // Generate CSS
  let css = ".theme-custom {\n"
  Object.entries(lightTheme).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`
  })
  css += "}\n\n"

  css += ".dark .theme-custom {\n"
  Object.entries(darkTheme).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`
  })
  css += "}\n"

  return css
}

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="sm" className="md:hidden">
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6 pt-0">
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden items-center md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">Customize</Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="z-40 w-[340px] rounded-[12px] bg-white p-6 dark:bg-zinc-950">
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
      <CopyCodeButton variant="ghost" size="sm" className="[&_svg]:hidden" />
    </div>
  )
}

export function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme: mode } = useTheme()
  const [config, setConfig] = useConfig()
  const [baseColor, setBaseColor] = React.useState("#ffffff")
  const [primaryColor, setPrimaryColor] = React.useState("#FF69B4")
  const [baseHexInput, setBaseHexInput] = React.useState("#ffffff")
  const [primaryHexInput, setPrimaryHexInput] = React.useState("#FF69B4")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Inject custom theme CSS when colors change
  React.useEffect(() => {
    if (config.theme === "custom") {
      const customCSS = generateCustomThemeCSS(baseColor, primaryColor)

      // Remove existing custom theme style
      const existingStyle = document.getElementById("custom-theme-style")
      if (existingStyle) {
        existingStyle.remove()
      }

      // Create and inject new style
      const styleElement = document.createElement("style")
      styleElement.id = "custom-theme-style"
      styleElement.textContent = customCSS
      document.head.appendChild(styleElement)
    } else {
      // Remove custom theme style when not using custom theme
      const existingStyle = document.getElementById("custom-theme-style")
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [config.theme, baseColor, primaryColor])

  const updateColor = (colorType: "base" | "primary", color: string) => {
    // validate hex color format
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return false
    }

    switch (colorType) {
      case "base":
        setBaseColor(color)
        setBaseHexInput(color)
        break
      case "primary":
        setPrimaryColor(color)
        setPrimaryHexInput(color)
        break
    }

    return true
  }

  // generic input handlers
  const createInputHandlers = (colorType: "base" | "primary") => {
    const getHexInput = () => {
      switch (colorType) {
        case "base":
          return baseHexInput
        case "primary":
          return primaryHexInput
      }
    }

    const setHexInput = (value: string) => {
      switch (colorType) {
        case "base":
          setBaseHexInput(value)
          break
        case "primary":
          setPrimaryHexInput(value)
          break
      }
    }

    const getCurrentColor = () => {
      switch (colorType) {
        case "base":
          return baseColor
        case "primary":
          return primaryColor
      }
    }

    return {
      handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setHexInput(e.target.value)
      },
      handleInputBlur: () => {
        let color = getHexInput()
        if (color.charAt(0) !== "#") {
          color = "#" + color
        }
        if (/^#[0-9A-F]{6}$/i.test(color)) {
          updateColor(colorType, color)
        } else {
          setHexInput(getCurrentColor())
        }
      },
      handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          let color = getHexInput()
          if (color.charAt(0) !== "#") {
            color = "#" + color
          }
          if (/^#[0-9A-F]{6}$/i.test(color)) {
            updateColor(colorType, color)
          } else {
            setHexInput(getCurrentColor())
          }
        }
      },
    }
  }

  const baseHandlers = createInputHandlers("base")
  const primaryHandlers = createInputHandlers("primary")

  // build open in v0 button url
  const params = new URLSearchParams()
  params.append("url", `https://shadcn-ui-fork.vercel.app/themes/${config.theme}/${config.radius}/r/theme.json`)
  params.append("title", "Shadcn/ui Theme Kit")
  params.append(
    "prompt",
    "This theme kit is provided by Shadcn/ui. All future generations must use these styles and colors unless instructed otherwise.",
  )

  const v0Url = `https://v0.dev/chat/api/open?${params.toString()}`

  const themes = [
    ...baseColors.filter((theme) => !["slate", "stone", "gray", "neutral"].includes(theme.name)),
    {
      name: "custom",
      activeColor: { light: "262 83% 58%", dark: "262 83% 58%" },
      label: "Custom",
    },
  ]

  return (
    <ThemeWrapper defaultTheme="zinc">
      <div className="grid w-full flex-1 grid-cols-2 flex-wrap items-start gap-2 sm:flex sm:items-center md:gap-6">
        <div className="flex flex-col gap-2">
          <Label className="sr-only text-xs">Color</Label>

          <div className="flex flex-wrap gap-1 md:gap-2">
            {themes.map((theme) => {
              const isActive = config.theme === theme.name

              return mounted ? (
                <Button
                  variant="outline"
                  size="sm"
                  key={theme.name}
                  onClick={() => {
                    console.log(`CLICKED: ${theme.name}`)
                    setConfig({
                      ...config,
                      theme: theme.name as BaseColor["name"] | "custom",
                    })
                  }}
                  className={cn(
                    "w-[32px] rounded-lg lg:px-2.5 xl:w-[86px]",
                    isActive && "border-primary/50 ring-[2px] ring-primary/30",
                  )}
                  style={
                    theme.name === "custom"
                      ? ({
                        "--theme-primary": `${primaryColor}`,
                      } as React.CSSProperties)
                      : ({
                        "--theme-primary": `hsl(${theme?.activeColor[mode === "dark" ? "dark" : "light"]})`,
                      } as React.CSSProperties)
                  }
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full",
                      theme.name === "custom" ? "bg-gradient-to-r from-[#FF69B4] to-[#36bdf2]" : "bg-[--theme-primary]",
                    )}
                  >
                    {isActive && <Check className={cn("!size-2.5 text-white")} />}
                  </span>
                  <span className="hidden xl:block">{theme.label === "Zinc" ? "Default" : theme.label}</span>
                </Button>
              ) : (
                <Skeleton className="h-8 w-[32px] xl:w-[86px]" key={theme.name} />
              )
            })}
          </div>
        </div>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <div className="flex flex-col gap-2">
          <Label className="sr-only text-xs">Radius</Label>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => (
              <Button
                variant={"outline"}
                size="sm"
                key={value}
                onClick={() => {
                  setConfig({
                    ...config,
                    radius: Number.parseFloat(value),
                  })
                }}
                className={cn(
                  "w-[40px] rounded-lg",
                  config.radius === Number.parseFloat(value) && "border-primary/50 ring-[2px] ring-primary/30",
                )}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 sm:ml-auto">
          <CopyCodeButton />

          <Button
            aria-label="Open in v0"
            className="h-8 gap-1 rounded-lg bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
            asChild
          >
            <a href={v0Url} target="_blank" rel="noreferrer">
              Open in{" "}
              <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-current">
                <path
                  d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
                  fill="currentColor"
                />
                <path
                  d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </Button>
        </div>
      </div>
      {config.theme === "custom" && (
        <div className="mt-4 duration-200 animate-in slide-in-from-top-2">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex gap-4">
              {/* Base Color */}
              <div className="max-w-xs">
                <Label className="mb-3 block text-sm font-medium">Base Color</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => {
                        updateColor("base", e.target.value)
                      }}
                      className="h-12 w-12 cursor-pointer overflow-hidden rounded-lg border-2 border-input bg-transparent"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <style jsx>{`
                      input[type="color"]::-webkit-color-swatch-wrapper {
                        padding: 0;
                      }
                      input[type="color"]::-webkit-color-swatch {
                        border: none;
                        border-radius: 6px;
                      }
                      input[type="color"]::-moz-color-swatch {
                        border: none;
                        border-radius: 6px;
                      }
                    `}</style>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={baseHexInput}
                      onChange={baseHandlers.handleInputChange}
                      onBlur={baseHandlers.handleInputBlur}
                      onKeyDown={baseHandlers.handleInputKeyDown}
                      className="h-9 font-mono text-sm"
                      placeholder="#ffffff"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
              {/* Primary Color */}
              <div className="max-w-xs">
                <Label className="mb-3 block text-sm font-medium">Primary Color</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        updateColor("primary", e.target.value)
                      }}
                      className="h-12 w-12 cursor-pointer overflow-hidden rounded-lg border-2 border-input bg-transparent"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <style jsx>{`
                      input[type="color"]::-webkit-color-swatch-wrapper {
                        padding: 0;
                      }
                      input[type="color"]::-webkit-color-swatch {
                        border: none;
                        border-radius: 6px;
                      }
                      input[type="color"]::-moz-color-swatch {
                        border: none;
                        border-radius: 6px;
                      }
                    `}</style>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={primaryHexInput}
                      onChange={primaryHandlers.handleInputChange}
                      onBlur={primaryHandlers.handleInputBlur}
                      onKeyDown={primaryHandlers.handleInputKeyDown}
                      className="h-9 font-mono text-sm"
                      placeholder="#8b5cf6"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeWrapper>
  )
}

export function CopyCodeButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className={cn("h-8 rounded-lg shadow-none sm:hidden", className)} {...props}>
            Export
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Export Theme</DrawerTitle>
            <DrawerDescription>
              Use this theme by either pasting in your CSS file or by integrating into your AI IDE using MCP.
            </DrawerDescription>
          </DrawerHeader>
          <ThemeWrapper defaultTheme="zinc" className="relative px-6">
            <CustomizerCode />
          </ThemeWrapper>
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className={cn("hidden h-8 rounded-lg shadow-none sm:flex", className)} {...props}>
            Export
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl outline-none">
          <DialogHeader>
            <DialogTitle>Export Theme</DialogTitle>
            <DialogDescription>
              Use this theme by either pasting in your CSS file or by integrating into your AI IDE using MCP.
            </DialogDescription>
          </DialogHeader>
          <ThemeWrapper defaultTheme="zinc" className="relative overflow-x-scroll">
            <CustomizerCode />
          </ThemeWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CustomizerCode() {
  const [config] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [tab, setTab] = React.useState("v4")
  const activeTheme = React.useMemo(() => baseColors.find((theme) => theme.name === config.theme), [config.theme])
  const activeThemeOKLCH = React.useMemo(
    () => baseColorsOKLCH[config.theme as keyof typeof baseColorsOKLCH],
    [config.theme],
  )

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  }, [hasCopied])

  const mcpServer = JSON.stringify(
    {
      mcpServers: {
        shadcn: {
          command: "npx",
          args: ["-y", "shadcn@canary", "registry:mcp"],
          env: {
            // FIXME: this would need to be the main `ui.shadcn.com` URL eventually
            REGISTRY_URL: `https://shadcn-ui-fork.vercel.app/themes/${config.theme}/${config.radius}/r/registry.json`,
          },
        },
      },
    },
    null,
    2,
  )

  function getTabContent(tab: string) {
    if (tab === "v3") {
      return getThemeCode(activeTheme, config.radius)
    }

    if (tab === "cursor" || tab === "windsurf") {
      return mcpServer
    }

    return getThemeCodeOKLCH(activeThemeOKLCH, config.radius)
  }

  return (
    <ThemeWrapper defaultTheme="zinc" className="relative space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="v4">Tailwind v4</TabsTrigger>
            <TabsTrigger value="v3">Tailwind v3</TabsTrigger>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
            <TabsTrigger value="windsurf">Windsurf</TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              copyToClipboardWithMeta(getTabContent(tab), {
                name: "copy_theme_code",
                properties: {
                  theme: config.theme,
                  radius: config.radius,
                },
              })
              setHasCopied(true)
            }}
            className="absolute right-0 top-0 shadow-none"
          >
            {hasCopied ? <Check /> : <ClipboardIcon />}
            Copy
          </Button>
        </div>
        <TabsContent value="v4">
          <div data-rehype-pretty-code-fragment="">
            <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-white">&nbsp;:root &#123;</span>
                <span className="line text-white">&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;</span>
                {Object.entries(activeThemeOKLCH?.light).map(([key, value]) => (
                  <span className="line text-white" key={key}>
                    &nbsp;&nbsp;&nbsp;--{key}: {value};
                  </span>
                ))}
                <span className="line text-white">&nbsp;&#125;</span>
                <span className="line text-white">&nbsp;</span>
                <span className="line text-white">&nbsp;.dark &#123;</span>
                {Object.entries(activeThemeOKLCH?.dark).map(([key, value]) => (
                  <span className="line text-white" key={key}>
                    &nbsp;&nbsp;&nbsp;--{key}: {value};
                  </span>
                ))}
                <span className="line text-white">&nbsp;&#125;</span>
              </code>
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="v3">
          <div data-rehype-pretty-code-fragment="">
            <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-white">@layer base &#123;</span>
                <span className="line text-white">&nbsp;&nbsp;:root &#123;</span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background: {activeTheme?.cssVars.light["background"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {activeTheme?.cssVars.light["foreground"]};
                </span>
                {["card", "popover", "primary", "secondary", "muted", "accent", "destructive"].map((prefix) => (
                  <>
                    <span className="line text-white" key={prefix}>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {activeTheme?.cssVars.light[prefix as keyof typeof activeTheme.cssVars.light]};
                    </span>
                    <span className="line text-white" key={`${prefix}-foreground`}>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {activeTheme?.cssVars.light[`${prefix}-foreground` as keyof typeof activeTheme.cssVars.light]};
                    </span>
                  </>
                ))}
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border: {activeTheme?.cssVars.light["border"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input: {activeTheme?.cssVars.light["input"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring: {activeTheme?.cssVars.light["ring"]};
                </span>
                <span className="line text-white">&nbsp;&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;</span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map((prefix) => (
                  <>
                    <span className="line text-white" key={prefix}>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {activeTheme?.cssVars.light[prefix as keyof typeof activeTheme.cssVars.light]};
                    </span>
                  </>
                ))}
                <span className="line text-white">&nbsp;&nbsp;&#125;</span>
                <span className="line text-white">&nbsp;</span>
                <span className="line text-white">&nbsp;&nbsp;.dark &#123;</span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background: {activeTheme?.cssVars.dark["background"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {activeTheme?.cssVars.dark["foreground"]};
                </span>
                {["card", "popover", "primary", "secondary", "muted", "accent", "destructive"].map((prefix) => (
                  <>
                    <span className="line text-white" key={prefix}>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {activeTheme?.cssVars.dark[prefix as keyof typeof activeTheme.cssVars.dark]};
                    </span>
                    <span className="line text-white" key={`${prefix}-foreground`}>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {activeTheme?.cssVars.dark[`${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark]};
                    </span>
                  </>
                ))}
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border: {activeTheme?.cssVars.dark["border"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input: {activeTheme?.cssVars.dark["input"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring: {activeTheme?.cssVars.dark["ring"]};
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map((prefix) => (
                  <>
                    <span className="line text-white" key={prefix}>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {activeTheme?.cssVars.dark[prefix as keyof typeof activeTheme.cssVars.dark]};
                    </span>
                  </>
                ))}
                <span className="line text-white">&nbsp;&nbsp;&#125;</span>
                <span className="line text-white">&#125;</span>
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </ThemeWrapper>
  )
}
