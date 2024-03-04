import express from 'express';
import { Article } from '../models/articleModel.js';

const router = express.Router();

// route for saving articles
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.link ||
            !request.body.text ||
            !request.body.summary ||
            !request.body.guardian_link
        ) {
            return response.status(400).send({
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

// route to get all articles
router.get('/', async (request, response) => {
    try {
        const articles = await Article.find({});
        return response.status(200).json({
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// route to get article by id
// router.get('/:id', async (request, response) => {
//     try {

//         const { id } = request.params;

//         const article = await Article.findById(id);
//         return response.status(200).json(article);
//     } catch (error) {
//         console.log(error.message);
//         response.status(500).send({ message: error.message });
//     }
// });

// route to get article by index
router.get('/:index', async (request, response) => {
    try {

        const { index } = request.params;

        const article = await Article.find({ index: index });
        return response.status(200).json(article);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// route to update an article
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.link ||
            !request.body.text ||
            !request.body.summary ||
            !request.body.guardian_link
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, link, text, summary, guardian_link',
            });
        }

        const { id } = request.params;

        const result = await Article.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Article not found' });
        }
        return response.status(200).send({ message: 'Article updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


// route to delete article
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Article.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Article not found' });
        }
        return response.status(200).send({ message: 'Article deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})

export default router;