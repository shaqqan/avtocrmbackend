#!/usr/bin/env node

/**
 * Simple Load Testing Script for Kitob.uz Backend
 * Tests response times and throughput
 */

const http = require('http');
const https = require('https');

class LoadTester {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.endpoints = options.endpoints || [
      '/api/admin/authors',
      '/api/admin/books',
      '/api/admin/genres'
    ];
    this.concurrency = options.concurrency || 100;
    this.duration = options.duration || 60; // seconds
    this.requestsPerSecond = options.requestsPerSecond || 1000;
    
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      responseTimes: [],
      startTime: Date.now()
    };
  }

  async makeRequest(endpoint) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const url = `${this.baseUrl}${endpoint}`;
      
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          this.stats.responseTimes.push(responseTime);
          this.stats.total++;
          this.stats.success++;
          resolve({ success: true, responseTime, statusCode: res.statusCode });
        });
      });

      req.on('error', (err) => {
        this.stats.total++;
        this.stats.failed++;
        resolve({ success: false, error: err.message, responseTime: Date.now() - startTime });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        this.stats.total++;
        this.stats.failed++;
        resolve({ success: false, error: 'Timeout', responseTime: Date.now() - startTime });
      });
    });
  }

  async runConcurrentRequests() {
    const promises = [];
    const endpoint = this.endpoints[Math.floor(Math.random() * this.endpoints.length)];
    
    for (let i = 0; i < this.concurrency; i++) {
      promises.push(this.makeRequest(endpoint));
    }
    
    return Promise.all(promises);
  }

  async run() {
    console.log(`🚀 Starting load test...`);
    console.log(`📊 Target: ${this.requestsPerSecond} req/s for ${this.duration}s`);
    console.log(`🔗 Base URL: ${this.baseUrl}`);
    console.log(`🎯 Endpoints: ${this.endpoints.join(', ')}`);
    console.log(`⚡ Concurrency: ${this.concurrency}`);
    console.log('');

    const interval = 1000 / (this.requestsPerSecond / this.concurrency);
    const endTime = Date.now() + (this.duration * 1000);
    
    let batchCount = 0;
    
    while (Date.now() < endTime) {
      const batchStart = Date.now();
      await this.runConcurrentRequests();
      batchCount++;
      
      // Calculate delay to maintain target RPS
      const batchTime = Date.now() - batchStart;
      const delay = Math.max(0, interval - batchTime);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Progress update every 10 batches
      if (batchCount % 10 === 0) {
        const elapsed = (Date.now() - this.stats.startTime) / 1000;
        const currentRPS = this.stats.total / elapsed;
        console.log(`⏱️  Elapsed: ${elapsed.toFixed(1)}s | Total: ${this.stats.total} | Current RPS: ${currentRPS.toFixed(1)}`);
      }
    }
    
    this.printResults();
  }

  printResults() {
    const totalTime = (Date.now() - this.stats.startTime) / 1000;
    const avgRPS = this.stats.total / totalTime;
    
    // Calculate response time percentiles
    const sortedTimes = this.stats.responseTimes.sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    
    console.log('\n📊 Load Test Results');
    console.log('====================');
    console.log(`⏱️  Duration: ${totalTime.toFixed(2)}s`);
    console.log(`📈 Total Requests: ${this.stats.total}`);
    console.log(`✅ Successful: ${this.stats.success}`);
    console.log(`❌ Failed: ${this.stats.failed}`);
    console.log(`🎯 Target RPS: ${this.requestsPerSecond}`);
    console.log(`📊 Actual RPS: ${avgRPS.toFixed(2)}`);
    console.log(`📉 Success Rate: ${((this.stats.success / this.stats.total) * 100).toFixed(2)}%`);
    console.log('');
    console.log('⏱️  Response Time Percentiles');
    console.log('============================');
    console.log(`P50: ${p50}ms`);
    console.log(`P95: ${p95}ms`);
    console.log(`P99: ${p99}ms`);
    console.log(`📊 Average: ${(this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length).toFixed(2)}ms`);
    console.log(`📊 Min: ${Math.min(...this.stats.responseTimes)}ms`);
    console.log(`📊 Max: ${Math.max(...this.stats.responseTimes)}ms`);
    
    // Performance assessment
    console.log('');
    console.log('🎯 Performance Assessment');
    console.log('========================');
    
    if (p95 <= 5) {
      console.log('✅ EXCELLENT: P95 response time ≤ 5ms (Target achieved!)');
    } else if (p95 <= 10) {
      console.log('🟡 GOOD: P95 response time ≤ 10ms');
    } else if (p95 <= 25) {
      console.log('🟠 ACCEPTABLE: P95 response time ≤ 25ms');
    } else {
      console.log('🔴 NEEDS IMPROVEMENT: P95 response time > 25ms');
    }
    
    if (avgRPS >= this.requestsPerSecond * 0.9) {
      console.log('✅ EXCELLENT: Throughput target achieved!');
    } else if (avgRPS >= this.requestsPerSecond * 0.8) {
      console.log('🟡 GOOD: Throughput target mostly achieved');
    } else {
      console.log('🔴 NEEDS IMPROVEMENT: Throughput target not met');
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      
      switch (key) {
        case 'url':
          options.baseUrl = value;
          break;
        case 'concurrency':
          options.concurrency = parseInt(value);
          break;
        case 'duration':
          options.duration = parseInt(value);
          break;
        case 'rps':
          options.requestsPerSecond = parseInt(value);
          break;
        case 'endpoints':
          options.endpoints = value.split(',');
          break;
      }
    }
  }
  
  const tester = new LoadTester(options);
  tester.run().catch(console.error);
}

module.exports = LoadTester;
