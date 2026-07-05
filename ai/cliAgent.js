const { chromium } = require('playwright');

const DashboardPage = require('../pages/DashboardPage');
const DashboardMCPTool = require('../mcp/DashboardTool');
const ToolRegistry = require('../mcp/ToolRegistry');
const BuildAnalysisAgent = require('./BuildAnalysisAgent');

async function main() {
    const prompt = process.argv.slice(2).join(" ");

    if (!prompt) {
        console.log("Please provide a prompt.");
        console.log('Example: node ai/cliAgent.js "Analyze build s2602162137"');
        return;
    }

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();

    const dashboardPage = new DashboardPage(page);
    const dashboardTool = new DashboardMCPTool(dashboardPage);

    const registry = new ToolRegistry();
    registry.registerTool("dashboard", dashboardTool);

    const agent = new BuildAnalysisAgent(registry);

    const summary = await agent.processPrompt(prompt);

    console.log(summary);

    await browser.close();
}

main();