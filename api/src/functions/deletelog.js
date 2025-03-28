const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

if (!process.env.COSMOS_DB_KEY) {
    throw new Error("COSMOS_DB_KEY environment variable is not set.");
}

const cosmosClient = new CosmosClient({
    endpoint: 'https://kaliaihackathon.documents.azure.com:443/',
    key: process.env.COSMOS_DB_KEY,
});

const databaseId = "kaliaidb";
const containerId = "meals";

app.http('deletelog', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Extract query parameters
        const userId = request.query.get('userId');
        const foodId = request.query.get('foodId');

        const document = {
            userId,
            foodId
        };

        console.log(document);

        try {
            // Delete the item from Cosmos DB
            const { resource } = await container.item(foodId, userId).delete();

            context.log(`Document deleted successfully: ${JSON.stringify(resource)}`);
            return {
                status: 200,
                body: JSON.stringify({ message: 'Log deleted successfully', resource }),
                headers: { "Content-Type": "application/json" },
            };
        } catch (error) {
            context.log(`Error deleting document: ${error.message}`);
            return {
                status: 500,
                body: JSON.stringify({ error: 'Failed to delete log', details: error.message }),
                headers: { "Content-Type": "application/json" },
            };
        }
    }
});
