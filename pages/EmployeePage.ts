import { expect, Locator, Page } from "@playwright/test";
import { employeeLocator } from "../utils/locator/employee";

export class EmployeePage {
  private readonly page: Page;
  private locators;

  constructor(page: Page) {
    this.page = page;
    this.locators = employeeLocator(page);
  }

  //Navigate to PIM
  async navigateToPIM() {
    this.locators.pimMenu.click();
  }

  //Search by status and Sub Unit
  async searchByStatusAndSubUnit(status: string, subUnit: string) {
    await this.locators.statusDropDown.click();
    await this.page
      .locator(`//div[@role="listbox"]/div[@role="option"]`)
      .filter({ hasText: `${status}` })
      .click();

    await this.locators.subUnitDropDown.click();
    await this.page
      .locator(`//div[@role="listbox"]/div[@role="option"]`)
      .filter({ hasText: `${subUnit}` })
      .click();

    await this.locators.searchBtn.click();
  }

  //Search by Employee Id
  async searchByEmployeeId(id: string) {
    console.log(id);
    await this.locators.idSearch.click();
    await this.locators.idSearch.fill(id);
    await this.locators.searchBtn.click();
    // await this.page.waitForLoadState("networkidle");
  }

  async searchByIdAndJobTitle(id: string) {
    await this.locators.idSearch.click();
    await this.locators.idSearch.fill(id);
    await this.page.locator(".oxd-select-wrapper").nth(2).click();
    await this.page
      .locator('//div[@role="listbox"]/div[@role="option"]')
      .filter({ hasText: "Automaton Tester" })
      .click();
    await this.locators.searchBtn.click();
  }

  //Reset
  async reset() {
    await this.locators.resetBtn.click();
  }

  //Add Employee
  async add(firstName: string, lastName: string) {
    await this.locators.addBtn.click();
    const employeeId = Math.floor(1000 + Math.random() * 9000).toString();
    await this.locators.firstNameInput.fill(firstName);
    await this.locators.lastNameInput.fill(lastName);
    await this.locators.idInput.fill(employeeId);
    await this.locators.saveBtn.click();
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
    await this.locators.lastNameInput.click();
    await this.locators.lastNameInput.fill("Khoa Update");
    await this.locators.saveBtn.first().click();
    await this.checkToastUpdate(false);

    //job
    await this.locators.job.click();
    await this.page.locator(".oxd-select-wrapper").first().click();
    await this.page
      .locator('//div[@role="listbox"]/div[@role="option"]')
      .filter({ hasText: "Automaton Tester" })
      .click();
    await this.locators.saveBtn.click();
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

    await this.locators.deleteBtn.waitFor({ state: "visible" });
    await this.locators.deleteBtn.click();
  }
}
