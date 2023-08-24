import { config } from 'dotenv';
import { run } from './src/main.js';

config();

await run();
