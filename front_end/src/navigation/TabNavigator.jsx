// src/navigation/TabNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from "../styles/colors";

// ✅ Lazy Loading - Les screens sont chargés uniquement quand nécessaires
const HomeScreen = React.lazy(() => import("../screens/HomeScreen"));
const HistoryScreen = React.lazy(() => import("../screens/HistoryScreen"));
const TrackingScreen = React.lazy(() => import("../screens/TrackingScreen"));
const ProfileScreen = React.lazy(() => import("../screens/ProfileScreen"));

// Composant de chargement
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarStyle: {
            backgroundColor: "#1a1a2e",
            borderTopColor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "time" : "time-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Track" 
          component={TrackingScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "play-circle" : "play-circle-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </React.Suspense>
  );
};

export default TabNavigator;