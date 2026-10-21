import { expect, test } from "@playwright/test";

const TOKEN = process.env.MOLDES_TOKEN ?? "e2e-local-token";

test("login → buscar editorial → abrir molde → copiar DESIGN.md", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await page.fill("#token", TOKEN);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: /Moldes/ })).toBeVisible();

  await page.getByPlaceholder(/Buscar em/).fill("editorial");
  const card = page.getByRole("link", { name: /Editorial de revista/ });
  await expect(card).toBeVisible();
  await card.click();

  await expect(page).toHaveURL(/\/m\/editorial$/);
  await expect(page.getByRole("heading", { level: 1, name: "Editorial de revista" })).toBeVisible();
  await page.getByRole("tab", { name: "Export" }).click();
  await page.getByRole("button", { name: "Copiar DESIGN.md" }).click();
  await expect(page.getByRole("status")).toHaveText("DESIGN.md copiado");

  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip.startsWith("---\nname:")).toBe(true);
  expect(clip).toContain("## Do's and Don'ts");
});
