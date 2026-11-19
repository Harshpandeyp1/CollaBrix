package com.example.collabrix.backend.Dto.auth;



// What React sends to /reset-password: {"token": "...", "newPassword": "..."}
public record ResetPasswordRequest(String token, String newPassword) {

    // A record writes its own toString() that prints EVERY field. If anything ever
    // prints this object (a debug log, an exception message, a framework dump),
    // the plain password and the token would land in the logs. Overriding toString
    // hides them. Cheap insurance for any class that carries a secret.
    @Override
    public String toString() {
        return "ResetPasswordRequest[token=***, newPassword=***]";
    }
}