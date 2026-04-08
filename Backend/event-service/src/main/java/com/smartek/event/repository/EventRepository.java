package com.smartek.event.repository;

import com.smartek.event.entity.Event;
import com.smartek.event.entity.EventStatus;
import com.smartek.event.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByOrganizerId(String organizerId);
    
    List<Event> findByStatus(EventStatus status);
    
    List<Event> findByEventType(EventType eventType);
    
    List<Event> findByStartDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT e FROM Event e WHERE e.startDate >= :now ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(LocalDateTime now);
    
    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.startDate >= :now")
    List<Event> findByStatusAndUpcoming(EventStatus status, LocalDateTime now);
}
