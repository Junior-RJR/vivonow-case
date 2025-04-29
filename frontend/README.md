# VivoNow Frontend

VivoNow é um sistema de gestão de tarefas por equipes, com interface moderna e responsiva para facilitar a organização e acompanhamento de atividades em ambientes corporativos.

## Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces
- **React Router 6**: Para gerenciamento de rotas
- **CSS Modular**: Estilos organizados por componentes
- **Lucide React**: Biblioteca de ícones
- **Axios**: Cliente HTTP para requisições à API
- **LocalStorage**: Para armazenamento de dados de autenticação

## Estrutura do Projeto

\`\`\`
frontend/
├── public/
│   ├── assets/              # Imagens e recursos estáticos
│   ├── favicon.ico          # Ícone da aplicação
│   ├── index.html           # Arquivo HTML principal
│   └── manifest.json        # Manifesto para PWA
├── src/
│   ├── components/
│   │   ├── css/             # Arquivos de estilo
│   │   └── js/              # Componentes React
│   ├── App.jsx              # Componente principal com rotas
│   └── index.jsx            # Ponto de entrada da aplicação
└── package.json             # Dependências e scripts
\`\`\`

## Funcionalidades Principais

- **Autenticação**: Sistema de login e registro de usuários
- **Dashboard**: Visualização e gerenciamento de tarefas em formato Kanban
- **Gerenciamento de Tarefas**: Criação, edição, atribuição e acompanhamento
- **Painel Administrativo**: Gerenciamento de usuários, equipes e avisos
- **Avisos**: Sistema de comunicação para anúncios importantes
- **Responsividade**: Interface adaptável a diferentes dispositivos

## Como Executar o Projeto

### Pré-requisitos

- Node.js 14 ou superior
- npm 6 ou superior (ou yarn)

### Passos para Execução

1. Clone o repositório:
   bash
   git clone https://github.com/seu-usuario/vivonow.git
   cd vivonow/frontend
   

2. Instale as dependências:
   bash
   npm install
   # ou
   yarn install
   

3. Execute a aplicação em modo de desenvolvimento:
   bash
   npm start
   # ou
   yarn start
   

4. Acesse a aplicação:
   - A aplicação estará disponível em http://localhost:3000


## Estrutura de Componentes

### Componentes Principais

- **App.jsx**: Configuração de rotas e proteção de páginas
- **Splash.jsx**: Tela de carregamento inicial
- **Login.jsx**: Formulário de login
- **Register.jsx**: Formulário de registro
- **Dashboard.jsx**: Painel principal com tarefas em formato Kanban
- **AdminDashboard.jsx**: Painel administrativo
- **UsersPage.jsx**: Gerenciamento de usuários
- **ProtectedRoute.jsx**: Componente para proteção de rotas

### Componentes de UI

- **TaskModal.jsx**: Modal para criação/edição de tarefas
- **TaskDetailModal.jsx**: Modal para visualização detalhada de tarefas
- **AddColumnModal.jsx**: Modal para adicionar novas colunas no Kanban
- **ImportantMessage.jsx**: Componente para exibição de avisos importantes

## Fluxo de Autenticação

1. O usuário acessa a aplicação e é redirecionado para a tela de login
2. Após autenticação bem-sucedida, o token JWT é armazenado no localStorage
3. O token é enviado em todas as requisições subsequentes
4. Rotas protegidas verificam a existência e validade do token

## Integração com Backend

A comunicação com o backend é feita através de requisições HTTP utilizando Axios. Os serviços estão organizados em:

- **authService**: Autenticação e registro
- **taskService**: Gerenciamento de tarefas
- **userService**: Gerenciamento de usuários
- **teamService**: Gerenciamento de equipes
- **announcementService**: Gerenciamento de avisos

## Usuários Padrão para Testes

1. **Administrador**:
   - Email: rogeriojunior@vivo.com.br
   - Senha: vivo123

2. **Usuário Regular**:
   - Email: rebeca.monteiro@vivo.com.br
   - Senha: vivo123

## Personalização de Estilos

Os estilos são organizados em arquivos CSS por componente, com variáveis CSS definidas em `global.css`:

css
:root {
  --primary: #660099;
  --primary-light: #8a2be2;
  --primary-dark: #4b0082;
  --background: #f1e3f8bb;
  /* outras variáveis... */
}


Para alterar o tema da aplicação, basta modificar estas variáveis.

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
