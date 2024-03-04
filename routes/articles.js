const express = require('express');
const router = express.Router();

const article_controller = require('../controllers/articleController');

// GET articles home page.
router.get("/", article_controller.index);

// GET request for creating Article. NOTE This must come before route for id (i.e. display article).
router.get("/create", article_controller.article_create_get);

// POST request for creating Article.
router.post("/create", article_controller.article_create_post);

// GET request to delete Article.
router.get("/:id/delete", article_controller.article_delete_get);

// POST request to delete Article.
router.post("/:id/delete", article_controller.article_delete_post);

// GET request to update Article.
router.get("/:id/update", article_controller.article_update_get);

// POST request to update Article.
router.post("/:id/update", article_controller.article_update_post);

// GET request for one Article.
router.get("/:id", article_controller.article_detail);

module.exports = router;
