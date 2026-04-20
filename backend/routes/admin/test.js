const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const mongoose = require('mongoose');

// Test endpoint to check database connection and fetch reports
router.get('/test-reports', async (req, res) => {
  try {
    // Check MongoDB connection
    const db = mongoose.connection;
    const isConnected = db.readyState === 1;

    if (!isConnected) {
      return res.status(500).json({
        success: false,
        error: 'Not connected to MongoDB'
      });
    }

    // Try to fetch all reports (limited to 10 for testing)
    const reports = await Report.find({}).limit(10).lean();

    // Get collection stats
    const stats = await db.db.command({ collStats: 'reports' });

    res.json({
      success: true,
      dbStatus: {
        host: db.host,
        name: db.name,
        readyState: ['disconnected', 'connected', 'connecting', 'disconnecting'][db.readyState],
        collections: (await db.db.listCollections().toArray()).map(c => c.name)
      },
      reportStats: {
        totalReports: stats.count,
        size: stats.size,
        storageSize: stats.storageSize
      },
      sampleReports: reports
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
