# 🚀 LUME SGA - Sistema de Gestão de Atendimentos

O **LUME SGA** é uma solução completa para gerenciamento de fluxo de chamados, controle de SLA e monitoramento de performance de atendimento. O sistema permite o controle total desde o cadastro de infraestrutura (setores e prioridades) até a resolução final do problema.

---

## 🛠️ Funcionalidades

* **Gestão de Infraestrutura:** Cadastro dinâmico de Setores e Prioridades com tempo de SLA customizável.
* **Controle de Fluxo:** Sistema de Check-in (Início) e Check-out (Finalização) com registro de solução.
* **Monitoramento de SLA:** Cálculo automático de tempo decorrido e indicadores visuais para chamados fora do prazo.
* **Dashboard em Tempo Real:** Cards com resumo de chamados abertos, em atendimento e críticos.
* **Segurança de Dados:** Validações de integridade que impedem a exclusão de configurações (setores/prioridades) vinculadas a chamados ativos.

---

## 💻 Tecnologias Utilizadas

### **Front-end**
* **React.js** (Vite)
* **Tailwind CSS** (Estilização Moderna)
* **Lucide React** (Ícones)
* **Axios** (Consumo de API)

### **Back-end**
* **.NET Core / C#** (Web API)
* **Entity Framework** (ORM)
* **SQL Server** (Banco de Dados)

---

## 🚀 Como Rodar o Projeto

### **1. Pré-requisitos**
* Node.js instalado.
* SDK do .NET Core instalado.
* Banco de Dados SQL Server ativo.

### **2. Configuração do Backend**
1.  Navegue até a pasta da API.
2.  Atualize a `ConnectionString` no arquivo `appsettings.json`.
3.  Execute as migrations ou crie o banco:
    ```bash
    dotnet ef database update
    ```
4.  Inicie o servidor:
    ```bash
    dotnet run
    ```
    *A API estará rodando em: `http://localhost:5251`*

### **3. Configuração do Frontend**
1.  Navegue até a pasta do projeto React.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação:
    ```bash
    npm run dev
    ```
    *O sistema abrirá em: `http://localhost:5173`*

---

## 📊 Regras de Negócio Implementadas

| Requisito | Descrição |
| :--- | :--- |
| **Check-in** | Somente chamados "Abertos" podem ser iniciados. |
| **Check-out** | Somente chamados "Em Atendimento" podem ser finalizados, exigindo uma descrição da solução. |
| **SLA** | O sistema destaca automaticamente em vermelho chamados que ultrapassam o tempo estimado da prioridade. |
| **Exclusão** | Não é permitido excluir setores ou prioridades que possuam chamados vinculados. |
| **Prioridades** | O tempo de SLA deve ser de no mínimo 1 hora. |

---

## 🎨 Layout
O sistema utiliza uma paleta de cores baseada em **Navy Dark** e **Lemon Destaque**, focada em usabilidade e contraste para ambientes corporativos.

---

## 📄 Licença
Este projeto foi desenvolvido para fins de desafio técnico e estudos de arquitetura de sistemas SGA.
