package com.backend.AptBe.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;


import com.backend.AptBe.model.Doc;

@Repository
public interface DocRepo extends MongoRepository<Doc,String>{
    
    Optional<Doc> findById(String _id);

    boolean existsById(String _id);

    @Query("{'owner._id': ?0}")
    List<Doc> findByOwner(String _id);

    @Query("{'editors._id': ?0}")
    List<Doc> findByEditors(String _id);

    @Query("{'viewers._id': ?0}")
    List<Doc> findByViewers(String _id);
}
