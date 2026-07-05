function buildAnalysisPrompt(userPrompt, dashboardData) {
    return `
You are an AI Release Assistant.

The user asked:
"${userPrompt}"

You received the following SVT dashboard data:
${JSON.stringify(dashboardData, null, 2)}

Generate a professional build health summary with:

1. Build Number
2. Execution Summary
3. Failed / Incomplete observations
4. Risk Level
5. Recommendation

Keep the response concise and suitable for a release review.
`;
}

module.exports = { buildAnalysisPrompt };