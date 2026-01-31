import { Locator, Page, expect } from "@playwright/test";
import { AuthPage } from "./AuthPage";

export class AdminPage {
  private readonly page: Page;
  private readonly adminMenu: Locator;
  private readonly usernameSearchInput: Locator;
  private readonly searchBtn: Locator;
  private readonly addBtn: Locator;
  private readonly tableCard: Locator;
  private readonly userRoleDropdown: Locator;
  private readonly employeeNameInput: Locator;
  private readonly statusDropdown: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly saveBtn: Locator;
  private readonly deleteBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenu = page.getByRole("link", { name: "Admin" });
    //Search user
    this.usernameSearchInput = page
      .locator(".oxd-input-group", { hasText: "Username" })
      .locator("input");
    this.searchBtn = page.getByRole("button", { name: "Search" });
    this.tableCard = page.locator(".oxd-table-card").last();
    //Add user
    this.addBtn = page.getByRole("button", { name: "Add" });
    this.userRoleDropdown = page.locator(".oxd-select-wrapper").first();
    this.employeeNameInput = page.locator(
      '//input[contains(@placeholder, "Type for hints")]',
    );
    this.statusDropdown = page.locator(".oxd-select-wrapper").last();
    this.usernameInput = page
      .locator(".oxd-input-group", { hasText: "Username" })
      .locator("input");
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').last();

    this.saveBtn = page.getByRole("button", { name: "Save" });

    //delete
    this.deleteBtn = page
      .locator('button[type="button"]')
      .filter({ hasText: "Yes, Delete" });
  }

  //Navigate to tab Admin
  async navigateToAdmin() {
    await this.adminMenu.click();
  }

  //Search by username
  async searchByUsername(username: string) {
    await this.usernameSearchInput.fill(username);
    await this.searchBtn.click();

    await this.page.waitForLoadState("networkidle");
  }

  //Add user
  async addUser() {
    await this.addBtn.click();

    await this.userRoleDropdown.click();
    await this.page
      .locator('//div[@role="listbox"]//span[text()="ESS"]')
      .click();

    await this.employeeNameInput.fill("a");
    await this.page
      .locator('//div[@role="listbox"]')
      .waitFor({ state: "visible", timeout: 5000 });
    await expect(this.page.getByText("Searching....")).not.toBeVisible({
      timeout: 5000,
    });
    await this.page.getByRole("option").first().click();

    await this.statusDropdown.click();
    await this.page
      .locator('//div[@role="option"]//span[text()="Enabled"]')
      .click();
    const randomName = "test" + (Math.floor(Math.random() * 99) + 1);
    await this.usernameInput.fill(randomName);
    await this.passwordInput.fill("password123");
    await this.confirmPasswordInput.fill("password123");

    await this.saveBtn.click();
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

    await this.userRoleDropdown.click();
    await this.page
      .locator('//div[@role="listbox"]//span[text()="ESS"]')
      .click();

    const newName = randomName + "update";
    await this.usernameInput.fill(newName);
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

    await this.deleteBtn.waitFor({ state: "visible" });
    await this.deleteBtn.click();
  }
}
