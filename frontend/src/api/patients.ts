import { api } from './client';
import { Patient } from '../types/Patient';

export async function getPatients() {
  const response = await api.get<Patient[]>('/patients');
  return response.data;
}

export async function createPatient(patient: Patient) {
  const response = await api.post<Patient>('/patients', patient);
  return response.data;
}

export async function updatePatient(id: number, patient: Patient) {
  const response = await api.put<Patient>(`/patients/${id}`, patient);
  return response.data;
}

export async function deletePatient(id: number) {
  await api.delete(`/patients/${id}`);
}
