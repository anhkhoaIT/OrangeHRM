import { expect, test } from "../fixtures/baseTest";
import searchData from "../data/admin-search.json";

test.describe("Admin - User Management", () => {
  //Search
  test.describe("Search", () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.auth().goto();
      await pageManager.auth().login("Admin", "admin123");
      await pageManager.admin().navigateToAdmin();
    });

    for (const data of searchData) {
      test(`${data.id} - ${data.title}`, async ({ pageManager }) => {
        const admin = pageManager.admin();
        await admin.searchByUsername(data.Username);
        if (data.flag == "Found Successfully") {
          const firstRow = pageManager.page.locator(".oxd-table-card").first();
          await expect(firstRow).toContainText(data.expectedResult);
        } else {
          const noRecordMsg = pageManager.page
            .locator("//div[contains(@class, 'oxd-toast-content')]")
            .locator("p")
            .last();
          await expect(noRecordMsg).toContainText(data.expectedResult);
        }
      });
    }
  });
  test.describe("CRUD user admin", () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.auth().goto();
      await pageManager.auth().login("Admin", "admin123");
      await pageManager.admin().navigateToAdmin();
    });
    test(" Full flow user admin with valid data", async ({ pageManager }) => {
      let currName: string;
      await test.step("Add user", async () => {
        currName = await pageManager.admin().addUser();
        // console.log(randomName);
        const toast = pageManager.page
          .locator("//div[contains(@class, 'oxd-toast-content')]")
          .locator("p")
          .filter({ hasText: "Successfully Saved" });
        await expect(toast).toBeVisible({ timeout: 10000 });
        await expect(pageManager.page).toHaveURL(/viewSystemUsers/);
      });

      //Update user
      await test.step("Update and search to find user", async () => {
        currName = await pageManager.admin().updateUser(currName);
        const table = pageManager.page.locator(
          `//div[contains(@class,'oxd-table-card')][.//div[normalize-space()='${currName}']]`,
        );
        await table.waitFor({ state: "visible" });
        await expect(table).toBeVisible();

        //Search again to find this user
        await pageManager.admin().searchByUsername(currName);
        const firstRow = pageManager.page.locator(".oxd-table-card").first();
        await expect(firstRow).toContainText(currName);
      });

      //Delete user
      await test.step("Delete updated user and search to make sure it is deleted", async () => {
        await pageManager.admin().deleteUser(currName);
        await pageManager.admin().searchByUsername(currName);
        const noRecordMsg = pageManager.page
          .locator("//div[contains(@class, 'oxd-toast-content')]")
          .locator("p")
          .last();
        await expect(noRecordMsg).toBeVisible();
        await expect(noRecordMsg).toContainText("No Records Found");
      });
    });
  });
});
