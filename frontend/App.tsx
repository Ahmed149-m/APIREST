import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import PatientListScreen from './src/screens/PatientListScreen';
import PatientFormScreen from './src/screens/PatientFormScreen';
import { Patient } from './src/types/Patient';

type Screen = 'list' | 'create' | 'edit';

function Root() {
  const { token, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  if (!token) return <LoginScreen />;

  if (screen === 'create') {
    return <PatientFormScreen onCancel={() => setScreen('list')} onSaved={() => setScreen('list')} />;
  }

  if (screen === 'edit') {
    return <PatientFormScreen patient={selectedPatient} onCancel={() => setScreen('list')} onSaved={() => setScreen('list')} />;
  }

  return (
    <PatientListScreen
      onCreate={() => setScreen('create')}
      onEdit={(patient) => { setSelectedPatient(patient); setScreen('edit'); }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
