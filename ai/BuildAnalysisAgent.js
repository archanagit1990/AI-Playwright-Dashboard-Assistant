class BuildAnalysisAgent {

    constructor(toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    extractBuildNumber(prompt) {
        const match = prompt.match(/s\d+/);
        return match ? match[0] : null;
    }

    async processPrompt(prompt) {
        const buildNumber = this.extractBuildNumber(prompt);

        if (!buildNumber) {
            return "No build number found in the prompt.";
        }

        const dashboardTool = this.toolRegistry.getTool("dashboard");

        const result = await dashboardTool.analyzeBuild(buildNumber);

        return `
AI Build Analysis Summary
-------------------------
Build Number: ${result.buildNumber}
Tool Used: ${result.toolName}
Action: ${result.action}
Summary: ${result.summary}
Execution Rows Analyzed: ${result.totalRows}
Status: ${result.status}

Recommendation:
Review failed or incomplete executions before release sign-off.
`;
    }
}

module.exports = BuildAnalysisAgent;