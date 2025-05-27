"use client"

import * as React from "react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { Separator } from "@/registry/new-york/ui/separator"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import {
  BaseColor,
  baseColors,
  baseColorsOKLCH,
} from "@/registry/registry-base-colors"

import "@/styles/mdx.css"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { getThemeCode, getThemeCodeOKLCH } from "@/lib/theme-code"

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
          <PopoverContent
            align="start"
            className="z-40 w-[340px] rounded-[12px] bg-white p-6 dark:bg-zinc-950"
          >
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

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeWrapper defaultTheme="zinc">
      <div className="grid w-full flex-1 grid-cols-2 flex-wrap items-start gap-2 sm:flex sm:items-center md:gap-6">
        <div className="flex flex-col gap-2">
          <Label className="sr-only text-xs">Color</Label>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {baseColors
              .filter(
                (theme) =>
                  !["slate", "stone", "gray", "neutral"].includes(theme.name)
              )
              .map((theme) => {
                const isActive = config.theme === theme.name

                return mounted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    key={theme.name}
                    onClick={() => {
                      setConfig({
                        ...config,
                        theme: theme.name,
                      })
                    }}
                    className={cn(
                      "w-[32px] rounded-lg lg:px-2.5 xl:w-[86px]",
                      isActive && "border-primary/50 ring-[2px] ring-primary/30"
                    )}
                    style={
                      {
                        "--theme-primary": `hsl(${
                          theme?.activeColor[mode === "dark" ? "dark" : "light"]
                        })`,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[--theme-primary]"
                      )}
                    >
                      {isActive && <Check className="!size-2.5 text-white" />}
                    </span>
                    <span className="hidden xl:block">
                      {theme.label === "Zinc" ? "Default" : theme.label}
                    </span>
                  </Button>
                ) : (
                  <Skeleton
                    className="h-8 w-[32px] xl:w-[86px]"
                    key={theme.name}
                  />
                )
              })}
          </div>
        </div>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <div className="flex flex-col gap-2">
          <Label className="sr-only text-xs">Radius</Label>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
              return (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={value}
                  onClick={() => {
                    setConfig({
                      ...config,
                      radius: parseFloat(value),
                    })
                  }}
                  className={cn(
                    "w-[40px] rounded-lg",
                    config.radius === parseFloat(value) &&
                    "border-primary/50 ring-[2px] ring-primary/30"
                  )}
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 sm:ml-auto">
          <CopyCodeButton />

          <Button
            aria-label="Open in v0"
            className="h-8 gap-1 rounded-lg bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
            asChild
          >
            <a
              href={`https://v0.dev/chat/api/open?url=https://ui.shadcn.com/themes/${config.theme}/r/theme.json`}
              target="_blank"
              rel="noreferrer"
            >
              Open in{" "}
              <svg
                viewBox="0 0 40 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-current"
              >
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
    </ThemeWrapper>
  )
}

