import React from 'react';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useColorScheme, View, TouchableOpacity, Platform, StyleSheet as RNStyleSheet } from 'react-native';
import { LayoutDashboard, ListTodo, Plus, BarChart2, Settings } from 'lucide-react-native';

import DashboardScreen from '../screens/HomeScreen';
import HabitsScreen from '../screens/HabitsScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const CustomAddButton = ({ children, onPress }: BottomTabBarButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        android: {
          elevation: 10,
        }
      })
    }}
  >
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#10b981',
        borderWidth: 4,
        borderColor: '#020617', // Match dark bg or use a dynamic color
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = '#10b981'; // emerald-500
  const inactiveColor = isDark ? '#94a3b8' : '#64748b';
  const backgroundColor = isDark ? '#020617' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: {
              elevation: 20,
            }
          })
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <ListTodo size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="CreateHabit"
        component={CreateHabitScreen}
        options={{
          tabBarIcon: () => <Plus size={32} color="#fff" strokeWidth={3} />,
          tabBarButton: (props: BottomTabBarButtonProps) => <CustomAddButton {...props} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <Settings size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
