import { expect, test, type Page } from "@playwright/test";

const TOKEN = process.env.MOLDES_TOKEN ?? "e2e-local-token";

async function scrollToEnd(page: Page) {
  const end = page.getByText("Você viu todos os moldes");
  for (let i = 0; i < 60 && !(await end.isVisible()); i++) {
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(150);
  }
  await expect(end).toBeVisible();
}

const slugs = (page: Page) => page.locator("article a[href^='/m/']").evaluateAll((els) => els.map((e) => e.getAttribute("href")!));

test("feed termina sem repetir moldes (tudo, aba e busca)", async ({ page }) => {
  await page.goto("/login");
  await page.fill("#token", TOKEN);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: /Moldes/ })).toBeVisible();

  const total = Number(await page.getByRole("tab", { name: /Tudo/ }).locator("small").innerText());
  await scrollToEnd(page);
  let list = await slugs(page);
  expect(list).toHaveLength(total);
  expect(new Set(list).size).toBe(total);

  await page.getByRole("tab", { name: /Estilos/ }).click();
  const styles = Number(await page.getByRole("tab", { name: /Estilos/ }).locator("small").innerText());
  await scrollToEnd(page);
  list = await slugs(page);
  expect(list).toHaveLength(styles);
  expect(new Set(list).size).toBe(styles);

  await page.getByRole("tab", { name: /Tudo/ }).click();
  await page.getByPlaceholder(/Buscar em/).fill("editorial");
  await scrollToEnd(page);
  list = await slugs(page);
  expect(list.length).toBeGreaterThan(0);
  expect(new Set(list).size).toBe(list.length);
});
