package com.backend.AptBe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.AptBe.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import com.backend.AptBe.model.User;

@RestController
@RequestMapping("/backend/user")
public class UserController {
    @Autowired
    private UserService userService;

  @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user)
    {
        if(userService.doesEmailExist(user.getEmail()))
        {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setPassword(userService.encodePassword(user.getPassword()));
        userService.signUp(user);
        return ResponseEntity.ok("User added successfully");
    }
    
}
