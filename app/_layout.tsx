import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="modals/create-task"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Nouvelle tâche',
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </>
  );
}
