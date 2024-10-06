package org.example.config;

import jakarta.servlet.http.HttpServletResponse;

import org.example.model.UserDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.LdapAuthenticator;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.ldap.urls}")
    private String ldapUrls;

    @Value("${spring.ldap.username}")
    private String ldapUsername;

    @Value("${spring.ldap.password}")
    private String ldapPassword;

    @Value("${spring.ldap.base}")
    private String ldapBase;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)  // 禁用 CSRF
                .authorizeHttpRequests((requests) -> requests
                        .anyRequest().permitAll())
//                        .requestMatchers("/", "/api/login", "/login", "/login.html", "/loginSuccess", "/loginFail", "/logoutSuccess").permitAll()
//                        .requestMatchers("/_next/**", "/*.js", "/*.css", "/*.html", "/*.jpg", "/*.png", "/*.gif", "/*.svg", "/favicon.ico").permitAll()
//                        .requestMatchers("/api/users").permitAll()
//                        .anyRequest().fullyAuthenticated())
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
                .authenticationProvider(ldapAuthenticationProvider());
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
        // 返回一个不进行加密的 PasswordEncoder
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString();
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return rawPassword.toString().equals(encodedPassword);
            }
        };
    }

    @Bean
    public LdapAuthenticationProvider ldapAuthenticationProvider() {
        BindAuthenticator authenticator = new BindAuthenticator(contextSource());
        authenticator.setUserSearch(
            new FilterBasedLdapUserSearch("ou=people", "(&(objectclass=person)(employeeNumber={0}))", contextSource()));

        DefaultLdapAuthoritiesPopulator authoritiesPopulator = 
            new DefaultLdapAuthoritiesPopulator(contextSource(), "ou=groups");
        authoritiesPopulator.setGroupSearchFilter("member={0}");
        LdapAuthenticationProvider ldapAuthenticationProvider = new LdapAuthenticationProvider(authenticator, authoritiesPopulator);
        ldapAuthenticationProvider.setUserDetailsContextMapper(userDetailsContextMapper());
        return ldapAuthenticationProvider;
    }

    private UserDetailsContextMapper userDetailsContextMapper() {
        return new LdapUserDetailsMapper() {
            @Override
            public UserDetails mapUserFromContext(DirContextOperations ctx, String username,
                                                  Collection<? extends GrantedAuthority> authorities) {
                UserDetails details = super.mapUserFromContext(ctx, username, authorities);
                UserDetail userDetail = new UserDetail(
                        ctx.getStringAttribute("employeeType"),
                        ctx.getStringAttribute("employeeNumber"),
                        ctx.getStringAttribute("displayName"), // username
                        null, // password
                        details.getAuthorities(),
                        ctx.getStringAttribute("mail")
                );
                userDetail.setAuthorities(details.getAuthorities());
                return userDetail;
            }
        };
    }

    @Bean
    public LdapContextSource contextSource() {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl(ldapUrls);
        contextSource.setUserDn(ldapUsername);
        contextSource.setPassword(ldapPassword);
        contextSource.setBase(ldapBase);
        contextSource.afterPropertiesSet();
        return contextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate() {
        return new LdapTemplate(contextSource());
    }

//    @Bean
//    public UserDetailsService userDetailsService() {
//        return new CustomUserDetailsService(ldapTemplate(), contextSource());
//    }
}