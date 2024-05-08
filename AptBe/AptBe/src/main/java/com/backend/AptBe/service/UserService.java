package com.backend.AptBe.service;

import javax.swing.text.html.Option;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.AptBe.model.User;
import java.util.Optional;
import com.backend.AptBe.repo.UserRepo;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;


    public Optional<User> getUserByEmail(String email)
    {
        return userRepo.getUserByEmail(email);
    }
    
    public Optional<User> getUserById(String _id)
    {
        return userRepo.getUserById(_id);
    }

    public Boolean doesEmailExist(String email)
    {
        return userRepo.doesEmailExist(email);
    }

    public Boolean doesIdExist(String _id)
    {
        return userRepo.doesIdExist(_id);
    }

    
}
