import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Article } from "./models/articleModel.js";
import articlesRoutes from "./routes/articlesRoutes.js"
import cors from 'cors';

const app = express();

// middleware to parse request body
app.use(express.json());

app.use(cors());

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to MERN Stack Tutorial')
});

app.use('/articles', articlesRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to DB.');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });