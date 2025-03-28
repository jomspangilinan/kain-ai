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

export async function foodLogs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP function processed request for URL: "${request.url}"`);

    try {
        // Extract query parameters
        const userId = request.query.get('userId');
        const date = request.query.get('date');

        // Validate required parameters
        if (!userId) {
            return {
                status: 400, // Bad Request
                body: "The 'userId' query parameter is required.",
            };
        }

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Build the query
        let query = `SELECT * FROM c WHERE c.userId = @userId`;
        const parameters = [{ name: "@userId", value: userId }];

        // Add date filter if provided
        if (date) {
            query += ` AND STARTSWITH(c.timestamp, @date)`;
            parameters.push({ name: "@date", value: date });
        }

        // Execute the query
        const { resources } = await container.items
            .query({ query, parameters })
            .fetchAll();

        // Return the results
        return {
            status: 200,
            body: JSON.stringify(resources), // Serialize the response to JSON
            headers: { "Content-Type": "application/json" }, // Set the Content-Type header
        };
    } catch (error) {
        context.log("Error retrieving food logs from Cosmos DB:", error);
        return {
            status: 500, // Internal Server Error
            body: "Failed to retrieve food logs. Please try again later.",
        };
    }
}

// Register the HTTP function
app.http('foodLogs', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: foodLogs,
});