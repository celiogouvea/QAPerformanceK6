# Projeto de Teste de Desempenho com K6 - BlazeDemo

Este projeto realiza testes de desempenho na aplicação **API Publica** ([teste](https://reqres.in/api/users)) utilizando a ferramenta **K6**.

## 📌 Objetivo

O objetivo deste projeto é simular múltiplos usuários acessando o site, navegando pelas páginas e realizando compras, a fim de medir a performance da aplicação sob carga.

## 🛠️ Tecnologias Utilizadas

- **K6** (ferramenta de teste de carga)
- **JavaScript** (linguagem para os scripts de teste)
- **Docker** (opcional, para execução em contêiner)

## 📌 Requisitos

- **Node.js** (para instalação via NPM, opcional)
- **K6** instalado localmente ou via Docker

## 🚀 Instalação e Execução

### 1️⃣ Instalar o K6


#### Instalação via Chocolatey (Windows)
```bash
choco install k6
```

#### Execução via Docker
```bash
docker run --rm -i loadimpact/k6 run - < script.js
```

### 2️⃣ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 3️⃣ Executar o Teste
```bash
k6 run scripts/teste-blazedemo.js
```

## 📌 Estrutura do Projeto

```
📂 k6-performance-tests
 ┣ 📂 scripts
 ┃ ┗ 📜 teste-blazedemo.js
 ┣ 📜 README.md
 ┗ 📜 package.json
```

## 📌 Exemplo de Script K6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Aumenta para 10 usuários
    { duration: '1m', target: 50 },  // Escala para 50 usuários
    { duration: '30s', target: 0 },  // Reduz a carga
  ],
};

export default function () {
  let res = http.get('https://reqres.in/api/users');
  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

## 📜 Relatórios

Para gerar um relatório em JSON:
```bash
k6 run --out json=report.json scripts/teste-blazedemo.js
```

Para visualizar os exemplos de teste um resumo no terminal:
```bash
k6 run scripts/testeCarga-CRUD-k6-reqres.in.js
```

```bash
k6 run scripts/testeEstresse-k6-reqres.in.js
```

```bash
k6 run scripts/testeResiliencia-k6-reqres.in.js
```
