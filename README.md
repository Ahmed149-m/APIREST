# TP2 Patient App - Spring Boot + Expo React Native

This project implements the TP requirement: a secured REST API with JWT and a mobile app that consumes it.

## Stack

- Backend: Spring Boot 3.5.14, Spring Security, Spring MVC REST, Spring Data JPA, H2, JWT
- Frontend: Expo SDK 55, React Native 0.83, TypeScript, Axios, Expo SecureStore
- Entity: Patient

## Default credentials

```txt
username: admin
password: admin123
```

## Backend endpoints

| Method | Endpoint | Security | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Returns JWT token |
| GET | `/api/patients` | Bearer token | List patients |
| GET | `/api/patients/{id}` | Bearer token | Get one patient |
| POST | `/api/patients` | Bearer token | Create patient |
| PUT | `/api/patients/{id}` | Bearer token | Update patient |
| DELETE | `/api/patients/{id}` | Bearer token | Delete patient |

## Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API runs at:

```txt
http://localhost:8080
```

H2 console:

```txt
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:patientsdb
User: sa
Password: empty
```

## Test with curl or Postman

Login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Use the returned token:

```bash
curl http://localhost:8080/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Create patient:

```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"firstName":"Amine","lastName":"Karim","email":"amine@example.com","phone":"0611111111","age":35,"diagnosis":"Contrôle"}'
```

## Run the mobile app

```bash
cd frontend
npm install
npx expo start
```

### Backend URL for Expo

By default, the frontend uses:

```txt
http://10.0.2.2:8080
```

This works for the Android emulator. For a physical phone, use your computer LAN IP:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.10:8080 npx expo start
```

For iOS simulator, you can usually use:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080 npx expo start
```

## Project structure

```txt
patient-tp-app/
  backend/
    src/main/java/com/example/patientapi/
      auth/          JWT login, JWT generation, JWT filter
      config/        Security configuration and seed data
      patient/       Patient entity, repository, REST controller
  frontend/
    App.tsx
    src/
      api/           Axios client + patient service
      auth/          JWT session context using SecureStore
      screens/       Login, patient list, patient form
      types/         Patient TypeScript type
```

## How the request cycle works

1. The user enters `admin/admin123` in the mobile app.
2. The app sends `POST /api/auth/login`.
3. Spring Security authenticates the user and `JwtService` generates a JWT.
4. The app stores the JWT in `expo-secure-store`.
5. For each CRUD request, Axios adds `Authorization: Bearer <token>`.
6. `JwtAuthenticationFilter` validates the JWT before the request reaches `PatientController`.
7. `PatientController` performs the CRUD operation through `PatientRepository`.
8. The backend returns JSON, and the mobile UI refreshes the patient list.

## Notes for the technical report

You can explain these parts personally in your own words:

- Why JWT is used: it lets the client prove authentication without sending the password every time.
- Why Spring Security is used: it protects the patient endpoints and only leaves `/api/auth/login` public.
- Why SecureStore is used: it stores the JWT more safely than normal memory or plain AsyncStorage.
- Why Axios interceptor is used: it automatically adds the JWT header to every protected request.
- Why H2 is used: it makes the TP easy to run without installing MySQL or PostgreSQL.

## Important security note

The JWT secret and in-memory user are simplified for a TP. In a real application, store users in a database, keep secrets in environment variables, use HTTPS, and never hard-code credentials.
