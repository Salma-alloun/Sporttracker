// src/navigation/DrawerNavigator.jsx
import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "../styles/colors";

const TabNavigator = React.lazy(() => import("./TabNavigator"));
const ProfileScreen = React.lazy(() => import("../screens/ProfileScreen"));
const HistoryScreen = React.lazy(() => import("../screens/HistoryScreen"));
const TrackingScreen = React.lazy(() => import("../screens/TrackingScreen"));

const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.cardBg,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            width: 280,
            backgroundColor: COLORS.cardBg,
          },
          drawerLabelStyle: {
            fontSize: 16,
            color: COLORS.text,
          },
          drawerActiveTintColor: COLORS.primary,
          drawerActiveBackgroundColor: `${COLORS.primary}20`,
          drawerInactiveTintColor: COLORS.muted,
        }}
      >
        {/* ✅ Renommé de "Home" à "Dashboard" pour éviter la confusion */}
        <Drawer.Screen 
          name="Dashboard" 
          component={TabNavigator} 
          options={{
            title: 'Accueil',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{
            title: 'Historique',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "time" : "time-outline"} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Track" 
          component={TrackingScreen} 
          options={{
            title: 'Suivi GPS',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            title: 'Mon Profil',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </React.Suspense>
  );
};

export default DrawerNavigator;