import { Locator, Page, expect } from "@playwright/test";
import { AuthPage } from "./AuthPage";
import { adminLocator } from "../utils/locator/admin";

export class AdminPage {
  private readonly page: Page;
  private locators;

  constructor(page: Page) {
    this.page = page;
    this.locators = adminLocator(page);
  }

  //Navigate to tab Admin
  async navigateToAdmin() {
    await this.locators.adminMenu.click();
  }

  //Search by username
  async searchByUsername(username: string) {
    await this.locators.usernameSearchInput.fill(username);
    await this.locators.searchBtn.click();

    await this.page.waitForLoadState("networkidle");
  }

  //Add user
  async addUser() {
    await this.locators.addBtn.click();

    await this.locators.userRoleDropdown.click();
    await this.page
      .locator('//div[@role="listbox"]//span[text()="ESS"]')
      .click();

    await this.locators.employeeNameInput.fill("a");
    await this.page
      .locator('//div[@role="listbox"]')
      .waitFor({ state: "visible", timeout: 5000 });
    await expect(this.page.getByText("Searching....")).not.toBeVisible({
      timeout: 5000,
    });
    await this.page.getByRole("option").first().click();

    await this.locators.statusDropdown.click();
    await this.page
      .locator('//div[@role="option"]//span[text()="Enabled"]')
      .click();
    const randomName = "test" + (Math.floor(Math.random() * 99) + 1);
    await this.locators.usernameInput.fill(randomName);
    await this.locators.passwordInput.fill("password123");
    await this.locators.confirmPasswordInput.fill("password123");

    await this.locators.saveBtn.click();
    return randomName;
  }

  //Update user
  async updateUser(randomName: string) {
    const row = this.page
      .locator(".oxd-table-card")
      .filter({ hasText: `${randomName}` });
    const btn = row.locator(".oxd-table-cell-actions button").last();
    btn.waitFor({ state: "visible", timeout: 5000 });
    await btn.click();

    await this.locators.userRoleDropdown.click();
    await this.page
      .locator('//div[@role="listbox"]//span[text()="ESS"]')
      .click();

    const newName = randomName + "update";
    await this.locators.usernameInput.fill(newName);
    await this.page.locator('button[type="submit"]').click();
    return newName;
  }

  //delete user
  async deleteUser(username: string) {
    const row = this.page
      .locator(".oxd-table-card")
      .filter({ hasText: `${username}` });
    const btn = row.locator(".oxd-table-cell-actions button").first();
    btn.waitFor({ state: "visible", timeout: 5000 });
    await btn.click();

    await this.locators.deleteBtn.waitFor({ state: "visible" });
    await this.locators.deleteBtn.click();
  }
}
