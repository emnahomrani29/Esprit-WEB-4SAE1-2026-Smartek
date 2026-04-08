package com.smartek.event.controller;

import com.smartek.event.dto.EventParticipantDTO;
import com.smartek.event.entity.ParticipantStatus;
import com.smartek.event.service.EventParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventParticipantController {

    private final EventParticipantService participantService;

    @PostMapping("/{eventId}/register")
    public ResponseEntity<EventParticipantDTO> registerForEvent(
            @PathVariable Long eventId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId == null) userId = "anonymous";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(participantService.registerParticipant(eventId, userId));
    }

    @DeleteMapping("/{eventId}/cancel")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long eventId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId == null) return ResponseEntity.badRequest().build();
        participantService.cancelRegistration(eventId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<EventParticipantDTO>> getEventParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(participantService.getEventParticipants(eventId));
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<List<EventParticipantDTO>> getMyRegistrations(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(participantService.getUserEvents(userId));
    }

    @PatchMapping("/{eventId}/participants/{userId}/status")
    public ResponseEntity<EventParticipantDTO> updateParticipantStatus(
            @PathVariable Long eventId,
            @PathVariable String userId,
            @RequestParam ParticipantStatus status) {
        return ResponseEntity.ok(participantService.updateParticipantStatus(eventId, userId, status));
    }
}
