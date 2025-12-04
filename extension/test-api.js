// Simple test API server for LinkedIn Connections Fetcher
// Run this to test the extension's API integration

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Store received connections
let receivedConnections = [];
let requestCount = 0;

// Test endpoint
app.post('/linkedin/connections', (req, res) => {
    requestCount++;
    const connection = req.body;
    const authHeader = req.headers.authorization;
    
    console.log(`\n📥 Request #${requestCount} received:`);
    console.log('🔐 Auth Header:', authHeader ? 'Present' : 'Missing');
    console.log('📊 Connection Data:', JSON.stringify(connection, null, 2));
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'url'];
    const missingFields = requiredFields.filter(field => !connection[field]);
    
    if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
        return res.status(400).json({
            error: 'Missing required fields',
            missing: missingFields
        });
    }
    
    // Store the connection
    receivedConnections.push({
        ...connection,
        received_at: new Date().toISOString(),
        request_id: requestCount
    });
    
    console.log('✅ Connection saved successfully');
    console.log(`📈 Total connections received: ${receivedConnections.length}`);
    
    res.status(200).json({
        success: true,
        message: 'Connection saved successfully',
        connection_id: requestCount,
        total_connections: receivedConnections.length
    });
});

// Get all received connections
app.get('/linkedin/connections', (req, res) => {
    res.json({
        connections: receivedConnections,
        total: receivedConnections.length,
        last_updated: new Date().toISOString()
    });
});

// Clear all connections
app.delete('/linkedin/connections', (req, res) => {
    receivedConnections = [];
    requestCount = 0;
    res.json({
        success: true,
        message: 'All connections cleared'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connections_received: receivedConnections.length
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Test API server running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log(`   POST   http://localhost:${PORT}/linkedin/connections`);
    console.log(`   GET    http://localhost:${PORT}/linkedin/connections`);
    console.log(`   DELETE http://localhost:${PORT}/linkedin/connections`);
    console.log(`   GET    http://localhost:${PORT}/health`);
    console.log('\n🎯 Ready to receive connections from the extension!');
    console.log('💡 Open the extension and click "Connect LinkedIn" to test');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n📊 Final Statistics:');
    console.log(`   Total connections received: ${receivedConnections.length}`);
    console.log(`   Total requests processed: ${requestCount}`);
    console.log('\n👋 Test server shutting down...');
    process.exit(0);
}); 