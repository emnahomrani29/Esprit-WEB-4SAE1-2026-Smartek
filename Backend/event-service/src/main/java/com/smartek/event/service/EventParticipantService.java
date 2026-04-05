package com.smartek.event.service;

import com.smartek.event.dto.EventParticipantDTO;
import com.smartek.event.entity.Event;
import com.smartek.event.entity.EventParticipant;
import com.smartek.event.entity.ParticipantStatus;
import com.smartek.event.repository.EventParticipantRepository;
import com.smartek.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventParticipantService {

    private final EventParticipantRepository participantRepository;
    private final EventRepository eventRepository;

    @Transactional
    public EventParticipantDTO registerParticipant(Long eventId, String userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        if (participantRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new RuntimeException("User already registered for this event");
        }
        
        if (event.getMaxParticipants() != null && 
            event.getCurrentParticipants() >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }
        
        EventParticipant participant = new EventParticipant();
        participant.setEventId(eventId);
        participant.setUserId(userId);
        participant.setStatus(ParticipantStatus.REGISTERED);
        
        EventParticipant savedParticipant = participantRepository.save(participant);
        
        event.setCurrentParticipants(event.getCurrentParticipants() + 1);
        eventRepository.save(event);
        
        log.info("User {} registered for event {}", userId, eventId);
        
        return mapToDTO(savedParticipant);
    }

    @Transactional
    public void cancelRegistration(Long eventId, String userId) {
        EventParticipant participant = participantRepository.findByEventIdAndUserId(eventId, userId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        participantRepository.delete(participant);
        
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setCurrentParticipants(Math.max(0, event.getCurrentParticipants() - 1));
        eventRepository.save(event);
        
        log.info("User {} cancelled registration for event {}", userId, eventId);
    }

    public List<EventParticipantDTO> getEventParticipants(Long eventId) {
        return participantRepository.findByEventId(eventId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<EventParticipantDTO> getUserEvents(String userId) {
        return participantRepository.findByUserId(userId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public EventParticipantDTO updateParticipantStatus(Long eventId, String userId, ParticipantStatus status) {
        EventParticipant participant = participantRepository.findByEventIdAndUserId(eventId, userId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        participant.setStatus(status);
        EventParticipant updatedParticipant = participantRepository.save(participant);
        
        return mapToDTO(updatedParticipant);
    }

    private EventParticipantDTO mapToDTO(EventParticipant participant) {
        EventParticipantDTO dto = new EventParticipantDTO();
        dto.setId(participant.getId());
        dto.setEventId(participant.getEventId());
        dto.setUserId(participant.getUserId());
        dto.setStatus(participant.getStatus());
        dto.setRegisteredAt(participant.getRegisteredAt());
        return dto;
    }
}
