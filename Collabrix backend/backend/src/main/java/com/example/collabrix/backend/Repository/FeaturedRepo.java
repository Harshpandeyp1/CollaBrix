package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Featured;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeaturedRepo extends JpaRepository<Featured, Long> {

    List<Featured> findByUser(UserEntity user);

}
