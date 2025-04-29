INSERT INTO teams (id, name) VALUES (1, 'Desenvolvimento');
INSERT INTO teams (id, name) VALUES (2, 'Marketing');
INSERT INTO teams (id, name) VALUES (3, 'Recursos Humanos');
INSERT INTO teams (id, name) VALUES (4, 'TI');

INSERT INTO users (id, name, email, password, team_id, role) 
VALUES (1, 'Rogério Junior', 'rogeriojunior@vivo.com.br', '$2a$10$3JUw.hHt.CRYbxspTFkKQOQeTSoQNvYVA5HFUAMhTJtYxV9f6jnDK', 1, 'ADMIN');

INSERT INTO users (id, name, email, password, team_id, role) 
VALUES (2, 'Rebeca Monteiro', 'rebeca.monteiro@vivo.com.br', '$2a$10$3JUw.hHt.CRYbxspTFkKQOQeTSoQNvYVA5HFUAMhTJtYxV9f6jnDK', 1, 'USER');

INSERT INTO users (id, name, email, password, team_id, role) 
VALUES (3, 'Raphaela Toledo', 'raphaela.toledo@vivo.com.br', '$2a$10$3JUw.hHt.CRYbxspTFkKQOQeTSoQNvYVA5HFUAMhTJtYxV9f6jnDK', 3, 'ADMIN');

INSERT INTO users (id, name, email, password, team_id, role) 
VALUES (4, 'Pedro Santos', 'pedro.santos@vivo.com.br', '$2a$10$3JUw.hHt.CRYbxspTFkKQOQeTSoQNvYVA5HFUAMhTJtYxV9f6jnDK', 1, 'USER');

INSERT INTO tasks (id, title, description, due_date, status, assignee_id, team_id) 
VALUES (1, 'Desenvolver tela de login', 'Criar a interface de login com validação de campos', '2025-04-30', 'PENDING', 2, 1);

INSERT INTO tasks (id, title, description, due_date, status, assignee_id, team_id) 
VALUES (2, 'Implementar autenticação JWT', 'Configurar o backend para autenticação com JWT', '2025-05-02', 'IN_PROGRESS', 3, 1);

INSERT INTO tasks (id, title, description, due_date, status, assignee_id, team_id) 
VALUES (3, 'Criar componente de lista de tarefas', 'Desenvolver o componente que exibe as tarefas em formato de lista', '2025-05-04', 'COMPLETED', 4, 1);

INSERT INTO tasks (id, title, description, due_date, status, assignee_id, team_id) 
VALUES (4, 'Implementar filtros', 'Adicionar filtros por status e membro da equipe', '2025-05-06', 'PENDING', 2, 1);

INSERT INTO tasks (id, title, description, due_date, status, assignee_id, team_id) 
VALUES (5, 'Teste', 'Testes de integração', '2025-05-10', 'IN_PROGRESS', 2, 1);

INSERT INTO announcements (id, message, icon, created_at, created_by) 
VALUES (1, 'Reunião geral amanhã às 10h no auditório.', 'info', '2025-04-27 10:00:00', 1);
