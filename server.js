const express = require('express');
const app = express();
const { mongoose } = require('./database/database.js');
const { PORT } = require('./config.js');
const BASE_URL = `http://localhost`;

// Middlewares
app.use(express.json());

// Routers
const routerOutgoing = require('./routers/gastos_routes.js');
const routerIncoming = require('./routers/entrantes_routes.js');
app.use('/api/gastos', routerOutgoing);
app.use('/api/entrantes', routerIncoming);

// Routing
app.get('/', (req, res) => {
  res.send('server');        
});

//start server
app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en ${BASE_URL}:${PORT}...`);      
});
