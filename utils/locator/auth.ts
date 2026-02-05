import { Page } from "@playwright/test";

export const authLocator = (page: Page) => ({
  //login
  usernameInput: page.locator("//input[@name='username']"),
  passwordInput: page.locator("//input[@name='password']"),
  loginBtn: page.locator("//button[@type='submit']"),

  //error
  requiredError: page.locator("//span[text()='Required']"),
  invalidError: page.locator("p.oxd-alert-content-text"),

  //logout
  userDropDown: page.locator("li.oxd-userdropdown"),
  logoutBtn: page.locator(
    "//a[@class='oxd-userdropdown-link' and text()='Logout']",
  ),
});
