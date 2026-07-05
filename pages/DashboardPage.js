class DashboardPage {

    constructor(page) {
        this.page = page;
        this.searchBox = page.locator('#buildSearch');
        this.searchButton = page.locator('#searchBtn');
        this.summary = page.locator('#summary');
        this.resultsRows = page.locator('#resultsTable tr');
    }

    async openDashboard() {
        await this.page.goto('file:///C:/Users/user/Downloads/Archana/Playwright_MCP/dashboard-app/index.html');
    }

    async searchBuild(buildNumber) {

        await this.searchBox.fill(buildNumber);
        await this.searchButton.click();
        
    }

    async getSummaryText() {
        return await this.summary.textContent();
    }

    async getResultsCount() {
        return await this.resultsRows.count();
    }
}

module.exports = DashboardPage;