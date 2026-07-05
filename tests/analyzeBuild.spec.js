const { test, expect } = require('@playwright/test');

const DashboardPage = require('../pages/DashboardPage');
const DashboardTool = require('../mcp/DashboardTool');
const ToolRegistry = require('../mcp/ToolRegistry');
const BuildAnalysisAgent = require('../ai/BuildAnalysisAgent');

test('Agentic AI analyzes SVT dashboard build using MCP-style tool registry', async ({ page }) => {

    const dashboardPage = new DashboardPage(page);

    const dashboardTool = new DashboardTool(dashboardPage);

    const toolRegistry = new ToolRegistry();
    toolRegistry.registerTool("dashboard", dashboardTool);

    const agent = new BuildAnalysisAgent(toolRegistry);

    const prompt = "Analyze build s2602162137 and summarize execution health";

    const aiSummary = await agent.processPrompt(prompt);

    console.log(aiSummary);

    expect(aiSummary).toContain('s2602162137');
    expect(aiSummary).toContain('SUCCESS');
});