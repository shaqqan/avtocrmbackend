/**
 * High-performance production startup script
 * Optimized for 5-10ms response times
 */

// Set production environment variables for maximum performance
process.env.NODE_ENV = 'production';
process.env.UV_THREADPOOL_SIZE = '128'; // Increase libuv thread pool
process.env.NODE_OPTIONS = '--max-old-space-size=2048 --optimize-for-size'; // Memory optimization

// Enable clustering for multi-core utilization
require('./dist/common/clustering/cluster.js');