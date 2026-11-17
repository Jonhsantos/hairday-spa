import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function add(page: Page, date: string, time: string, name: string) {
  await page.getByLabel('Data', { exact: true }).fill(date);
  await page.getByRole('button', { name: time, exact: true }).click();
  await page.getByLabel('Cliente').fill(name);
  await page.getByRole('button', { name: 'AGENDAR' }).click();
}

test('cadastro, ordenação, períodos e persistência', async ({ page }) => {
  await add(page, '2026-12-10', '11:00', ' Ana ');
  await add(page, '2026-12-10', '06:00', 'Bia');
  await add(page, '2026-12-10', '12:00', 'Carlos');
  await add(page, '2026-12-10', '18:00', 'Dora');
  const morning = page.getByRole('region', { name: 'Manhã' });
  await expect(morning).toContainText('Bia');
  await expect(morning).toContainText('Ana');
  await expect(morning.locator('time')).toHaveText(['06:00', '11:00']);
  await expect(page.getByRole('region', { name: 'Tarde' })).toContainText('Carlos');
  await expect(page.getByRole('region', { name: 'Noite' })).toContainText('Dora');
  await page.reload();
  await page.getByLabel('Data da agenda').fill('2026-12-10');
  await expect(morning).toContainText('Ana');
});

test('campos obrigatórios e espaços em branco', async ({ page }) => {
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('alert')).toHaveText('Informe o nome do cliente.');
  await page.getByLabel('Cliente').fill('   ');
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('alert')).toHaveText('Informe o nome do cliente.');
  await page.getByLabel('Cliente').fill('João');
  await page.getByLabel('Data', { exact: true }).fill('');
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('alert')).toHaveText('Informe uma data válida.');
  await page.getByLabel('Data', { exact: true }).fill('2026-12-10');
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('alert')).toContainText('horário válido');
});

test('filtro, conflito, exclusão e reutilização', async ({ page }) => {
  await add(page, '2026-12-10', '10:00', 'Ana');
  await expect(page.getByRole('button', { name: '10:00', exact: true })).toBeDisabled();
  await add(page, '2026-12-11', '10:00', 'Bia');
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Bia');
  await expect(page.getByRole('region', { name: 'Manhã' })).not.toContainText('Ana');
  await page.getByLabel('Data da agenda').fill('2026-12-10');
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Ana');
  await page.getByRole('button', { name: /Excluir agendamento de Ana/ }).click();
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Você ainda não tem agendamentos cadastrados nesse período.');
  await add(page, '2026-12-10', '10:00', 'Cris');
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Cris');
  await page.getByLabel('Data da agenda').fill('2026-12-11');
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Bia');
});

test('mobile sem rolagem horizontal e navegação por teclado', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Data', { exact: true })).toBeFocused();
  await add(page, '2026-12-10', '09:00', 'Cliente mobile');
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Cliente mobile');
});

test('dados inválidos não são sobrescritos', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('hairday:appointments', '{inválido'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('apenas nesta sessão');
  await add(page, '2026-12-10', '09:00', 'Ana');
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Ana');
  expect(await page.evaluate(() => localStorage.getItem('hairday:appointments'))).toBe('{inválido');
});

test('horário personalizado, limites e conflito', async ({ page }) => {
  await page.getByLabel('Data', { exact: true }).fill('2026-12-10');
  await page.getByLabel('Cliente').fill('Ana');
  await page.getByLabel('Outro horário').fill('05:59');
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('alert')).toContainText('horário válido');
  await page.getByLabel('Outro horário').fill('11:59');
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('region', { name: 'Manhã' })).toContainText('Ana');
  await page.getByLabel('Cliente').fill('Bia');
  await page.getByLabel('Outro horário').fill('11:59');
  await page.getByRole('button', { name: 'AGENDAR' }).click();
  await expect(page.getByRole('alert')).toHaveText('Já existe um agendamento para este horário.');
});
