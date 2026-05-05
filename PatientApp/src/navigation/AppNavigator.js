import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getToken } from '../api/apiClient';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PatientsListScreen from '../screens/PatientsListScreen';
import PatientFormScreen from '../screens/PatientFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'PatientsList' : 'Login'}
      screenOptions={{ headerStyle: { backgroundColor: '#2196F3' }, headerTintColor: '#fff' }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login', headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="PatientsList"
        component={PatientsListScreen}
        options={{ title: 'Patients', headerBackVisible: false }}
      />
      <Stack.Screen
        name="PatientForm"
        component={PatientFormScreen}
        options={({ route }) => ({
          title: route.params?.patient ? 'Edit Patient' : 'Add Patient',
        })}
      />
    </Stack.Navigator>
  );
}
