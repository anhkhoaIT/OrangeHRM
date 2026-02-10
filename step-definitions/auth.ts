import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page, expect } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";

setDefaultTimeout(30000);

let browser: Browser;
let page: Page;
let authPage: AuthPage;

// Trước mỗi kịch bản, khởi tạo trình duyệt và Page Object
Before(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  authPage = new AuthPage(page);
});

// Sau mỗi kịch bản, đóng trình duyệt
After(async () => {
  await browser.close();
});

Given("Tôi mở trang login của OrangeHRM", async () => {
  await authPage.goto();
});

When(
  "Tôi nhập username {string} và password {string}",
  async (username, password) => {
    await authPage.login(username, password);
  },
);

Then(
  "Tôi sẽ thấy kết quả là {string} với tin nhắn {string}",
  async (flag, errorMsg) => {
    if (flag === "Failed") {
      let actualMsg;
      if (errorMsg === "Required") {
        actualMsg = await authPage.getRequiredErrorMessage();
      } else {
        actualMsg = await authPage.getInvalidErrorMessage();
      }
      expect(actualMsg).toBe(errorMsg);
    } else {
      await expect(page).toHaveURL(/dashboard/);
    }
  },
);
