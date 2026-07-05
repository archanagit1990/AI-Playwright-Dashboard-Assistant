const readline = require('readline');
const { chromium } = require('playwright');

const DashboardPage = require('./pages/DashboardPage');
const DashboardTool = require('./mcp/DashboardTool');
const ToolRegistry = require('./mcp/ToolRegistry');
const BuildAnalysisAgent = require('./ai/BuildAnalysisAgent');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your prompt: ', async (prompt) => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();

    const dashboardPage = new DashboardPage(page);
    const dashboardTool = new DashboardTool(dashboardPage);

    const toolRegistry = new ToolRegistry();
    toolRegistry.registerTool("dashboard", dashboardTool);

    const agent = new BuildAnalysisAgent(toolRegistry);

    const summary = await agent.processPrompt(prompt);

    console.log(summary);

    await browser.close();
    rl.close();
});