# HairDay

SPA de agendamentos para salão de beleza, desenvolvida com React, TypeScript e Vite. Os dados ficam no LocalStorage do navegador, sem backend.

## Funcionalidades

- Cadastro com nome, data e horário, incluindo minutos personalizados entre 06:00 e 23:59.
- Filtro por data, ordenação e agrupamento em manhã, tarde e noite.
- Bloqueio de conflitos por data e horário, exclusão e reutilização de horários.
- Validação dos dados armazenados; se o armazenamento estiver indisponível ou contiver dados inválidos, o usuário é avisado e alterações são mantidas apenas durante a sessão. Dados inválidos não são sobrescritos.
- Layout adaptável e navegação por teclado.

## Requisitos e execução

Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Para verificações:

```bash
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npx playwright test
```

## Estrutura

- `src/App.tsx` e `src/App.module.css`: interface e estilos.
- `src/hooks/useAppointments.ts`: estado e operações.
- `src/services/appointmentStorage.ts`: acesso e validação do LocalStorage.
- `src/utils/appointments.ts`: validação, filtro e agrupamento.
- `src/types/appointment.ts`: tipos de domínio.
- `tests/appointments.spec.ts`: testes de navegador Playwright.

## Referência e limitações

A interface foi implementada a partir da captura desktop fornecida pelo usuário. A inspeção direta de `dev.pen` não foi possível porque o Pencil MCP não reconheceu o documento aberto. Portanto, fonte, ícones, outros frames e fidelidade integral ainda precisam de conferência. O campo de horário adicional viabiliza horários com minutos não representados nos botões. Controles de data e hora são nativos e podem variar entre navegadores.

Captura da implementação em 2000 × 1250: `screenshot-desktop.png`.

O armazenamento é local ao navegador e não sincroniza entre dispositivos. Se dados ilegíveis forem encontrados, a aplicação não os sobrescreve automaticamente; a recuperação desses dados exige intervenção manual.
