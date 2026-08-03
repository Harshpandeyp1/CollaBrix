package com.example.collabrix.backend.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.util.UUID;

@Service
public class fileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String saveProfileImage(MultipartFile file){
        if(file.isEmpty()){
            throw new RuntimeException("no file selected");
        }
        try {
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;

            Path uploadPath = Paths.get(uploadDir, "profile");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/uploads/profile/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("failed to save profile image", ex);
        }
    }
    public String saveCoverImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("no file selected");
        }
        try {
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;

            Path uploadPath = Paths.get(uploadDir, "cover");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/uploads/cover/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("failed to save cover image", ex);
        }
    }
}
