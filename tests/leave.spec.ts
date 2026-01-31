import { expect, test } from "../fixtures/baseTest";
test.describe("Full flow Leave", () => {
  test.beforeEach(async ({ pageManager }) => {
    pageManager.auth().goto();
    pageManager.auth().login("Admin", "admin123");
    pageManager.admin().navigateToAdmin();
  });
  test("Leave retirement", async ({ pageManager }) => {
    await test.step("Create user with role ESS", async () => {
      const username = await pageManager.admin().addUser();
      const toast = pageManager.page
        .locator("//div[contains(@class, 'oxd-toast-content')]")
        .locator("p")
        .filter({ hasText: "Successfully Saved" });
      await expect(toast).toBeVisible({ timeout: 10000 });
      await expect(pageManager.page).toHaveURL(/viewSystemUsers/);
    });

    await test.step("Allow user to request leave", async () => {
      
    });
  });
});
