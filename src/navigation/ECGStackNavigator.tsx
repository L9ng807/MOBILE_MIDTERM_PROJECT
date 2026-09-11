import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ECGInputScreen from '../screens/ECGInputScreen';
import ECGViewerScreen from '../screens/ECGViewerScreen';

const Stack = createNativeStackNavigator();

export default function ECGStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ECGInput"
        component={ECGInputScreen}
        options={{
          title: 'ECG Data',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ECGViewer"
        component={ECGViewerScreen}
        options={{
          title: 'ECG Viewer',
        }}
      />
    </Stack.Navigator>
  );
}