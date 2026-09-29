import { Text, TextInput } from 'react-native';

import RootNavigator from './src/navigation/RootNavigator';

const textDefaults = Text as typeof Text & {
  defaultProps?: {
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };
};

const inputDefaults = TextInput as typeof TextInput & {
  defaultProps?: {
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };
};

textDefaults.defaultProps = {
  ...textDefaults.defaultProps,
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.2,
};

inputDefaults.defaultProps = {
  ...inputDefaults.defaultProps,
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.2,
};

export default function App() {
  return <RootNavigator />;
}
