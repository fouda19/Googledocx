package com.backend.AptBe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.AptBe.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
        String token = userService.signUp(user);
        System.out.println(token);
        System.out.println("ANAAA");
        if(token != null)
        {
            
            return ResponseEntity.ok()
                    .header("Authorization", token)
                    .body("User added successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("User could not be added");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user)
    {
        
                System.out.println("ANAAA");
                String token = userService.logIn(user);
                if(token != null)
                {
                    return ResponseEntity.ok()
                            .header("Authorization", token)
                            .body("User logged in successfully");
                }
                else
                {
                    return ResponseEntity.badRequest().body("User could not be logged in please check your credentials");
                }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value="Authorization") String token)
    {
        if (userService.logOut(token))
        {
            return ResponseEntity.ok().body("User logged out successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("User could not log out");
        }
    }
    
    
}
