# E-Commerce Admin

Aplicação para gerenciamento de produtos de um e-commerce. Permite criar, editar, excluir e listar produtos com filtros por categoria, status e faixa de preço.

As decisões de arquitetura e tecnologia estão documentadas em [DECISOES_TECNICAS.txt](./DECISOES_TECNICAS.txt).

---

## Pré-requisitos

- Node.js >= 20.x
- npm >= 10.x

---

## Rodando localmente

**1. Clone o repositório**

```bash
git clone <url-do-repositorio>
cd desafio_tecnico_claps
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

**4. Inicie a API (json-server) — em um terminal**

```bash
npm run server
```

Disponível em `http://localhost:3001`.

**5. Inicie o frontend — em outro terminal**

```bash
npm run dev
```

Disponível em `http://localhost:5173`.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes unitários em modo watch (re-executa ao salvar) |
| `npm run test:coverage` | Testes unitários com relatório de cobertura |
| `npm run server` | API (json-server) na porta 3001 |
