// src/navigation/StackNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from "../styles/colors";

const LoginScreen = React.lazy(() => import("../screens/LoginScreen"));
const RegisterScreen = React.lazy(() => import("../screens/RegisterScreen"));
const DrawerNavigator = React.lazy(() => import("./DrawerNavigator"));

const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </React.Suspense>
  );
};

export default StackNavigator;