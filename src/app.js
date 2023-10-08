import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { __dirname } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars";
import http from 'http';
import { connectMongo } from "./utils/mongo.js";
import { socketServerHandler } from "./utils/socket-io.js";
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import dotenv from "dotenv";
import sessionRoutes from './routes/sessionsRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import errorHandler from "./middlewares/error.js";

const app = express();
const port = 8080;

connectMongo();

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/auth/login`);
});

socketServerHandler(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


dotenv.config();
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);


iniPassport();
app.use(passport.initialize());
app.use(passport.session());


app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', chatRoutes);
app.use('/', authRoutes);
app.use('/', sessionRoutes);
app.use('/', ticketRoutes);
app.use(errorHandler);


app.get("*", (req, res) => {
  return res.redirect("/auth/login");
});
