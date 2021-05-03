import express from 'express';
import applyRoutes from './applyRoutes';
const app = express();
applyRoutes(app);

export default app;
