import express from 'express'; 
import cors from 'cors'; 
import helmet from 'helmet'; 

import healthRoutes from './routes/health.routes.js'; 
import authRoutes from './routes/auth.routes.js'; 
import deliveryRoutes from "./routes/delivery.routes.js";

import { notFoundHandler } from './middleware/not-found.middleware.js'; 
import { errorHandler } from './middleware/error.middleware.js'; 

const app = express(); 

// 1. Global Pre-routing Middleware
app.use(helmet()); 
app.use( 
  cors({ origin: process.env.FRONTEND_URL || 'https://reflex-control-room-ui--iamher26.replit.app' }) 
); 
app.use(express.json()); // <--- MOVED HERE: Now runs before all routes

// 2. Feature Routes
app.use("/api/v1/deliveries", deliveryRoutes);
app.use('/api/v1/health', healthRoutes); 
app.use('/api/v1/auth', authRoutes);

// 3. Post-routing Error Handlers
app.use(notFoundHandler); 
app.use(errorHandler); 

export default app;
