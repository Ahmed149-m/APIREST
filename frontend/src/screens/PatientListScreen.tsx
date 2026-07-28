import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getPatients, deletePatient } from '../api/patients';
import { Patient } from '../types/Patient';
import { useAuth } from '../auth/AuthContext';

type Props = {
  onCreate: () => void;
  onEdit: (patient: Patient) => void;
};

export default function PatientListScreen({ onCreate, onEdit }: Props) {
  const { signOut, username } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      Alert.alert('Erreur', "Impossible de charger les patients. Vérifiez l'API.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete(patient: Patient) {
    Alert.alert(
      'Supprimer le patient',
      `Voulez-vous vraiment supprimer ${patient.firstName} ${patient.lastName} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!patient.id) return;

              await deletePatient(patient.id);
              await load();
            } catch (error) {
              Alert.alert('Erreur', 'Suppression impossible.');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement des patients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View>
          <Text style={styles.screenTitle}>Patients</Text>
          <Text style={styles.connectedText}>Connecté : {username}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>Déconnexion</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryNumber}>{patients.length}</Text>
          <Text style={styles.summaryLabel}>
            {patients.length > 1 ? 'patients enregistrés' : 'patient enregistré'}
          </Text>
        </View>

        <View style={styles.summaryIcon}>
          <Text style={styles.summaryIconText}>+</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onCreate}
      >
        <Text style={styles.addButtonText}>+ Nouveau patient</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Liste des patients</Text>
        <Text style={styles.sectionSubtitle}>Glissez vers le bas pour actualiser</Text>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={patients.length === 0 && styles.emptyListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🩺</Text>
            <Text style={styles.emptyTitle}>Aucun patient</Text>
            <Text style={styles.emptyText}>
              Ajoutez votre premier patient avec le bouton ci-dessus.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.firstName?.charAt(0)?.toUpperCase()}
                  {item.lastName?.charAt(0)?.toUpperCase()}
                </Text>
              </View>

              <View style={styles.patientInfo}>
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.meta}>
                  {item.age} ans • {item.email || 'Email non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.diagnosisBox}>
              <Text style={styles.diagnosisLabel}>Diagnostic</Text>
              <Text style={styles.diagnosis}>{item.diagnosis}</Text>
            </View>

            {item.phone ? (
              <Text style={styles.phone}>Téléphone : {item.phone}</Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => onEdit(item)}
              >
                <Text style={styles.actionText}>Modifier</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => confirmDelete(item)}
              >
                <Text style={styles.actionText}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 18,
    backgroundColor: '#eef4ff',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef4ff',
  },

  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontWeight: '600',
  },

  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  screenTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
  },

  connectedText: {
    color: '#6b7280',
    marginTop: 3,
    fontWeight: '600',
  },

  logoutButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },

  logoutText: {
    color: '#dc2626',
    fontWeight: '800',
    fontSize: 12,
  },

  summaryCard: {
    backgroundColor: '#2563eb',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  summaryNumber: {
    color: 'white',
    fontSize: 34,
    fontWeight: '900',
  },

  summaryLabel: {
    color: '#dbeafe',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },

  summaryIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIconText: {
    color: 'white',
    fontSize: 34,
    fontWeight: '800',
    marginTop: -2,
  },

  addButton: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#111827',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  addButtonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 15,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },

  sectionSubtitle: {
    color: '#6b7280',
    marginTop: 3,
    fontSize: 13,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 6,
    lineHeight: 20,
  },

  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#1d4ed8',
    fontWeight: '900',
    fontSize: 16,
  },

  patientInfo: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },

  meta: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 13,
  },

  diagnosisBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  diagnosisLabel: {
    color: '#2563eb',
    fontWeight: '900',
    marginBottom: 4,
    fontSize: 12,
    textTransform: 'uppercase',
  },

  diagnosis: {
    color: '#374151',
    lineHeight: 20,
    fontWeight: '600',
  },

  phone: {
    color: '#6b7280',
    marginTop: 10,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  actionText: {
    color: 'white',
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});