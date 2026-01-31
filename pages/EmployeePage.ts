import { expect, Locator, Page } from "@playwright/test";

export class EmployeePage {
  private readonly page: Page;
  private readonly searchBtn: Locator;
  private readonly statusDropDown: Locator;
  private readonly subUnitDropDown: Locator;
  private readonly resetBtn: Locator;
  private readonly pimMenu: Locator;
  private readonly addBtn: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly idInput: Locator;
  private readonly saveBtn: Locator;
  private readonly idSearch: Locator;
  private readonly job: Locator;
  private readonly deleteBtn: Locator;
  constructor(page: Page) {
    this.page = page;
    //Search
    this.statusDropDown = page.locator(".oxd-select-wrapper").first();
    this.subUnitDropDown = page.locator(".oxd-select-wrapper").last();
    this.searchBtn = page.getByRole("button", { name: "Search" });
    this.resetBtn = page.getByRole("button", { name: "Reset" });
    this.pimMenu = page.getByRole("link", { name: "PIM" });
    this.idSearch = page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Id" })
      .locator("//input");

    //Add employee
    this.addBtn = page.getByRole("button", { name: "Add" });
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.idInput = page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Id" })
      .locator("//input");
    this.saveBtn = page.getByRole("button", { name: "Save" });

    //Update
    this.job = page.getByRole("link", { name: "Job" });

    //Delete
    this.deleteBtn = page
      .locator('button[type="button"]')
      .filter({ hasText: "Yes, Delete" });
  }

  //Navigate to PIM
  async navigateToPIM() {
    this.pimMenu.click();
  }

  //Search by status and Sub Unit
  async searchByStatusAndSubUnit(status: string, subUnit: string) {
    await this.statusDropDown.click();
    await this.page
      .locator(`//div[@role="listbox"]/div[@role="option"]`)
      .filter({ hasText: `${status}` })
      .click();

    await this.subUnitDropDown.click();
    await this.page
      .locator(`//div[@role="listbox"]/div[@role="option"]`)
      .filter({ hasText: `${subUnit}` })
      .click();

    await this.searchBtn.click();
  }

  //Search by Employee Id
  async searchByEmployeeId(id: string) {
    console.log(id);
    await this.idSearch.click();
    await this.idSearch.fill(id);
    await this.searchBtn.click();
    // await this.page.waitForLoadState("networkidle");
  }

  async searchByIdAndJobTitle(id: string) {
    await this.idSearch.click();
    await this.idSearch.fill(id);
    await this.page.locator(".oxd-select-wrapper").nth(2).click();
    await this.page
      .locator('//div[@role="listbox"]/div[@role="option"]')
      .filter({ hasText: "Automaton Tester" })
      .click();
    await this.searchBtn.click();
  }

  //Reset
  async reset() {
    await this.resetBtn.click();
  }

  //Add Employee
  async add(firstName: string, lastName: string) {
    await this.addBtn.click();
    const employeeId = Math.floor(1000 + Math.random() * 9000).toString();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.idInput.fill(employeeId);
    await this.saveBtn.click();
    return employeeId;
  }

  //Update
  async update(employeeId: string) {
    await this.page
      .locator(".oxd-table-card")
      .filter({
        has: this.page.locator(".oxd-table-cell", {
          hasText: `${employeeId}`,
        }),
      })
      .click();
    await this.lastNameInput.click();
    await this.lastNameInput.fill("Khoa Update");
    await this.saveBtn.first().click();
    await this.checkToastUpdate(false);

    //job
    await this.job.click();
    await this.page.locator(".oxd-select-wrapper").first().click();
    await this.page
      .locator('//div[@role="listbox"]/div[@role="option"]')
      .filter({ hasText: "Automaton Tester" })
      .click();
    await this.saveBtn.click();
    await this.checkToastUpdate(true);
  }

  async checkToastUpdate(flag: boolean) {
    const toast = this.page.locator('//p[text()="Successfully Updated"]');
    await expect(toast).toBeVisible({ timeout: 5000 });
    if (flag) {
      await expect(this.page).toHaveURL(/viewJobDetails/);
    } else {
      await expect(this.page).toHaveURL(/viewPersonalDetails/);
    }
  }

  //Delete employee
  async delete(id: string) {
    const row = this.page
      .locator(".oxd-table-card")
      .filter({ hasText: `${id}` });
    const btn = row.locator(".oxd-table-cell-actions button").last();
    btn.waitFor({ state: "visible", timeout: 5000 });
    await btn.click();

    await this.deleteBtn.waitFor({ state: "visible" });
    await this.deleteBtn.click();
  }
}
