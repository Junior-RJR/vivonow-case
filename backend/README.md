# VivoNow Backend

VivoNow é um sistema de gestão de tarefas por equipes, desenvolvido para facilitar a organização e acompanhamento de atividades em ambientes corporativos.

## Tecnologias Utilizadas

- **Java 11**: Linguagem de programação principal
- **Spring Boot 2.7.14**: Framework para desenvolvimento de aplicações Java
- **Spring Security**: Para autenticação e autorização
- **Spring Data JPA**: Para persistência de dados
- **H2 Database**: Banco de dados em memória para desenvolvimento
- **JWT (JSON Web Token)**: Para autenticação stateless
- **Maven**: Gerenciamento de dependências e build
- **Swagger/OpenAPI**: Documentação da API

## Estrutura do Projeto


backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── vivonow/
│   │   │           ├── config/         # Configurações do Spring
│   │   │           ├── controller/     # Controladores REST
│   │   │           ├── dto/            # Objetos de transferência de dados
│   │   │           ├── model/          # Entidades JPA
│   │   │           ├── repository/     # Repositórios JPA
│   │   │           ├── security/       # Configurações de segurança e JWT
│   │   │           ├── service/        # Serviços de negócio
│   │   │           └── Application.java # Classe principal
│   │   └── resources/
│   │       ├── application.properties  # Configurações da aplicação
│   │       ├── data.sql                # Script para popular o banco
│   │       └── schema.sql              # Script para criar o esquema do banco
│   └── test/                           # Testes automatizados
└── pom.xml                             # Configuração do Maven


## Funcionalidades Principais

- **Autenticação e Autorização**: Sistema de login com JWT e controle de acesso baseado em papéis (ADMIN, USER)
- **Gestão de Usuários**: Cadastro, edição e listagem de usuários
- **Gestão de Equipes**: Criação e gerenciamento de equipes
- **Gestão de Tarefas**: Criação, atribuição, atualização de status e acompanhamento de tarefas
- **Avisos**: Sistema de comunicação para anúncios importantes

## Como Executar o Projeto

### Pré-requisitos

- Java 11 ou superior
- Maven 3.6 ou superior

### Passos para Execução

1. Clone o repositório:
   bash
   git clone https://github.com/seu-usuario/vivonow.git
   cd vivonow/backend
   

2. Compile o projeto:
   bash
   ./mvnw clean install
   

3. Execute a aplicação:
   bash
   ./mvnw spring-boot:run
   

4. Acesse a aplicação:
   - API REST: http://localhost:8080/api
   - Documentação Swagger: http://localhost:8080/swagger-ui.html
   - Console H2 (banco de dados): http://localhost:8080/h2-console
     - JDBC URL: jdbc:h2:mem:vivonowdb
     - Usuário: sa
     - Senha: password

## Endpoints da API

### Autenticação

- `POST /api/auth/login`: Autenticar usuário
- `POST /api/auth/register`: Registrar novo usuário

### Usuários

- `GET /api/users`: Listar todos os usuários (apenas admin)
- `GET /api/users/team`: Listar usuários da equipe atual
- `GET /api/users/{id}`: Obter usuário por ID

### Tarefas

- `GET /api/tasks`: Listar tarefas da equipe
- `GET /api/tasks/status/{status}`: Listar tarefas por status
- `GET /api/tasks/assignee/{assigneeId}`: Listar tarefas por responsável
- `POST /api/tasks`: Criar nova tarefa
- `PUT /api/tasks/{id}`: Atualizar tarefa
- `PATCH /api/tasks/{id}/status`: Atualizar status da tarefa
- `DELETE /api/tasks/{id}`: Excluir tarefa

### Equipes

- `GET /api/teams`: Listar todas as equipes
- `GET /api/teams/{id}`: Obter equipe por ID
- `POST /api/teams`: Criar nova equipe (apenas admin)
- `DELETE /api/teams/{id}`: Excluir equipe (apenas admin)

### Avisos

- `GET /api/announcements`: Listar todos os avisos
- `POST /api/announcements`: Criar novo aviso (apenas admin)
- `DELETE /api/announcements/{id}`: Excluir aviso (apenas admin)

## Usuários Padrão

O sistema é inicializado com os seguintes usuários para testes:

1. **Administrador**:
   - Email: rogeriojunior@vivo.com.br
   - Senha: vivo123
   - Papel: ADMIN
   - Equipe: Desenvolvimento

2. **Usuário Regular**:
   - Email: joao.silva@vivo.com.br
   - Senha: vivo123
   - Papel: USER
   - Equipe: Desenvolvimento

## Segurança

- Todas as senhas são armazenadas com hash usando BCrypt
- Autenticação via JWT com expiração de token
- Controle de acesso baseado em papéis (ADMIN, USER)
- Proteção contra CSRF e XSS

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request


