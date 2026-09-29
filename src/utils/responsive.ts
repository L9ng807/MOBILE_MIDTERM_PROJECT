import {
  Dimensions,
  PixelRatio,
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

/** iPhone 11 / 12 / 13 logical width — design baseline. */
const BASE_WIDTH = 375;

const MIN_SCALE = 0.78;
const MAX_SCALE = 1.1;

export function screenScale(): number {
  const { width } = Dimensions.get('window');
  const raw = width / BASE_WIDTH;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
}

/** Layout sizes (padding, margin, radius, gap). */
export function s(size: number): number {
  return PixelRatio.roundToNearestPixel(size * screenScale());
}

/**
 * Font / line-height scale.
 * Damped so titles shrink on small phones without exploding on tablets.
 */
export function fs(size: number): number {
  const factor = 0.75;
  const scaled = size * screenScale();
  return PixelRatio.roundToNearestPixel(
    size + (scaled - size) * factor,
  );
}

const FONT_KEYS = new Set([
  'fontSize',
  'lineHeight',
  'letterSpacing',
]);

const LAYOUT_KEYS = new Set([
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'gap',
  'rowGap',
  'columnGap',
  'minWidth',
  'minHeight',
  'top',
  'bottom',
  'left',
  'right',
]);

function scaleStyle(
  style: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(style)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      out[key] = value;
      continue;
    }

    if (FONT_KEYS.has(key)) {
      out[key] = fs(value);
    } else if (LAYOUT_KEYS.has(key)) {
      out[key] = s(value);
    } else {
      out[key] = value;
    }
  }

  return out;
}

export function createScaledSheet<
  T extends NamedStyles<T> | NamedStyles<any>,
>(styles: T | NamedStyles<T>): T {
  const scaled: Record<string, unknown> = {};

  for (const [name, style] of Object.entries(styles)) {
    scaled[name] = scaleStyle(style as Record<string, unknown>);
  }

  return StyleSheet.create(scaled as T);
}
