require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to database
connectToDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🏥 MedSync Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});