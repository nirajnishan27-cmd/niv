require('dotenv').config();
const express = require('express');
const path = require('path');
const enquiryRouter = require('./routes/enquiry');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'html');
app.engine('html', require('fs').readFile.bind(require('fs')));
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/api', enquiryRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h2>Page not found</h2><a href="/">Go Home</a>');
});

app.listen(PORT, () => {
  console.log(`\n🌴 Villa Serenidade is running!`);
  console.log(`👉  Open: http://localhost:${PORT}\n`);
});
