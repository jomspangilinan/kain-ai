const express = require("express");
const { CosmosClient } = require("@azure/cosmos");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Cosmos DB configuration
const cosmosClient = new CosmosClient({
    endpoint: 'https://kaliaihackathon.documents.azure.com:443/',
    key: process.env.COSMOS_DB_KEY,
});
const databaseId = "kaliaidb";
const containerId = "meals";

// Route to save data to Cosmos DB
app.post("/api/save", async (req, res) => {
    try {
        const { userId, category, imageUrl, botResponse } = req.body;

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        const document = {
            userId,
            category,
            imageUrl,
            botResponse,
            timestamp: new Date().toISOString(),
        };

        const { resource } = await container.items.create(document);
        res.status(200).json({ message: "Data saved successfully", resource });
    } catch (error) {
        console.error("Error saving to Cosmos DB:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

app.get("/api/foodlogs", async (req, res) => {
    try {
        const { userId, date } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Query to retrieve food logs for the user
        let query = `SELECT * FROM c WHERE c.userId = @userId`;
        const parameters = [{ name: "@userId", value: userId }];

        // If a date is provided, filter by date
        if (date) {
            query += ` AND STARTSWITH(c.timestamp, @date)`;
            parameters.push({ name: "@date", value: date });
        }

        const { resources } = await container.items
            .query({ query, parameters })
            .fetchAll();

        res.status(200).json(resources);
    } catch (error) {
        console.error("Error retrieving food logs from Cosmos DB:", error);
        res.status(500).json({ error: "Failed to retrieve food logs" });
    }
});


app.get("/api/foodlogs", async (req, res) => {
    try {
        const { userId, date } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Query to retrieve food logs for the user
        let query = `SELECT * FROM c WHERE c.userId = @userId`;
        const parameters = [{ name: "@userId", value: userId }];

        // If a date is provided, filter by date
        if (date) {
            query += ` AND STARTSWITH(c.timestamp, @date)`;
            parameters.push({ name: "@date", value: date });
        }

        const { resources } = await container.items
            .query({ query, parameters })
            .fetchAll();

        res.status(200).json(resources);
    } catch (error) {
        console.error("Error retrieving food logs from Cosmos DB:", error);
        res.status(500).json({ error: "Failed to retrieve food logs" });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});