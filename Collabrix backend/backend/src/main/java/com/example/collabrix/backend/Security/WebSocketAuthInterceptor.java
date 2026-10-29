package com.example.collabrix.backend.Security;

import com.example.collabrix.backend.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailService customUserDetailService;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        // Use the accessor already associated with this message. Wrapping the
        // message creates a detached accessor, so changes such as setUser(...)
        // would not be stored in the STOMP/WebSocket session.
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        System.out.println(
                "STOMP COMMAND = " + accessor.getCommand()
        );

        // Authenticate only when client connects
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            System.out.println(
                    "WEBSOCKET AUTH HEADER = " + authHeader
            );

            if (authHeader == null ||
                    !authHeader.startsWith("Bearer ")) {

                throw new IllegalArgumentException(
                        "Missing or invalid Authorization header"
                );
            }

            String jwt =
                    authHeader.substring(7);

            String email =
                    jwtService.extractEmail(jwt);

            System.out.println(
                    "WEBSOCKET USER = " + email
            );

            UserDetails userDetails =
                    customUserDetailService
                            .loadUserByUsername(email);

            if (!jwtService.isTokenValid(
                    jwt,
                    userDetails.getUsername()
            )) {

                throw new IllegalArgumentException(
                        "Invalid or expired JWT"
                );
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            /*
             * Attach authenticated user to the WebSocket session
             */
            accessor.setUser(authentication);

            System.out.println(
                    "WEBSOCKET AUTHENTICATION SET = "
                            + authentication.getName()
            );
        }

        return message;
    }
}
