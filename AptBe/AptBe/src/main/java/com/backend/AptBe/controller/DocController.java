package com.backend.AptBe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.AptBe.service.UserService;


import com.backend.AptBe.token.Token;

import com.backend.AptBe.service.DocService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import com.backend.AptBe.model.User;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/backend/documents")
public class DocController {
    @Autowired
    private UserService userService;
    @Autowired
    private DocService docService;


    @PostMapping("/newDocument")
    public ResponseEntity<?> addDoc(@RequestHeader("Authorization") String token, @RequestBody String docName)
    {
        if(userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        Token tokenInst = new Token();
        String tokenTmp = tokenInst.getIdFromToken(token);
        User user = userService.getUserById(tokenTmp).get();
        if(user == null)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        if(docService.addDoc(user, docName) != null)
        {
            return ResponseEntity.ok().body("Doc added successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc could not be added");
        }
    }


    @PostMapping("/shareView/{docId}")
    public ResponseEntity<?> shareView (@PathVariable String docId, @RequestHeader("Authorization") String token, @RequestBody String email)
    {
        if(userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        User user = userService.getUserByEmail(email).get();
        if(user == null)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        if(docService.shareView(docId, user))
        {
            return ResponseEntity.ok().body("Doc shared successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc could not be shared");
        }
    }

    @PostMapping("/shareEdit/{docId}")
    public ResponseEntity<?> shareEdit (@PathVariable String docId, @RequestHeader("Authorization") String token, @RequestBody String email)
    {
        if(userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        User user = userService.getUserByEmail(email).get();
        if(user == null)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        if(docService.shareEdit(docId, user))
        {
            return ResponseEntity.ok().body("Doc shared successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc could not be shared");
        }
    }


    @GetMapping("/{sortParam}")
    public ResponseEntity<?> getDocs(@RequestHeader("Authorization") String token, @PathVariable String sortParam)
    {
        if(userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        Token tokenInst = new Token();
        String tokenTmp = tokenInst.getIdFromToken(token);
        User user = userService.getUserById(tokenTmp).get();
        if(user == null)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        return ResponseEntity.ok().body(docService.getDocs(user, sortParam));
    }


    @PostMapping("/delete")
    public ResponseEntity<?> deleteDoc(@RequestHeader("Authorization") String token, @RequestBody String docId)
    {
        if(userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        
        if(docService.removeDoc(docId))
        {
            return ResponseEntity.ok().body("Doc deleted successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc could not be deleted");
        }
    }


    
}
