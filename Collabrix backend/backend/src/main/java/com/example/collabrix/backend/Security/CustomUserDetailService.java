package com.example.collabrix.backend.Security;


import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService  implements UserDetailsService{

        private final UserRepo userRepo;

        @Override
        public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException{
            UserEntity user=userRepo.findByEmail(email)
                    .orElseThrow(()->new UsernameNotFoundException("User not found"));


            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities("USER")
                    .build();


    }

}
