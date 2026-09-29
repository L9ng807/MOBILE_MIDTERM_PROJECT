export const colors = {
  background: '#090E1A',
  surface: '#121A2A',
  surfaceElevated: '#18233A',
  border: '#263550',
  text: '#F5F8FF',
  textMuted: '#91A1BD',
  primary: '#5B8CFF',
  primarySoft: '#1D3565',
  cyan: '#42D9F5',
  success: '#31D18B',
  warning: '#FFB347',
  danger: '#FF6577',
};

export const navigationTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};
import { DarkTheme } from '@react-navigation/native';
