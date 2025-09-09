import { NextResponse } from "next/server"
import { baseColorsOKLCH } from "@/registry/registry-base-colors"
import { getThemeRegistryItem } from "@/lib/theme-code"

export const dynamicParams = false

export function generateStaticParams() {
  // limit radius to available radii
  const availableRadii = [0, 0.3, 0.5, 0.75, 1];

  // limit themes to only the color themes
  const colors = Object.keys(baseColorsOKLCH);

  const params = [];

  for (const color of colors) {
    for (const radius of availableRadii) {
      params.push({
        color,
        radius: radius.toString(),
      });
    }
  }

  return params;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ color: string, radius: number }> }
) {
  const { color, radius } = await params

  const theme = baseColorsOKLCH[color as keyof typeof baseColorsOKLCH]

  const registryItem = getThemeRegistryItem(theme, radius)

  return NextResponse.json(JSON.parse(registryItem), {})
}
