package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// TEMPORARY. Delete this file when Step 1 passes.
@RestController
@RequestMapping("/api/dev")
public class DevMailController {

    private final EmailService emailService;

    public DevMailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // The recipient is HARD-CODED. If this took an address from the URL, anyone logged in
    // could use your server to send mail to strangers. (We use GET only because this is a
    // throwaway so you can open it in a browser. Real actions use POST.)
    @GetMapping("/test-email")
    public String testEmail() {
        emailService.send("test@collabrix.local", "Mailpit test", "If you can read this, email works.");
        return "sent";
    }
}