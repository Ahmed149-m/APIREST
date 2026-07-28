package com.example.patientapi.config;

import com.example.patientapi.patient.Patient;
import com.example.patientapi.patient.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedPatients(PatientRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Patient("Sara", "Benali", "sara.benali@example.com", "0600000001", 28, "Consultation générale"));
                repository.save(new Patient("Youssef", "Alaoui", "youssef.alaoui@example.com", "0600000002", 42, "Suivi tension"));
            }
        };
    }
}