export function CopyCodeButton({
                                 className,
                                 ...props
                               }: React.ComponentProps<typeof Button>) {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn("h-8 rounded-lg shadow-none sm:hidden", className)}
            {...props}
          >
            Export
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Export Theme</DrawerTitle>
            <DrawerDescription>
              Use this theme by either pasting in your CSS file or by
              integrating into your AI IDE using MCP.
            </DrawerDescription>
          </DrawerHeader>
          <ThemeWrapper defaultTheme="zinc" className="relative px-6">
            <CustomizerCode />
          </ThemeWrapper>
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "hidden h-8 rounded-lg shadow-none sm:flex",
              className
            )}
            {...props}
          >
            Export
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl outline-none">
          <DialogHeader>
            <DialogTitle>Export Theme</DialogTitle>
            <DialogDescription>
              Use this theme by either pasting in your CSS file or by
              integrating into your AI IDE using MCP.
            </DialogDescription>
          </DialogHeader>
          <ThemeWrapper
            defaultTheme="zinc"
            className="relative overflow-x-scroll"
          >
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
  const activeTheme = React.useMemo(
    () => baseColors.find((theme) => theme.name === config.theme),
    [config.theme]
  )
  const activeThemeOKLCH = React.useMemo(
    () => baseColorsOKLCH[config.theme as keyof typeof baseColorsOKLCH],
    [config.theme]
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
            REGISTRY_URL: `https://ui.shadcn.com/themes/${config.theme}/${config.radius}/r/registry.json`,
          },
        },
      },
    },
    null,
    2
  )

  function getTabContent(tab: string) {
    if (tab === "v3") {
      return getThemeCode(activeTheme, config.radius)
    }

    if (tab === "cursor" || "windsurf") {
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
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;
                </span>
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
                <span className="line text-white">
                  &nbsp;&nbsp;:root &#123;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                  {activeTheme?.cssVars.light["background"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
                  {activeTheme?.cssVars.light["foreground"]};
                </span>
                {[
                  "card",
                  "popover",
                  "primary",
                  "secondary",
                  "muted",
                  "accent",
                  "destructive",
                ].map((prefix) => (
                  <>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {
                        activeTheme?.cssVars.light[
                          prefix as keyof typeof activeTheme.cssVars.light
                          ]
                      }
                      ;
                    </span>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {
                        activeTheme?.cssVars.light[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                          ]
                      }
                      ;
                    </span>
                  </>
                ))}
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                  {activeTheme?.cssVars.light["border"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                  {activeTheme?.cssVars.light["input"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                  {activeTheme?.cssVars.light["ring"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                  (prefix) => (
                    <>
                      <span className="line text-white">
                        &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                        {
                          activeTheme?.cssVars.light[
                            prefix as keyof typeof activeTheme.cssVars.light
                            ]
                        }
                        ;
                      </span>
                    </>
                  )
                )}
                <span className="line text-white">&nbsp;&nbsp;&#125;</span>
                <span className="line text-white">&nbsp;</span>
                <span className="line text-white">
                  &nbsp;&nbsp;.dark &#123;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                  {activeTheme?.cssVars.dark["background"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
                  {activeTheme?.cssVars.dark["foreground"]};
                </span>
                {[
                  "card",
                  "popover",
                  "primary",
                  "secondary",
                  "muted",
                  "accent",
                  "destructive",
                ].map((prefix) => (
                  <>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {
                        activeTheme?.cssVars.dark[
                          prefix as keyof typeof activeTheme.cssVars.dark
                          ]
                      }
                      ;
                    </span>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {
                        activeTheme?.cssVars.dark[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                          ]
                      }
                      ;
                    </span>
                  </>
                ))}
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                  {activeTheme?.cssVars.dark["border"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                  {activeTheme?.cssVars.dark["input"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                  {activeTheme?.cssVars.dark["ring"]};
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                  (prefix) => (
                    <>
                      <span className="line text-white">
                        &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                        {
                          activeTheme?.cssVars.dark[
                            prefix as keyof typeof activeTheme.cssVars.dark
                            ]
                        }
                        ;
                      </span>
                    </>
                  )
                )}
                <span className="line text-white">&nbsp;&nbsp;&#125;</span>
                <span className="line text-white">&#125;</span>
              </code>
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="cursor">
          <p className="mb-2 text-sm text-muted-foreground">
            Copy and paste the code into{" "}
            <span className="font-mono">.cursor/mcp.json</span>
          </p>

          <div data-rehype-pretty-code-fragment="">
            <pre className="max-h-[450px] overflow-x-scroll rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-white">{mcpServer}</span>
              </code>
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="windsurf">
          <p className="mb-2 text-sm text-muted-foreground">
            Copy and paste the code into{" "}
            <span className="font-mono">.codeium/windsurf/mcp_config.json</span>
          </p>
          <div data-rehype-pretty-code-fragment="">
            <pre className="max-h-[450px] overflow-x-scroll rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-white">{mcpServer}</span>
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </ThemeWrapper>
  )
}
