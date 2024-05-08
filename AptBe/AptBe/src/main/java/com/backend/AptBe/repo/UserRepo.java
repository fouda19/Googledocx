package com.backend.AptBe.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.AptBe.model.User;

@Repository
public interface UserRepo extends MongoRepository<User,String>{

    Optional<User> getUserByEmail (String email);
    Optional<User> getUserById (String _id);

    Boolean doesEmailExist(String email);
    Boolean doesIdExist(String _id);
}
