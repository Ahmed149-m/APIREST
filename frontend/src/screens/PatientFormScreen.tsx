import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createPatient, updatePatient } from '../api/patients';
import { Patient } from '../types/Patient';

type Props = {
  patient?: Patient | null;
  onCancel: () => void;
  onSaved: () => void;
};

export default function PatientFormScreen({ patient, onCancel, onSaved }: Props) {
  const [form, setForm] = useState<Patient>({
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    email: patient?.email ?? '',
    phone: patient?.phone ?? '',
    age: patient?.age ?? 0,
    diagnosis: patient?.diagnosis ?? '',
  });
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof Patient>(key: K, value: Patient[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!form.firstName || !form.lastName || !form.diagnosis) {
      Alert.alert('Validation', 'Nom, prénom et diagnostic sont obligatoires.');
      return;
    }
    try {
      setSaving(true);
      if (patient?.id) {
        await updatePatient(patient.id, form);
      } else {
        await createPatient(form);
      }
      onSaved();
    } catch (error: any) {
  console.log('SAVE ERROR STATUS:', error.response?.status);
  console.log('SAVE ERROR DATA:', error.response?.data);
  console.log('SAVE ERROR MESSAGE:', error.message);

  Alert.alert(
    'Erreur',
    JSON.stringify(error.response?.data || error.message)
  );
}
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{patient ? 'Modifier patient' : 'Nouveau patient'}</Text>
        <Input label="Prénom" value={form.firstName} onChangeText={(v) => setField('firstName', v)} />
        <Input label="Nom" value={form.lastName} onChangeText={(v) => setField('lastName', v)} />
        <Input label="Email" value={form.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Téléphone" value={form.phone} onChangeText={(v) => setField('phone', v)} keyboardType="phone-pad" />
        <Input label="Âge" value={String(form.age)} onChangeText={(v) => setField('age', Number(v.replace(/[^0-9]/g, '')))} keyboardType="number-pad" />
        <Input label="Diagnostic" value={form.diagnosis} onChangeText={(v) => setField('diagnosis', v)} multiline />
        <Pressable style={styles.saveButton} onPress={save} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InputProps = React.ComponentProps<typeof TextInput> & { label: string };
function Input({ label, ...props }: InputProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, props.multiline && styles.multiline]} placeholder={label} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 54, paddingHorizontal: 18, paddingBottom: 30, backgroundColor: '#f5f7fb' },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 20 },
  group: { marginBottom: 12 },
  label: { color: '#374151', fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 13, fontSize: 16 },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#2563eb', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '800', fontSize: 16 },
  cancelButton: { padding: 15, borderRadius: 12, alignItems: 'center' },
  cancelText: { color: '#374151', fontWeight: '700' },
});
