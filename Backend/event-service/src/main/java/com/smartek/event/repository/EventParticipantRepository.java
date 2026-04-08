package com.smartek.event.repository;

import com.smartek.event.entity.EventParticipant;
import com.smartek.event.entity.ParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
    List<EventParticipant> findByEventId(Long eventId);
    
    List<EventParticipant> findByUserId(String userId);
    
    Optional<EventParticipant> findByEventIdAndUserId(Long eventId, String userId);
    
    List<EventParticipant> findByEventIdAndStatus(Long eventId, ParticipantStatus status);
    
    long countByEventIdAndStatus(Long eventId, ParticipantStatus status);
    
    boolean existsByEventIdAndUserId(Long eventId, String userId);
}
