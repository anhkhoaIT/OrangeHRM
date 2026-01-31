import { expect, Locator, Page } from "@playwright/test";
import { test } from "../fixtures/baseTest";

export class AuthPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginBtn: Locator;
  private readonly requiredError: Locator;
  private readonly invalidError: Locator;
  private readonly userDropDown: Locator;
  private readonly logoutBtn: Locator;
  private readonly AUTH_URL =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  constructor(page: Page) {
    this.page = page;

    //login attributes
    this.usernameInput = page.locator("//input[@name='username']");
    this.passwordInput = page.locator("//input[@name='password']");
    this.loginBtn = page.locator("//button[@type='submit']");

    //error attributes
    this.requiredError = page.locator("//span[text()='Required']");
    this.invalidError = page.locator("p.oxd-alert-content-text");

    //logout attributes
    this.userDropDown = page.locator("li.oxd-userdropdown");
    this.logoutBtn = page.locator(
      "//a[@class='oxd-userdropdown-link' and text()='Logout']",
    );
  }

  //Navigate to login page
  async goto() {
    await this.page.goto(this.AUTH_URL);
  }

  //Login
  async login(username: string, password: string) {
    await test.step("Login", async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginBtn.click();
    });
  }

  // Require error message
  async getRequiredErrorMessage() {
    await expect(this.requiredError).toBeVisible();
    return await this.requiredError.textContent();
  }

  //Invalid error message
  async getInvalidErrorMessage() {
    await expect(this.invalidError).toBeVisible({ timeout: 10000 });
    return await this.invalidError.textContent();
  }

  //Logout
  async logout() {
    //login first
    await this.login("Admin", "admin123");
    await expect(this.page).toHaveURL(/dashboard/);

    //logout
    await this.userDropDown.click();
    await expect(this.logoutBtn).toBeVisible();
    await this.logoutBtn.click();
  }
}
