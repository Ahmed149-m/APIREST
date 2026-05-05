# Patient Management Application

A full-stack patient management system consisting of:
- **Backend**: Spring Boot REST API with JWT authentication
- **Frontend**: React Native (Expo) mobile application

---

## Table of Contents
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Sample Requests](#sample-requests)

---

## Backend Setup

### Prerequisites
- Java 17+
- Maven 3.8+

### Running the Server

```bash
cd backend
mvn spring-boot:run
```

The server starts at `http://localhost:8080`.

- **H2 Console** (in-browser DB viewer): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:patientdb`
  - Username: `sa` / Password: *(empty)*

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app on your mobile device (or Android/iOS simulator)

### Running the App

```bash
cd PatientApp
npm install
npx expo start
```

> **Important**: Edit `src/api/apiClient.js` and set `BASE_URL` to your backend's IP:
> - Android emulator: `http://10.0.2.2:8080`
> - iOS simulator: `http://localhost:8080`
> - Physical device: `http://<your-computer-ip>:8080`

---

## API Documentation

### Authentication Endpoints (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Patient Endpoints (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/{id}` | Get patient by ID |
| POST | `/api/patients` | Create a new patient |
| PUT | `/api/patients/{id}` | Update a patient |
| DELETE | `/api/patients/{id}` | Delete a patient |

---

## Sample Requests

### 1. Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor1",
    "email": "doctor1@hospital.com",
    "password": "secret123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "doctor1"
}
```

---

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor1",
    "password": "secret123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "doctor1"
}
```

---

### 3. Create Patient

```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0100",
    "dateOfBirth": "1985-03-22",
    "address": "456 Oak Ave, Springfield",
    "diagnosis": "Hypertension"
  }'
```

---

### 4. Get All Patients

```bash
curl http://localhost:8080/api/patients \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 5. Get Patient by ID

```bash
curl http://localhost:8080/api/patients/1 \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 6. Update Patient

```bash
curl -X PUT http://localhost:8080/api/patients/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0101",
    "dateOfBirth": "1985-03-22",
    "address": "789 Elm St, Springfield",
    "diagnosis": "Hypertension Stage 2"
  }'
```

---

### 7. Delete Patient

```bash
curl -X DELETE http://localhost:8080/api/patients/1 \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## Project Structure

```
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/example/patientapi/
│   │   ├── config/             # Security & app configuration
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Exception handling
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── security/           # JWT filter & token provider
│   │   └── service/            # Business logic
│   └── src/main/resources/
│       └── application.properties
│
└── PatientApp/                 # React Native (Expo) mobile app
    ├── App.js
    └── src/
        ├── api/                # API client with Axios + SecureStore
        ├── navigation/         # React Navigation setup
        └── screens/            # Login, Register, PatientsList, PatientForm
```

## Architecture

### Backend
- **Spring Boot 3.2** – REST API framework
- **Spring Security** – Stateless JWT authentication
- **Spring Data JPA** – Data access layer
- **H2** – In-memory database (for development)
- **JJWT 0.11.5** – JWT token library
- **Lombok** – Boilerplate reduction

### Frontend
- **React Native + Expo** – Cross-platform mobile framework
- **Expo SecureStore** – Encrypted token storage
- **Axios** – HTTP client with JWT interceptor
- **React Navigation** – Screen navigation
