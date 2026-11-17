# Orientações para agentes — HairDay

## Projeto

HairDay é uma SPA de agendamentos para salão de beleza, construída com React, TypeScript strict e Vite. Não há backend: os dados são armazenados no LocalStorage do navegador.

## Antes de alterar

- Preserve alterações existentes do usuário e não faça commits ou push sem autorização explícita.
- Use `dev.pen` como referência visual oficial. Acesse arquivos `.pen` somente pelas ferramentas do Pencil; não os leia ou modifique diretamente pelo sistema de arquivos.
- Não altere `dev.pen` sem autorização. Se o Pencil não estiver acessível, informe a limitação e não afirme fidelidade visual sem comparação.
- Para dúvidas ou alterações que dependam de APIs de bibliotecas e ferramentas, consulte a documentação atual via Context7.

## Arquitetura

- `src/App.tsx` e `src/App.module.css`: interface principal e seus estilos.
- `src/hooks/useAppointments.ts`: estado e operações dos agendamentos.
- `src/services/appointmentStorage.ts`: leitura, validação e escrita no LocalStorage.
- `src/utils/appointments.ts`: funções puras de validação, filtragem e agrupamento.
- `src/types/appointment.ts`: tipos de domínio.
- `tests/appointments.spec.ts`: testes end-to-end com Playwright.

Mantenha a lógica de negócio separada da apresentação. Prefira componentes pequenos e reutilizáveis quando isso simplificar o código, sem abstrações desnecessárias. Use TypeScript strict, sem `any`, e CSS Modules para estilos de componentes. Não adicione backend, banco de dados externo, Tailwind ou bibliotecas sem necessidade.

## Regras dos agendamentos

- Armazene `id`, `customer`, `date` (`YYYY-MM-DD`) e `time` (`HH:mm`).
- Valide nomes não vazios, datas reais e horários entre 06:00 e 23:59.
- Não permita dois agendamentos com a mesma combinação de data e horário. A mensagem de conflito é: `Já existe um agendamento para este horário.`
- Agrupe por manhã (06:00–11:59), tarde (12:00–17:59) e noite (18:00–23:59), em ordem cronológica.
- Quando um período estiver vazio, exiba: `Você ainda não tem agendamentos cadastrados nesse período.`
- Valide dados recuperados do LocalStorage e evite sobrescrever dados ilegíveis. Informe falhas de persistência ao usuário e mantenha a aplicação utilizável durante a sessão.

## Interface e acessibilidade

Respeite cores, tipografia, proporções e componentes do `dev.pen`. Quando um requisito funcional exigir algo ausente do design, mantenha a identidade visual existente. Adapte desktop, tablet e mobile sem rolagem horizontal involuntária. Use HTML semântico, labels associados, foco visível, navegação por teclado e mensagens de erro acessíveis.

## Verificações

Execute as verificações relevantes após as alterações e informe qualquer falha ou limitação:

```bash
npm run lint
npm run typecheck
npm run build
npx playwright test
```

Na primeira execução dos testes, instale o navegador com `npx playwright install chromium`. Para alterações visuais, compare a aplicação executada com os frames aplicáveis do `dev.pen` e registre divergências restantes. Não declare testes ou fidelidade visual aprovados sem verificá-los.
