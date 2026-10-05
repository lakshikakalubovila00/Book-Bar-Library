package lk.bookbarlibrary.opac.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class OPACController {
    @GetMapping(value="/opac")
    public ModelAndView opacUi(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView opacView = new ModelAndView();
        opacView.addObject("loggedusername" , authentication.getName());
        opacView.addObject("title", "Book Bar Library-Catalog");
        opacView.setViewName("opac.html");
        return opacView;
    }
}


