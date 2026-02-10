import { expect, Page } from "@playwright/test";
import { test } from "../fixtures/baseTest";
import { authLocator } from "../utils/locator/auth";

export class AuthPage {
  private readonly page: Page;
  private locators;
  private readonly AUTH_URL =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  constructor(page: Page) {
    this.page = page;
    this.locators = authLocator(page);
  }

  //Navigate to login page
  async goto() {
    await this.page.goto(this.AUTH_URL);
  }

  //Login
  async login(username: string, password: string) {
    await this.locators.usernameInput.fill(username);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginBtn.click();
  }

  // Require error message
  async getRequiredErrorMessage() {
    await expect(this.locators.requiredError).toBeVisible();
    return await this.locators.requiredError.textContent();
  }

  //Invalid error message
  async getInvalidErrorMessage() {
    await expect(this.locators.invalidError).toBeVisible({ timeout: 10000 });
    return await this.locators.invalidError.textContent();
  }

  //Logout
  async logout() {
    //login first
    await this.login("Admin", "admin123");
    await expect(this.page).toHaveURL(/dashboard/);

    //logout
    await this.locators.userDropDown.click();
    await expect(this.locators.logoutBtn).toBeVisible();
    await this.locators.logoutBtn.click();
  }
}
