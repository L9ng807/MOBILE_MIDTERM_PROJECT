import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type AppIconName = 'activity' | 'brain' | 'chart' | 'cpu' | 'settings' | 'server' | 'bolt' | 'wifi';

export default function AppIcon({ name, color = '#F5F8FF', size = 22 }: { name: AppIconName; color?: string; size?: number }) {
  const stroke = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'activity' && <Path {...stroke} d="M3 12h4l2.2-6 4.1 12 2.2-6H21" />}
      {name === 'brain' && <><Circle {...stroke} cx="9" cy="8" r="3" /><Circle {...stroke} cx="15" cy="8" r="3" /><Circle {...stroke} cx="8" cy="15" r="3" /><Circle {...stroke} cx="16" cy="15" r="3" /><Path {...stroke} d="M11.5 8h1M9.5 10.5l-1 1.8m6-1.8 1 1.8M11 15h2" /></>}
      {name === 'chart' && <><Path {...stroke} d="M4 19V5m0 14h16" /><Path {...stroke} d="m7 15 3-4 3 2 5-6" /></>}
      {name === 'cpu' && <><Rect {...stroke} x="6" y="6" width="12" height="12" rx="2" /><Rect {...stroke} x="10" y="10" width="4" height="4" rx=".5" />{[8, 12, 16].map((v) => <Path key={v} {...stroke} d={`M${v} 3v3M${v} 18v3M3 ${v}h3M18 ${v}h3`} />)}</>}
      {name === 'settings' && <><Circle {...stroke} cx="12" cy="12" r="3" /><Path {...stroke} d="M19 13.5v-3l-2-.6a5 5 0 0 0-.5-1.1l1-1.8-2.1-2.1-1.8 1.1a5 5 0 0 0-1.1-.5L12 3H9l-.6 2a5 5 0 0 0-1.1.5L5.5 4.4 3.4 6.5l1.1 1.8A5 5 0 0 0 4 9.5l-2 .5v3l2 .6a5 5 0 0 0 .5 1.1l-1.1 1.8 2.1 2.1 1.8-1.1a5 5 0 0 0 1.1.5l.6 2h3l.6-2a5 5 0 0 0 1.1-.5l1.8 1.1 2.1-2.1-1.1-1.8a5 5 0 0 0 .5-1.1l2-.6Z" /></>}
      {name === 'server' && <><Rect {...stroke} x="4" y="4" width="16" height="6" rx="1" /><Rect {...stroke} x="4" y="14" width="16" height="6" rx="1" /><Circle fill={color} cx="7" cy="7" r="1" /><Circle fill={color} cx="7" cy="17" r="1" /></>}
      {name === 'bolt' && <Path {...stroke} d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z" />}
      {name === 'wifi' && <><Path {...stroke} d="M3.5 9.5a12 12 0 0 1 17 0M6.5 12.5a8 8 0 0 1 11 0M9.5 15.5a4 4 0 0 1 5 0" /><Circle fill={color} cx="12" cy="19" r="1.3" /></>}
    </Svg>
  );
}
