package com.smartek.event.service;

import com.smartek.event.dto.EventDTO;
import com.smartek.event.entity.Event;
import com.smartek.event.entity.EventStatus;
import com.smartek.event.entity.EventType;
import com.smartek.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;

    @Transactional
    public EventDTO createEvent(EventDTO eventDTO, String organizerId) {
        Event event = mapToEntity(eventDTO);
        event.setOrganizerId(organizerId);
        event.setStatus(EventStatus.SCHEDULED);
        event.setCurrentParticipants(0);
        
        Event savedEvent = eventRepository.save(event);
        log.info("Event created with ID: {}", savedEvent.getId());
        
        return mapToDTO(savedEvent);
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return mapToDTO(event);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByOrganizer(String organizerId) {
        return eventRepository.findByOrganizerId(organizerId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now()).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByType(EventType eventType) {
        return eventRepository.findByEventType(eventType).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setLocation(eventDTO.getLocation());
        event.setEventType(eventDTO.getEventType());
        event.setMaxParticipants(eventDTO.getMaxParticipants());
        
        if (eventDTO.getStatus() != null) {
            event.setStatus(eventDTO.getStatus());
        }
        
        Event updatedEvent = eventRepository.save(event);
        log.info("Event updated with ID: {}", updatedEvent.getId());
        
        return mapToDTO(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
        log.info("Event deleted with ID: {}", id);
    }

    @Transactional
    public EventDTO updateEventStatus(Long id, EventStatus status) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setStatus(status);
        Event updatedEvent = eventRepository.save(event);
        
        return mapToDTO(updatedEvent);
    }

    private EventDTO mapToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setLocation(event.getLocation());
        dto.setEventType(event.getEventType());
        dto.setStatus(event.getStatus());
        dto.setOrganizerId(event.getOrganizerId());
        dto.setMaxParticipants(event.getMaxParticipants());
        dto.setCurrentParticipants(event.getCurrentParticipants());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        return dto;
    }

    private Event mapToEntity(EventDTO dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setLocation(dto.getLocation());
        event.setEventType(dto.getEventType());
        event.setMaxParticipants(dto.getMaxParticipants());
        return event;
    }
}
