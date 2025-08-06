const cluster = require('cluster');
const os = require('os');

/**
 * High-performance clustering setup for maximum CPU utilization
 * Enables horizontal scaling across all CPU cores
 */
function setupClustering() {
  const numCPUs = os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`🚀 Primary process ${process.pid} is running`);
    console.log(`🔄 Forking ${numCPUs} worker processes...`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Restart worker if it dies
    cluster.on('exit', (worker, code, signal) => {
      console.log(
        `💥 Worker ${worker.process.pid} died with code ${code} and signal ${signal}`,
      );
      console.log('🔄 Starting a new worker...');
      cluster.fork();
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📡 SIGTERM received, shutting down gracefully...');
      for (const id in cluster.workers) {
        cluster.workers[id]?.kill();
      }
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('📡 SIGINT received, shutting down gracefully...');
      for (const id in cluster.workers) {
        cluster.workers[id]?.kill();
      }
      process.exit(0);
    });
  } else {
    // Worker process - import and run the main application
    console.log(`👷 Worker ${process.pid} started`);
    require('../../../main');
  }
}

// Export the function
module.exports = { setupClustering };

// Enable clustering only in production for maximum performance
if (
  process.env.NODE_ENV === 'production' &&
  process.env.ENABLE_CLUSTERING !== 'false'
) {
  setupClustering();
} else {
  // Development mode - run single process
  require('../../../main');
}
