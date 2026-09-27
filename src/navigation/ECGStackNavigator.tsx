import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import ECGInputScreen from '../screens/ECGInputScreen';
import ECGViewerScreen from '../screens/ECGViewerScreen';

import type {
  ECGStackParamList,
} from '../types/navigation';

const Stack =
  createNativeStackNavigator<ECGStackParamList>();

export default function ECGStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ECGInput"
    >
      <Stack.Screen
        name="ECGInput"
        component={
          ECGInputScreen
        }
        options={{
          title: 'ECG Data',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ECGViewer"
        component={
          ECGViewerScreen
        }
        options={{
          title: 'ECG Viewer',
        }}
      />
    </Stack.Navigator>
  );
}