# ConstruControl - Sistema de Gestão de Crédito

Um sistema web desenvolvido com Next.js para gerenciamento de crédito para clientes, permitindo o controle eficiente de contas a receber e gestão de clientes.

![ConstruJoy Dashboard](https://via.placeholder.com/800x400?text=ConstruJoy+Dashboard)

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) - Framework React com renderização híbrida
- [React Query](https://react-query.tanstack.com/) - Gerenciamento de estado de dados e cache
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS para design responsivo
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animações
- [Zod](https://github.com/colinhacks/zod) - Validação de dados
- [Axios](https://axios-http.com/) - Cliente HTTP para requisições API
- [jsPDF](https://parall.ax/products/jspdf) - Geração de relatórios em PDF

## 📋 Pré-requisitos

- Node.js (v16+)
- NPM ou Yarn
- API de backend configurada e em execução

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/construjoy-frontend.git
   cd construjoy-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```
   NEXT_PUBLIC_API_URL=http://seu-backend-api-url
   ```

## 💻 Executando o projeto

### Ambiente de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

### Build de produção:
```bash
npm run build
npm run start
# ou
yarn build
yarn start
```

## 🔍 Funcionalidades Principais

### 1. Dashboard
- Visão geral de indicadores financeiros
- Lista de contas vencidas
- Informações sobre vencimentos no mês atual

### 2. Gestão de Clientes
- Cadastro e edição de clientes
- Visualização de histórico de compras por cliente
- Quitação de múltiplas contas de um cliente

### 3. Compras a Crédito
- Registro de novas compras a crédito
- Edição de informações de compras
- Marcação de contas como pagas
- Filtros e busca avançada

### 4. Relatórios
- Geração de relatórios de débitos por cliente
- Exportação de relatórios em PDF
- Visão consolidada da situação financeira

## 📁 Estrutura do Projeto
construjoy-frontend/
├── app/                  # Páginas e componentes específicos da aplicação
│   ├── components/       # Componentes compartilhados da aplicação
│   ├── credit-purchases/ # Módulo de compras a crédito
│   ├── customers/        # Módulo de gerenciamento de clientes
│   ├── dashboard/        # Módulo de dashboard
│   ├── reports/          # Módulo de relatórios
│   └── utils/            # Funções utilitárias
├── components/           # Componentes de UI reutilizáveis
│   └── ui/               # Componentes de interface básicos
├── hooks/                # Hooks personalizados
├── lib/                  # Bibliotecas e funções utilitárias
├── providers/            # Provedores de contexto
├── public/               # Arquivos estáticos
└── services/             # Serviços de API
    └── api/              # Configuração e clientes API

## 📄 Fluxo de Trabalho
- Dashboard: Visualize rapidamente a situação financeira atual
- Clientes: Gerencie informações de clientes e seu histórico
- Compras a Crédito: Registre, edite e acompanhe as compras feitas a crédito
- Relatórios: Gere relatórios e exporte dados para análise

## Contato
- Email: pedrotatibano1900@gmail.com
- Linkedin: Pedro Tatibano
