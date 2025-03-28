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

app.http('save', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const body = await request.json();
        const { userId, category, imageUrl, botResponse } = body;

        // Validate required fields
        if (!userId || !category || !botResponse) {
            return {
                body: `Missing required fields: userId, category, or botResponse.`,
                status: 400, // Bad Request
            };
        }

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Create the document to save
        const document = {
            userId,
            category,
            imageUrl: imageUrl || null, // Make imageUrl optional
            botResponse,
            timestamp: new Date().toISOString(),
        };

        // Save the document to Cosmos DB
        const { resource } = await container.items.create(document);

        context.log(`Document saved successfully: ${JSON.stringify(resource)}`);
        return {
            status: 200,
            body: JSON.stringify('{saved!!}'), // Serialize the response to JSON
            headers: { "Content-Type": "application/json" }, // Set the Content-Type header
        };
    }
});
