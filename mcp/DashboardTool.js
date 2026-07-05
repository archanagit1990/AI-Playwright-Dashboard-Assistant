class DashboardTool {
    constructor(dashboardPage) {
        this.dashboardPage = dashboardPage;
    }

    async analyzeBuild(buildNumber) {
        await this.dashboardPage.openDashboard();
        await this.dashboardPage.searchBuild(buildNumber);

        const summary = await this.dashboardPage.getSummaryText();
        const totalRows = await this.dashboardPage.getResultsCount();

        return {
            toolName: "DashboardTool",
            action: "analyzeBuild",
            buildNumber,
            summary,
            totalRows,
            status: totalRows > 0 ? "SUCCESS" : "NO_DATA"
        };
    }
}

module.exports = DashboardTool;