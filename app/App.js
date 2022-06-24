import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Welcome from './src/containers/Welcome';
import Settings from './src/containers/Settings';
import Home from './src/containers/Home';
import Send from './src/containers/Send';
import Receive from './src/containers/Receive';
import TopUp from './src/containers/TopUp';
import AppContext from './AppContext';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

export default App = () => {
  const [isSignedIn, setSignedIn] = useState(false);

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    try {
      const account = await SecureStore.getItemAsync('account');
      console.log({ account });
      if (account !== null) {
        setSignedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Welcome checkWallet={checkWallet} />
      </View>
    );
  }

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="HomeScreen"
          component={Home}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="TopUp"
          component={TopUp}
          options={{ title: 'Top Up' }}
        />
      </HomeStack.Navigator>
    );
  }

  const theme = {
    ...DarkTheme
  };

  return (
    <AppContext.Provider value={{ setSignedIn }}>
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'ios-home' : 'ios-home-outline';
              } else if (route.name === 'Send') {
                iconName = focused ? 'ios-send' : 'ios-send-outline';
              } else if (route.name === 'Receive') {
                iconName = focused ? 'ios-wallet' : 'ios-wallet-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'md-settings' : 'md-settings-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#bc7bcb',
            tabBarInactiveTintColor: 'gray'
          })}
          tabBarStyle={styles.tabBar}
        >
          <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Send" component={Send} />
          <Tab.Screen name="Receive" component={Receive} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    backgroundColor: '#000'
  }
});
