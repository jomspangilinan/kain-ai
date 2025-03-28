const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
if (!process.env.COSMOS_DB_KEY) {
    throw new Error("COSMOS_DB_KEY environment variable is not set.");
}

const cosmosClient = new CosmosClient({
    endpoint: 'https://kaliaihackathon.documents.azure.com:443/',
    key: process.env.COSMOS_DB_KEY,
});

const databaseId = "kaliaidb";
const containerId = "meals";

app.http('message', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
    }
});
