package com.backend.AptBe.service;


import java.util.List;
import com.backend.AptBe.token.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.AptBe.model.User;
import java.util.Optional;
import com.backend.AptBe.repo.UserRepo;
import org.mindrot.jbcrypt.BCrypt;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;



    public Optional<User> getUserByEmail(String email)
    {
        return userRepo.findByEmail(email);
    }
    
    public Optional<User> getUserById(String _id)
    {
        return userRepo.findById(_id);
    }

    public Boolean doesEmailExist(String email)
    {
        return userRepo.existsByEmail(email);
    }

    public Boolean doesIdExist(String _id)
    {
        return userRepo.existsById(_id);
    }

    public List<User> getAllUsers()
    {
        return userRepo.findAll();
    }

    public boolean isPasswordMatch(String rawPassword, String hashedPassword) {
        return BCrypt.checkpw(rawPassword, hashedPassword);
    }

    public String encodePassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }
    
    public Boolean addToken(String email, String token)
    {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if(userOptional.isPresent())
        {
            User user = userOptional.get();
            user.addToken(token);
            try {
                userRepo.save(user);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    public Boolean removeToken(String token)
    {
        Token tokenObj = new Token();
        String _id = tokenObj.getIdFromToken(token);
        Optional<User> userOptional = userRepo.findById(_id);
        if(userOptional.isPresent())
        {
            User user = userOptional.get();
            user.removeToken(token);
            try {
                userRepo.save(user);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    public User signUp (User user)
    {
        try {
            userRepo.save(user);
            return user;
        } catch (Exception e) {
            return null;
        }
    }
}
