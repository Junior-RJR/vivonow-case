package com.vivonow.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.vivonow")
@EntityScan("com.vivonow.model")
@EnableJpaRepositories("com.vivonow.repository")
public class VivonowBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(VivonowBackendApplication.class, args);
    }
}
