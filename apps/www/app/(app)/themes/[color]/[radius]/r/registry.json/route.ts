import { NextResponse } from "next/server"
import { baseColors, ThemeName } from "@/registry/registry-base-colors"
import { getThemeRegistryItem } from "@/lib/theme-code"

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

  const registryItem = getThemeRegistryItem(theme, radius)

  return NextResponse.json(JSON.parse(registryItem), {})
}
