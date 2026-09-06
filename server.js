const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Serve static assets from the compiled Vite React frontend
const viteBuildPath = path.join(__dirname, 'artifacts/reflex-control-room/dist');
app.use(express.static(viteBuildPath));

// Backend API routes (Import your routes here if applicable)
// e.g., app.use('/api', backendProxyRouter);

// Fallback route: serve index.html for React Router single-page app routes
app.get('*', (req, res) => {
  res.sendFile(path.join(viteBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});