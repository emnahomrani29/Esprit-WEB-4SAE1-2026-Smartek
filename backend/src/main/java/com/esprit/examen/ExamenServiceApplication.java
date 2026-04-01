package com.esprit.examen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Point d'entrée principal du microservice Gestion des Examens.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ExamenServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExamenServiceApplication.class, args);
    }
}
