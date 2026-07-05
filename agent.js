const readline = require('readline');
const { chromium } = require('playwright');

const DashboardPage = require('./pages/DashboardPage');
const { askGroq } = require('./groqClient');
const { buildAnalysisPrompt } = require('./promptBuilder');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function understandUserRequest(userPrompt) {
    const response = await askGroq([
        {
            role: "system",
            content: `
You are an AI automation planner.
Extract the user's intent and build number.

Return ONLY valid JSON in this format:
{
  "intent": "analyze_build",
  "buildNumber": "s2602162137"
}

If no build number is found, return:
{
  "intent": "unknown",
  "buildNumber": null
}
`
        },
        {
            role: "user",
            content: userPrompt
        }
    ], 0);

    return JSON.parse(response);
}

async function collectDashboardData(buildNumber) {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();
    const dashboard = new DashboardPage(page);

    await dashboard.openDashboard();
    await dashboard.searchBuild(buildNumber);

    const summary = await dashboard.getSummaryText();
    const totalRows = await dashboard.getResultsCount();

    await browser.close();

    return {
        buildNumber,
        dashboardSummary: summary,
        executionRows: totalRows
    };
}

console.log("====================================");
console.log("SVT AI Dashboard Assistant");
console.log("====================================");

rl.question("Enter your request: ", async (userPrompt) => {
    try {
        const plan = await understandUserRequest(userPrompt);

        if (plan.intent !== "analyze_build" || !plan.buildNumber) {
            console.log("I could not identify a valid build number.");
            console.log("Example: Analyze build s2602162137");
            rl.close();
            return;
        }

        console.log("\nAI Plan:");
        console.log(plan);

        const dashboardData = await collectDashboardData(plan.buildNumber);

        const finalPrompt = buildAnalysisPrompt(userPrompt, dashboardData);

        const aiSummary = await askGroq([
            {
                role: "system",
                content: "You are an AI Release Assistant. Generate concise release-ready summaries."
            },
            {
                role: "user",
                content: finalPrompt
            }
        ]);

        console.log("\nAI Generated Summary:");
        console.log("----------------------");
        console.log(aiSummary);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        rl.close();
    }
});