import { expect, test } from "../fixtures/baseTest";

test.describe("PIM", () => {
  test.describe("Search Employee", () => {
    test.beforeEach(async ({ pageManager }) => {
      pageManager.auth().goto();
      pageManager.auth().login("Admin", "admin123");
      pageManager.employee().navigateToPIM();
    });
    test("Search and reset", async ({ pageManager }) => {
      //Search
      await test.step("Test search function", async () => {
        const status = "Full-time Permanent";
        const subUnit = "OrangeHRM";
        await pageManager.employee().searchByStatusAndSubUnit(status, subUnit);
        const allRows = await pageManager.page
          .locator(".oxd-table-card")
          .filter({ hasText: `${status}` })
          .all();
        for (const row of allRows) {
          await expect(row).toBeVisible();
        }
      });

      //Reset
      await test.step("Test Reset function", async () => {
        await pageManager.employee().reset();

        await pageManager.page
          .locator(".oxd-table-body")
          .waitFor({ state: "visible" });

        const rowCount = await pageManager.page
          .locator(".oxd-table-card")
          .count();
        expect(rowCount).toBeGreaterThan(1);
      });
    });
  });
  test.describe("CRUD employee", () => {
    test.beforeEach(async ({ pageManager }) => {
      pageManager.auth().goto();
      pageManager.auth().login("Admin", "admin123");
      pageManager.employee().navigateToPIM();
    });
    test("Full flow employee", async ({ pageManager }) => {
      let employeeId: string;
      await test.step("Add employee", async () => {
        employeeId = await pageManager.employee().add("Anh", "Khoa");
        const toast = pageManager.page
          .locator("//div[contains(@class, 'oxd-toast-content')]")
          .locator("p")
          .filter({ hasText: "Successfully Saved" });
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(pageManager.page).toHaveURL(/viewPersonalDetails/);
      });

      await test.step("Search employee by employee id", async () => {
        await pageManager.employee().navigateToPIM();
        await pageManager.employee().searchByEmployeeId(employeeId);
        const rowFound = pageManager.page.locator(".oxd-table-card").filter({
          has: pageManager.page.locator(".oxd-table-cell", {
            hasText: `${employeeId}`,
          }),
        });
        await expect(rowFound).toHaveCount(1);
      });

      await test.step("Update last name and job title", async () => {
        await pageManager.employee().update(employeeId);
        await pageManager.employee().navigateToPIM();
        await pageManager.employee().searchByIdAndJobTitle(employeeId);
        const rowFound = pageManager.page
          .locator(".oxd-table-card")
          .filter({
            has: pageManager.page.locator(".oxd-table-cell", {
              hasText: `${employeeId}`,
            }),
          })
          .filter({
            has: pageManager.page.locator(".oxd-table-cell", {
              hasText: "Automaton Tester",
            }),
          });
        await expect(rowFound).toHaveCount(1);
      });

      await test.step("Delete employee", async () => {
        await pageManager.employee().delete(employeeId);
        await pageManager.employee().searchByEmployeeId(employeeId);
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
