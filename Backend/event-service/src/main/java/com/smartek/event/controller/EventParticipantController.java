package com.smartek.event.controller;

import com.smartek.event.dto.EventParticipantDTO;
import com.smartek.event.entity.ParticipantStatus;
import com.smartek.event.service.EventParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventParticipantController {

    private final EventParticipantService participantService;

    @PostMapping("/{eventId}/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EventParticipantDTO> registerForEvent(
            @PathVariable Long eventId,
            Authentication authentication) {
        String userId = getUserId(authentication);
        EventParticipantDTO participant = participantService.registerParticipant(eventId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(participant);
    }

    @DeleteMapping("/{eventId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long eventId,
            Authentication authentication) {
        String userId = getUserId(authentication);
        participantService.cancelRegistration(eventId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventId}/participants")
    @PreAuthorize("hasAnyRole('ADMIN', 'FORMATEUR')")
    public ResponseEntity<List<EventParticipantDTO>> getEventParticipants(@PathVariable Long eventId) {
        List<EventParticipantDTO> participants = participantService.getEventParticipants(eventId);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/my-registrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventParticipantDTO>> getMyRegistrations(Authentication authentication) {
        String userId = getUserId(authentication);
        List<EventParticipantDTO> registrations = participantService.getUserEvents(userId);
        return ResponseEntity.ok(registrations);
    }

    @PatchMapping("/{eventId}/participants/{userId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'FORMATEUR')")
    public ResponseEntity<EventParticipantDTO> updateParticipantStatus(
            @PathVariable Long eventId,
            @PathVariable String userId,
            @RequestParam ParticipantStatus status) {
        EventParticipantDTO participant = participantService.updateParticipantStatus(eventId, userId, status);
        return ResponseEntity.ok(participant);
    }

    private String getUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return jwt.getSubject();
    }
}
