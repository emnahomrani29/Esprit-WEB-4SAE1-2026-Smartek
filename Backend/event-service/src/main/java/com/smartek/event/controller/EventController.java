package com.smartek.event.controller;

import com.smartek.event.dto.EventDTO;
import com.smartek.event.entity.EventStatus;
import com.smartek.event.entity.EventType;
import com.smartek.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(
            @Valid @RequestBody EventDTO eventDTO,
            @RequestHeader(value = "X-User-Id", required = false) String organizerId) {
        if (organizerId == null) organizerId = "anonymous";
        EventDTO createdEvent = eventService.createEvent(eventDTO, organizerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/public/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/organizer/my-events")
    public ResponseEntity<List<EventDTO>> getMyEvents(
            @RequestHeader(value = "X-User-Id", required = false) String organizerId) {
        if (organizerId == null) return ResponseEntity.ok(eventService.getAllEvents());
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId));
    }

    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<EventDTO>> getEventsByType(@PathVariable EventType eventType) {
        return ResponseEntity.ok(eventService.getEventsByType(eventType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id,
                                                 @Valid @RequestBody EventDTO eventDTO) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateEventStatus(@PathVariable Long id,
                                                       @RequestParam EventStatus status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
