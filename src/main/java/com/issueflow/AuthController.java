package com.issueflow;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.origins}")
public class AuthController {

    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository users) {
        this.users = users;
    }

    public record RegisterRequest(String name, String email, String password) {}
    public record LoginRequest(String email, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (req.name() == null || req.name().trim().isEmpty()
                || req.email() == null || req.email().trim().isEmpty()
                || req.password() == null || req.password().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Name, email aur 6+ character ka password zaroori hai."));
        }

        String email = req.email().trim().toLowerCase();
        if (users.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ye email pehle se registered hai."));
        }

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(req.password()));
        user.setToken(UUID.randomUUID().toString());
        users.save(user);

        return ResponseEntity.ok(Map.of(
                "token", user.getToken(),
                "name", user.getName(),
                "email", user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String email = req.email() == null ? "" : req.email().trim().toLowerCase();
        User user = users.findByEmail(email).orElse(null);

        if (user == null || req.password() == null
                || !encoder.matches(req.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Email ya password galat hai."));
        }

        user.setToken(UUID.randomUUID().toString());
        users.save(user);

        return ResponseEntity.ok(Map.of(
                "token", user.getToken(),
                "name", user.getName(),
                "email", user.getEmail()));
    }
}