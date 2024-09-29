package org.example.config;

import org.example.model.UserDetail;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((requests) -> requests
                .anyRequest().permitAll()
                // .requestMatchers("/", "/**").permitAll()
                // .anyRequest().authenticated()
            )
           .formLogin((form) -> form
               .loginPage("/login")
               .loginProcessingUrl("/api/login")
               .usernameParameter("username")
               .passwordParameter("password")
               .successForwardUrl("/loginSuccess")
               .failureUrl("/loginFail")
               .permitAll()
           )
            .logout((logout) -> logout
                .logoutSuccessUrl("/logoutSuccess")
                .permitAll());

        return http.build();
    }

    @Bean   
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetail userDetail1 = new UserDetail("Employee", "EMP001", "User One", "User", "One", "user1@example.com", passwordEncoder.encode("password1"), "USER");
        UserDetail userDetail2 = new UserDetail("Employee", "EMP002", "User Two", "User", "Two", "user2@example.com", passwordEncoder.encode("password2"), "USER");
        UserDetail userDetail3 = new UserDetail("Employee", "EMP003", "User Three", "User", "Three", "user3@example.com", passwordEncoder.encode("password3"), "USER");
        UserDetail userDetail4 = new UserDetail("Employee", "EMP004", "User Four", "User", "Four", "user4@example.com", passwordEncoder.encode("password4"), "USER");
        UserDetail userDetail5 = new UserDetail("Employee", "EMP005", "User Five", "User", "Five", "user5@example.com", passwordEncoder.encode("password5"), "USER");

        return new InMemoryUserDetailsManager(userDetail1, userDetail2, userDetail3, userDetail4, userDetail5);
    }
}