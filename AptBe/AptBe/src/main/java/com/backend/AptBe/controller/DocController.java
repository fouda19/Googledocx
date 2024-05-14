package com.backend.AptBe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.AptBe.service.UserService;
import com.backend.AptBe.model.Doc;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import org.json.JSONObject;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;


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
        System.out.println("Email: "+email);
        email = email.replace("\"", "");
        System.out.println("DocId: "+docId);
        User user = userService.getUserByEmail(email).get();
        if(user == null)
        {
            return ResponseEntity.badRequest().body("User not found");
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
        email = email.replace("\"", "");
        User user = userService.getUserByEmail(email).get();
        if(user == null)
        {
            return ResponseEntity.badRequest().body("User not found");
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
        System.out.println("SortParam: "+sortParam);
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
        List<Doc> docLists = docService.getDocs(user, sortParam);
        List<ObjectNode> result = new ArrayList<>();
        
        ObjectMapper mapper = new ObjectMapper();
        
        for (Doc doc : docLists) {
            ObjectNode jsonObject = mapper.createObjectNode();
            jsonObject.putPOJO("doc", doc);
            jsonObject.put("isOwner", doc.getOwner().equals(user));
            jsonObject.put("isEditor", doc.getEditors().contains(user));
            jsonObject.put("isViewer", doc.getViewers().contains(user));
            result.add(jsonObject);
        }
        
        return ResponseEntity.ok(result);
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

    @PostMapping("/rename/{fileName}")
    public ResponseEntity<?> renameDoc(@RequestHeader("Authorization") String token, @RequestBody String docId, @PathVariable String fileName)
    {   
        System.out.println("ay haga");
        System.out.println("DocId: "+docId);
        System.out.println("FileName: "+fileName);
        if(userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        docId = docId.replace("\"", "");
        if(docService.renameDoc(docId, fileName))
        {
            return ResponseEntity.ok().body("Doc renamed successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc could not be renamed");
        }
    }

    @GetMapping("/doc/{docId}")
    public ResponseEntity<?> getDocById(@PathVariable String docId)
    {
        Optional<Doc> doc = docService.getDocById(docId);
        if(doc.isPresent())
        {
            return ResponseEntity.ok(doc.get().getContent());
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc not found");
        }
    }

    @PostMapping("/saveDoc/{docId}")
    public ResponseEntity<?> saveDoc(@PathVariable String docId, @RequestBody String content)
    {
        if(docService.saveDoc(docId, content))
        {
            return ResponseEntity.ok().body("Doc saved successfully");
        }
        else
        {
            return ResponseEntity.badRequest().body("Doc could not be saved");
        }
    }

    
    public ResponseEntity<?> getPermissions(@RequestHeader("Authorization") String token,@PathVariable String docId)
    {
        if (userService.validToken(token) == false)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        User user = userService.getUserById(new Token().getIdFromToken(token)).get();
        if (user == null)
        {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        
        Boolean canEdit = docService.getPermissions(docId,user);
        return ResponseEntity.ok(canEdit.toString());
    }
    
}
