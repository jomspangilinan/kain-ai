const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

// Expect these environment variables to be set
const endpoint = 'https://kaliaihackathon.documents.azure.com:443/';
const key = 'TEST';

if (!endpoint || !key) {
    throw new Error("Please set COSMOS_DB_ENDPOINT and COSMOS_DB_KEY environment variables.");
}

// Create CosmosClient instance
const cosmosClient = new CosmosClient({ endpoint, key });

// References for database and container
const databaseId = "kaliaidb";
const containerId = "meals";

app.http('message', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for URL: "${request.url}"`);

        // Handle GET: Retrieve all items from "kaliaidb" > "meals"
        if (request.method === 'GET') {
            try {
                const container = cosmosClient.database(databaseId).container(containerId);
                // Read all items in the container
                const { resources: items } = await container.items.readAll().fetchAll();
                return {
                    status: 200,
                    body: JSON.stringify(items),
                    headers: { "Content-Type": "application/json" },
                };
            } catch (error) {
                context.log.error('Error fetching items from Cosmos DB:', error);
                return {
                    status: 500,
                    body: 'Error retrieving items from the database',
                };
            }
        }

        // Handle POST: Create a new item in the "meals" container
        if (request.method === 'POST') {
            try {
                const container = cosmosClient.database(databaseId).container(containerId);
                // We expect the request body (JSON) to have the item data
                const body = await request.json();
                const { resource: createdItem } = await container.items.create(body);

                return {
                    status: 201, // "Created"
                    body: JSON.stringify(createdItem),
                    headers: { "Content-Type": "application/json" },
                };
            } catch (error) {
                context.log.error('Error creating item in Cosmos DB:', error);
                return {
                    status: 500,
                    body: 'Error creating item in the database',
                    headers: { "Content-Type": "application/json" },
                };
            }
        }

        // If we get here, it’s an unsupported method
        return {
            status: 405,
            body: `Method ${request.method} is not supported on this endpoint.`,
        };
    }
});
