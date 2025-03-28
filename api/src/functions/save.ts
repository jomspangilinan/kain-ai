import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

if (!process.env.COSMOS_DB_KEY) {
    throw new Error("COSMOS_DB_KEY environment variable is not set.");
}

const cosmosClient = new CosmosClient({
    endpoint: 'https://kaliaihackathon.documents.azure.com:443/',
    key: process.env.COSMOS_DB_KEY,
});

const databaseId = "kaliaidb";
const containerId = "meals";

export async function save(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        context.log(`HTTP function processed request for URL: "${request.url}"`);

        // Define the expected structure of the request body
        interface RequestBody {
            userId: string;
            category: string;
            imageUrl?: string;
            botResponse: string;
        }

        // Parse the request body
        const body = await request.json() as RequestBody;
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
        return { body: `Document saved successfully!`, status: 200 };
    } catch (error) {
        context.log("Error saving to Cosmos DB:", error);
        return {
            body: `Failed to save document. Error: ${error.message}`,
            status: 500, // Internal Server Error
        };
    }
}

// Register the HTTP function
app.http('save', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: save,
});