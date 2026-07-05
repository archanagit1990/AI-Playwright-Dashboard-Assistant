class BuildSummaryAgent {

    async analyzeBuild(buildNumber, dashboard) {

        await dashboard.openDashboard();

        await dashboard.searchBuild(buildNumber);

        const summary = await dashboard.getSummaryText();

        const rows = await dashboard.getResultsCount();

        return {
            build: buildNumber,
            summary: summary,
            totalRows: rows
        };

    }

}

module.exports = BuildSummaryAgent;