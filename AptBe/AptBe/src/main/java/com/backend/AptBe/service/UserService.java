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

    

    public String signUp (User user)
    {
        try {
            System.out.println("HERE");
            

            Token tokenObj = new Token();
            User newUser = userRepo.save(user);
            System.out.println(newUser.get_id());
            String token = tokenObj.generateToken(newUser.get_id());
            System.out.println(token);
            user.addToken(token);
            userRepo.save(user);
            return token;
        } catch (Exception e) {
            System.out.println("ANA NULL");
            return null;
        }
    }

    public String logIn (User user)
    {
        Optional<User> userOptional = userRepo.findByEmail(user.getEmail());
        System.out.println(user.getEmail());
        if(userOptional.isPresent())
        {
            User userFromDb = userOptional.get();
            if(isPasswordMatch(user.getPassword(), userFromDb.getPassword()))
            {
                System.out.println("HERE");
                try {
                    Token tokenObj = new Token();
                    String token = tokenObj.generateToken(userFromDb.get_id());
                    System.out.println(token);
                    userFromDb.addToken(token);
                    userRepo.save(userFromDb);
                    return token;
                } catch (Exception e) {
                    return null;
                }
            }
        }
        return null;
    }

    public Boolean logOut (String token)
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

    public boolean validToken(String token)
    {
        Token tokenObj = new Token();
        String _id = tokenObj.getIdFromToken(token);
        Optional<User> userOptional = userRepo.findById(_id);
        if(userOptional.isPresent())
        {
            User user = userOptional.get();
            if(user.getActiveTokens().contains(token))
            {
                return true;
            }
        }
        return false;
    }
}
