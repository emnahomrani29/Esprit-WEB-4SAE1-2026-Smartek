package com.smartek.event.dto;

import com.smartek.event.entity.ParticipantStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantDTO {
    
    private Long id;
    private Long eventId;
    private String userId;
    private ParticipantStatus status;
    private LocalDateTime registeredAt;
}
