import { Page } from "@playwright/test";

export const employeeLocator = (page: Page) => ({
  //Search
  statusDropDown: page.locator(".oxd-select-wrapper").first(),
  subUnitDropDown: page.locator(".oxd-select-wrapper").last(),
  searchBtn: page.getByRole("button", { name: "Search" }),
  resetBtn: page.getByRole("button", { name: "Reset" }),
  pimMenu: page.getByRole("link", { name: "PIM" }),
  idSearch: page
    .locator(".oxd-input-group")
    .filter({ hasText: "Employee Id" })
    .locator("//input"),

  //Add employee
  addBtn: page.getByRole("button", { name: "Add" }),
  firstNameInput: page.getByPlaceholder("First Name"),
  lastNameInput: page.getByPlaceholder("Last Name"),
  idInput: page
    .locator(".oxd-input-group")
    .filter({ hasText: "Employee Id" })
    .locator("//input"),
  saveBtn: page.getByRole("button", { name: "Save" }),

  //Update
  job: page.getByRole("link", { name: "Job" }),

  //Delete
  deleteBtn: page
    .locator('button[type="button"]')
    .filter({ hasText: "Yes, Delete" }),
});
