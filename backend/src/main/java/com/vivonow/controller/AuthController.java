package com.vivonow.controller;

import com.vivonow.dto.AuthRequest;
import com.vivonow.dto.AuthResponse;
import com.vivonow.dto.RegisterRequest;
import com.vivonow.model.User;
import com.vivonow.security.JwtService;
import com.vivonow.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Endpoints para autenticação e registro de usuários")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuário", description = "Autentica um usuário e retorna um token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida", 
                     content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            logger.info("Tentativa de login para o email: {}", request.getEmail());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            
            logger.info("Login bem-sucedido para o email: {}", request.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(token, user.getName(), user.getEmail(), 
                                    user.getRole().name(), user.getTeam().getName()));
        } catch (BadCredentialsException e) {
            logger.warn("Falha na autenticação para o email: {}", request.getEmail());
            return ResponseEntity.status(401).body("Credenciais inválidas");
        } catch (Exception e) {
            logger.error("Erro durante o login: {}", e.getMessage());
            return ResponseEntity.status(500).body("Erro interno do servidor");
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar novo usuário", description = "Registra um novo usuário no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registro bem-sucedido", 
                     content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou email já em uso")
    })
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            logger.info("Tentativa de registro para o email: {}", request.getEmail());
            
            User user = userService.registerUser(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getTeamName(),
                    request.isNewTeam()
            );

            String token = jwtService.generateToken(user);
            
            logger.info("Registro bem-sucedido para o email: {}", request.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(token, user.getName(), user.getEmail(), 
                                    user.getRole().name(), user.getTeam().getName()));
        } catch (Exception e) {
            logger.error("Erro durante o registro: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
