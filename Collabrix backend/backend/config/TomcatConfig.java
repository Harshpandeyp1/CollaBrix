package com.example.collabrix.backend.config;

import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class TomcatConfig {

    /**
     * Avoid Files.createTempDirectory (java.io.tmpdir is cached by the JVM and may
     * still point at C:\Windows\ under some IDE launches, causing AccessDeniedException).
     */
    @Bean
    WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatTempDirCustomizer() {
        return factory -> {
            Path base = Path.of(System.getProperty("user.home"), "tomcat-tmp");
            Path docBase = base.resolve("docbase");
            try {
                Files.createDirectories(docBase);
            } catch (IOException e) {
                throw new IllegalStateException("Unable to create Tomcat directories under " + base, e);
            }
            factory.setBaseDirectory(base.toFile());
            factory.setDocumentRoot(docBase.toFile());
        };
    }
}
