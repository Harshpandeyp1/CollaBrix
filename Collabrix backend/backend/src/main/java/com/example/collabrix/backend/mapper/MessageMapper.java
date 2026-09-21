package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Message.MessageResponseDto;
import com.example.collabrix.backend.Entity.MessageEntity;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    public MessageResponseDto toDto(MessageEntity message) {

        if (message == null) {
            return null;
        }

        return MessageResponseDto.builder()
                .id(message.getId())

                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .senderProfileImage(message.getSender().getProfileImage())

                .receiverId(message.getReceiver().getId())
                .receiverUsername(message.getReceiver().getUsername())
                .receiverProfileImage(message.getReceiver().getProfileImage())

                .content(message.getContent())
                .createdAt(message.getCreatedAt())

                .build();
    }

    public java.util.List<MessageResponseDto> toDtoList(java.util.List<MessageEntity> messages) {

        if (messages == null) {
            return null;
        }

        return messages.stream()
                .map(this::toDto)
                .toList();
    }

}
