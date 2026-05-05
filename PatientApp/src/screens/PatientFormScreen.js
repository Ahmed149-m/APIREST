import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { patientsAPI } from '../api/apiClient';

export default function PatientFormScreen({ route, navigation }) {
  const existingPatient = route.params?.patient;
  const isEditing = !!existingPatient;

  const [firstName, setFirstName] = useState(existingPatient?.firstName || '');
  const [lastName, setLastName] = useState(existingPatient?.lastName || '');
  const [email, setEmail] = useState(existingPatient?.email || '');
  const [phone, setPhone] = useState(existingPatient?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(existingPatient?.dateOfBirth || '');
  const [address, setAddress] = useState(existingPatient?.address || '');
  const [diagnosis, setDiagnosis] = useState(existingPatient?.diagnosis || '');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!firstName.trim()) { Alert.alert('Error', 'First name is required'); return false; }
    if (!lastName.trim()) { Alert.alert('Error', 'Last name is required'); return false; }
    if (!email.trim()) { Alert.alert('Error', 'Email is required'); return false; }
    if (!phone.trim()) { Alert.alert('Error', 'Phone number is required'); return false; }
    if (!dateOfBirth.trim()) { Alert.alert('Error', 'Date of birth is required (YYYY-MM-DD)'); return false; }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) {
      Alert.alert('Error', 'Date of birth must be in YYYY-MM-DD format');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    const data = { firstName, lastName, email, phone, dateOfBirth, address, diagnosis };

    try {
      if (isEditing) {
        await patientsAPI.update(existingPatient.id, data);
        Alert.alert('Success', 'Patient updated successfully');
      } else {
        await patientsAPI.create(data);
        Alert.alert('Success', 'Patient created successfully');
      }
      navigation.goBack();
    } catch (error) {
      const responseData = error.response?.data;
      let message = isEditing ? 'Failed to update patient.' : 'Failed to create patient.';
      if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.details) {
        message = Object.values(responseData.details).join('\n');
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <FormField label="First Name *" value={firstName} onChange={setFirstName} placeholder="John" />
          <FormField label="Last Name *" value={lastName} onChange={setLastName} placeholder="Doe" />
          <FormField
            label="Email *"
            value={email}
            onChange={setEmail}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label="Phone *"
            value={phone}
            onChange={setPhone}
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
          />
          <FormField
            label="Date of Birth * (YYYY-MM-DD)"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            placeholder="1990-01-15"
          />
          <FormField label="Address" value={address} onChange={setAddress} placeholder="123 Main St, City" />
          <FormField label="Diagnosis" value={diagnosis} onChange={setDiagnosis} placeholder="e.g. Hypertension" />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isEditing ? 'Update Patient' : 'Add Patient'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, value, onChange, placeholder, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'words'}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
