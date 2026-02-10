import { expect, test } from "../fixtures/baseTest";
import loginData from "../data/login.json";
test.describe("Authentication feature", () => {
  test.describe("Login", () => {
    for (const data of loginData) {
      test(`${data.id} - ${data.title}`, async ({ pageManager }) => {
        await pageManager.auth().goto();
        await pageManager.auth().login(data.username, data.password);
        if (data.flag == "Failed") {
          if (data.errorMessage == "Required") {
            const msg = await pageManager.auth().getRequiredErrorMessage();
            expect(msg).toBe(data.errorMessage);
          } else if (data.errorMessage == "Invalid credentials") {
            const msg = await pageManager.auth().getInvalidErrorMessage();
            expect(msg).toBe(data.errorMessage);
          }
        } else {
          await expect(pageManager.page).toHaveURL(/dashboard/);
        }
      });
    }
  });

  test.describe("Logout", () => {
    test("Logout successfully", async ({ pageManager }) => {
      await pageManager.auth().goto();
      await pageManager.auth().logout();
      await expect(pageManager.page).toHaveURL(/login/);
    });
  });
});
