package org.example.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
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
                        .requestMatchers("/", "/api/login", "/login", "/login.html", "/loginSuccess", "/loginFail", "/logoutSuccess").permitAll()
                        .requestMatchers("/_next/**", "/*.js", "/*.css", "/*.html", "/*.jpg", "/*.png", "/*.gif", "/*.svg", "/favicon.ico").permitAll()
                        .requestMatchers("/api/users").permitAll()
                        .anyRequest().fullyAuthenticated())
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
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("User not authenticated");
                        })
                )
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .authenticationProvider(ldapAuthenticationProvider(ldapContextSource()));
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
    public LdapAuthenticationProvider ldapAuthenticationProvider(LdapContextSource ldapContextSource) {
        System.out.println(passwordEncoder().encode("1234"));
        ldapContextSource.afterPropertiesSet();
        BindAuthenticator ldapAuthenticator = new BindAuthenticator(ldapContextSource);
        ldapAuthenticator.setUserDnPatterns(new String[]{"uid={0},ou=people"});
        DefaultLdapAuthoritiesPopulator authoritiesPopulator = new DefaultLdapAuthoritiesPopulator(ldapContextSource, "ou=groups");
        authoritiesPopulator.setGroupRoleAttribute("cn");
        return new LdapAuthenticationProvider(ldapAuthenticator, authoritiesPopulator);
    }

    @Bean
    public LdapContextSource ldapContextSource() {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl("ldap://localhost:8389/dc=springframework,dc=org");
        return contextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate() {
        return new LdapTemplate(ldapContextSource());
    }
}