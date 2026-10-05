package lk.bookbarlibrary.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// This class contains configuration settings.
@Configuration
// enable spring web security
@EnableWebSecurity
public class WebConfiguration {
    // filter chain
    // bean - an object managed by the Spring container
    @Bean
    // Security Filter Chain
    // Is user logged in | Does user have permission | Allow or reject request
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //request filter
        http.authorizeHttpRequests(
                (authrequest)->{
                    authrequest
                            // No authentication required . Anyone can access it
                            .requestMatchers("/login").permitAll()

                            .requestMatchers("/dashboard/**").hasAnyAuthority("Manager","Admin","Librarian" ,"Library-Assistant")

                            .requestMatchers("/createadmin").permitAll()

                            .requestMatchers("/resources/**","/controljs/**").permitAll()

                            .requestMatchers("/userprivilegebymodule").hasAnyAuthority("Manager","Librarian" ,"Admin", "Library-Assistant")

                            .requestMatchers("/employee/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/user/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/privilege/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/book/**").hasAnyAuthority( "Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/bookcopies/**").hasAnyAuthority( "Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/memberregistration/**").hasAnyAuthority( "Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/membershiprenewal/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/payment/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/membershiptype/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/member/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/guarantor/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/borrow/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/reservation/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/renewal/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/handoverandfine/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/supplier/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/purchase/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/donator/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/donation/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/grn/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/membershipnew/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/shelflocation/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/supplierpayment/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/pendingreservations/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                            .requestMatchers("/holidays/**").hasAnyAuthority("Manager","Librarian" ,"Admin","Library-Assistant")

                        .anyRequest().authenticated();

                    // login form detail
                }).formLogin((login)->{
                    login.loginPage("/login")
                            // login success
                            .defaultSuccessUrl("/dashboard",true)
                            // login failure
                            .failureUrl("/login?error=usernamepassworderror")
                            .usernameParameter("username")
                            .passwordParameter("password");
                    //logout detail
                }).logout((logout)->{
                    logout.logoutUrl("/logout")
                            .clearAuthentication(true)
                            // return to login page
                            .logoutSuccessUrl("/login");

                    // exception request error handle
                }).exceptionHandling((error)->{
                    error.accessDeniedPage("/errorpage");

                    // csrf disable - cross site request forgery
                    // all request handle for crud operations by js. only browser url is using for ui.
                    // then default csrf is enabled. so we can't access data by js.
                    // we need to access data request in js file. so we disabled csrf.
                    // when csrf enabled we can't access third party tools also
                }).csrf((csrf)->{
                    csrf.disable();
        });
        return http.build();
    }

    // password encoder instance or bean
    // one way encryption. cannot decrypt
    // there is option to match encrypted password and user entered password
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
