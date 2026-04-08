package com.smartek.event.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthProxyController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String KEYCLOAK_TOKEN_URL = "http://localhost:8180/realms/smartek-realm2/protocol/openid-connect/token";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            log.info("Login attempt for user: {}", loginRequest.get("email"));
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", "postman-client");
            body.add("username", loginRequest.get("email")); // email field contains username
            body.add("password", loginRequest.get("password"));

            log.info("Sending request to Keycloak: {}", KEYCLOAK_TOKEN_URL);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(KEYCLOAK_TOKEN_URL, request, Map.class);
            
            log.info("Login successful for user: {}", loginRequest.get("email"));
            return ResponseEntity.ok(response.getBody());
        } catch (HttpClientErrorException e) {
            log.error("Keycloak authentication failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of(
                    "error", "Authentication failed", 
                    "message", e.getResponseBodyAsString(),
                    "keycloakUrl", KEYCLOAK_TOKEN_URL
                ));
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Internal server error", 
                    "message", e.getMessage(),
                    "keycloakUrl", KEYCLOAK_TOKEN_URL
                ));
        }
    }
}
