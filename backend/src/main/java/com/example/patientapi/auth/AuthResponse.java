package com.example.patientapi.auth;

public record AuthResponse(String token, String tokenType, String username) {}
