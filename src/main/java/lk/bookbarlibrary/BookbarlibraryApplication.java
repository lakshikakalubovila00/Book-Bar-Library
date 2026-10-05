package lk.bookbarlibrary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@SpringBootApplication
public class BookbarlibraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookbarlibraryApplication.class, args);
		System.out.println("Start Application - The Book Bar Library");
	}

}

