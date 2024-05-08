package com.backend.AptBe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class AptBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AptBeApplication.class, args);
	}

	@GetMapping("/")
	public String hello() {
		return "Hello World!";
	}

}
