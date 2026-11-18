package com.example.collabrix.backend.Dto.Message;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageDto {

    private Long receiverId;

    private String content;
}