package com.smartek.event.dto;

import com.smartek.event.entity.EventStatus;
import com.smartek.event.entity.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;
    
    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Event type is required")
    private EventType eventType;
    
    private EventStatus status;
    
    private String organizerId;
    
    private Integer maxParticipants;
    
    private Integer currentParticipants;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
