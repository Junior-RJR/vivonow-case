package com.vivonow.service;

import com.vivonow.model.Role;
import com.vivonow.model.Team;
import com.vivonow.model.User;
import com.vivonow.repository.TeamRepository;
import com.vivonow.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, TeamRepository teamRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Buscando usuário por email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado com o email: {}", email);
                    return new UsernameNotFoundException("Usuário não encontrado com o email: " + email);
                });
    }

    @Transactional
    public User registerUser(String name, String email, String password, String teamName, boolean isNewTeam) {
        logger.info("Registrando novo usuário: {}, email: {}, equipe: {}, nova equipe: {}", 
                   name, email, teamName, isNewTeam);
        
        if (userRepository.existsByEmail(email)) {
            logger.warn("Email já está em uso: {}", email);
            throw new RuntimeException("Email já está em uso");
        }

        Team team;
        if (isNewTeam) {
            if (teamRepository.existsByName(teamName)) {
                logger.warn("Nome de equipe já existe: {}", teamName);
                throw new RuntimeException("Nome de equipe já existe");
            }
            team = new Team(teamName);
            logger.debug("Criando nova equipe: {}", teamName);
            teamRepository.save(team);
        } else {
            logger.debug("Buscando equipe existente: {}", teamName);
            team = teamRepository.findByName(teamName)
                    .orElseThrow(() -> {
                        logger.warn("Equipe não encontrada: {}", teamName);
                        return new RuntimeException("Equipe não encontrada");
                    });
        }

        boolean isFirstUser = userRepository.count() == 0;
        Role role = isFirstUser ? Role.ADMIN : Role.USER;
        logger.debug("Usuário será registrado como: {}", role);

        User user = new User(
                name,
                email,
                passwordEncoder.encode(password),
                team,
                role
        );

        User savedUser = userRepository.save(user);
        logger.info("Usuário registrado com sucesso: {}, ID: {}", email, savedUser.getId());
        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByTeam(Team team) {
        return team.getUsers().stream().toList();
    }
    
    @Transactional
    public User updateUser(Long id, String name, String email, Long teamId, Role role) {
        logger.info("Atualizando usuário ID: {}, nome: {}, email: {}, equipe: {}, papel: {}", 
                   id, name, email, teamId, role);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado com o ID: {}", id);
                    return new RuntimeException("Usuário não encontrado");
                });
        
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            logger.warn("Email já está em uso: {}", email);
            throw new RuntimeException("Email já está em uso");
        }
        
        if (teamId != null && !user.getTeam().getId().equals(teamId)) {
            Team team = teamRepository.findById(teamId)
                    .orElseThrow(() -> {
                        logger.warn("Equipe não encontrada com o ID: {}", teamId);
                        return new RuntimeException("Equipe não encontrada");
                    });
            user.setTeam(team);
        }
        
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        
        User updatedUser = userRepository.save(user);
        logger.info("Usuário atualizado com sucesso: {}, ID: {}", email, updatedUser.getId());
        return updatedUser;
    }
    
    @Transactional
    public void deleteUser(Long id) {
        logger.info("Excluindo usuário ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado com o ID: {}", id);
                    return new RuntimeException("Usuário não encontrado");
                });
        
        if (user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ADMIN)
                    .count();
            
            if (adminCount <= 1) {
                logger.warn("Tentativa de excluir o último administrador");
                throw new RuntimeException("Não é possível excluir o último administrador do sistema");
            }
        }
        
        userRepository.delete(user);
        logger.info("Usuário excluído com sucesso: {}, ID: {}", user.getEmail(), id);
    }
}
