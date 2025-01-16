import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="landing" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="homepage" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="level1" options={{ headerShown: false }} />
      <Stack.Screen name="level1quiz" options={{ headerShown: false }} />
      <Stack.Screen name="level2" options={{ headerShown: false }} />
      <Stack.Screen name="level2quiz" options={{ headerShown: false }} />
      <Stack.Screen name="level3" options={{ headerShown: false }} />
      <Stack.Screen name="level3quiz" options={{ headerShown: false }} />
      <Stack.Screen name="level4" options={{ headerShown: false }} />
      <Stack.Screen name="level4quiz" options={{ headerShown: false }} />
      <Stack.Screen name="level5" options={{ headerShown: false }} />
      <Stack.Screen name="level5quiz" options={{ headerShown: false }} />
      <Stack.Screen name="level6" options={{ headerShown: false }} />
      <Stack.Screen name="level6quiz" options={{ headerShown: false }} />
    </Stack>
  );
}
