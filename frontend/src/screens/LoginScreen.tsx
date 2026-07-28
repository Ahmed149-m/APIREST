import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation', 'Username et mot de passe sont obligatoires.');
      return;
    }

    try {
      setSubmitting(true);
      await signIn(username.trim(), password);
    } catch (error) {
      Alert.alert('Login failed', 'Check the backend URL, username and password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>+</Text>
        </View>
        <Text style={styles.appName}>Patients App</Text>
        <Text style={styles.appSubtitle}>Gestion des patients sécurisée par JWT</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Connectez-vous pour accéder aux patients</Text>

        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#9ca3af"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            submitting && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef4ff',
    justifyContent: 'center',
    padding: 22,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    elevation: 6,
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  logoText: {
    color: 'white',
    fontSize: 42,
    fontWeight: '800',
    marginTop: -4,
  },

  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
  },

  appSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 15,
    fontSize: 16,
    color: '#111827',
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },

  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },

  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 13,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },

  infoTitle: {
    color: '#1e40af',
    fontWeight: '800',
    marginBottom: 3,
  },

  infoText: {
    color: '#374151',
    fontWeight: '600',
  },

  footer: {
    marginTop: 22,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
});