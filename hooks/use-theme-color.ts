import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
): string {
  const colorFromProps = props.dark ?? props.light;
  if (colorFromProps) {
    return colorFromProps;
  }
  const value = Colors[colorName];
  return typeof value === 'string' ? value : Colors.text;
}
