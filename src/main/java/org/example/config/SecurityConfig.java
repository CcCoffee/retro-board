package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.Customizer;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)  // 禁用 CSRF
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/api/login", "/login", "/login.html", "/loginSuccess", "/loginFail", "/logoutSuccess").permitAll()
                .requestMatchers("/_next/**", "/*.js", "/*.css", "/*.html", "/*.jpg", "/*.png", "/*.gif", "/*.svg", "/favicon.ico").permitAll()
                .anyRequest().authenticated())
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
                .logoutUrl("/api/logout")
                .logoutSuccessUrl("/logoutSuccess")
                .permitAll())
            .headers(headers -> headers
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin
                )
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // 允许前端开发服务器的源
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean   
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        User userDetail1 = new User("E001", passwordEncoder.encode("1234"), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        User userDetail2 = new User("E002", passwordEncoder.encode("1234"), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        User userDetail3 = new User("E003", passwordEncoder.encode("1234"), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        User userDetail4 = new User("E004", passwordEncoder.encode("1234"), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        User userDetail5 = new User("E005", passwordEncoder.encode("1234"), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        return new InMemoryUserDetailsManager(userDetail1, userDetail2, userDetail3, userDetail4, userDetail5);
    }
}