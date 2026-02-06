import { Page } from "@playwright/test";

export const adminLocator = (page: Page) => ({
  adminMenu: page.getByRole("link", { name: "Admin" }),
  //Search user
  usernameSearchInput: page
    .locator(".oxd-input-group", { hasText: "Username" })
    .locator("input"),
  searchBtn: page.getByRole("button", { name: "Search" }),
  tableCard: page.locator(".oxd-table-card").last(),
  //Add user
  addBtn: page.getByRole("button", { name: "Add" }),
  userRoleDropdown: page.locator(".oxd-select-wrapper").first(),
  employeeNameInput: page.locator(
    '//input[contains(@placeholder, "Type for hints")]',
  ),
  statusDropdown: page.locator(".oxd-select-wrapper").last(),
  usernameInput: page
    .locator(".oxd-input-group", { hasText: "Username" })
    .locator("input"),
  passwordInput: page.locator('input[type="password"]').first(),
  confirmPasswordInput: page.locator('input[type="password"]').last(),

  saveBtn: page.getByRole("button", { name: "Save" }),

  //delete
  deleteBtn: page
    .locator('button[type="button"]')
    .filter({ hasText: "Yes, Delete" }),
});
