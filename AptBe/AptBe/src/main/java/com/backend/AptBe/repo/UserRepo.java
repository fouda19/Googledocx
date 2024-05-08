package com.backend.AptBe.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.AptBe.model.User;

@Repository
public interface UserRepo extends MongoRepository<User,String>{

    Optional<User> findByEmail(String email);
    Optional<User> findById(String _id);

    boolean existsByEmail(String email);
    boolean existsById(String _id);
}
