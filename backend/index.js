import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Article } from "./models/articleModel.js";

const app = express();

// middleware to parse request body
app.use(express.json());

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to MERN Stack Tutorial')
});

// route for saving articles

app.post('/articles', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.link ||
            !request.body.text ||
            !request.body.summary ||
            !request.body.guardian_link
        ) {
            return response.status(500).send({
                message: 'Send all required fields: title, link, text, summary, guardian_link',
            });
        }

        const newArticle = {
            title: request.body.title,
            link: request.body.link,
            text: request.body.text,
            summary: request.body.summary,
            guardian_link: request.body.guardian_link
        }

        const article = await Article.create(newArticle);

        return response.status(201).send(article);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

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