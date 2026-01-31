import { Page } from "@playwright/test";
import { AuthPage } from "./AuthPage";
import { AdminPage } from "./AdminPage";
import { EmployeePage } from "./EmployeePage";

export class PageManager {
    readonly page: Page
    private readonly authPage: AuthPage
    private readonly adminPage: AdminPage
    private readonly employeePage: EmployeePage

    constructor(page: Page) {
        this.page = page
        this.authPage = new AuthPage(this.page)
        this.adminPage = new AdminPage(this.page)
        this.employeePage = new EmployeePage(this.page)
    }

    public auth() {
        return this.authPage
    }

    public admin() {
        return this.adminPage
    }

    public employee() {
        return this.employeePage
    }
}