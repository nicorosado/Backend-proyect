import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});

export default {
  port: process.env.PORT,
  clientId:process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};
