class ToolRegistry {

    constructor() {
        this.tools = {};
    }

    registerTool(toolName, toolInstance) {
        this.tools[toolName] = toolInstance;
    }

    getTool(toolName) {
        return this.tools[toolName];
    }
}

module.exports = ToolRegistry;