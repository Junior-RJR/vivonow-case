-- Tabela de equipes
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    team_id BIGINT,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    assignee_id BIGINT,
    team_id BIGINT NOT NULL,
    FOREIGN KEY (assignee_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Tabela de anúncios
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
