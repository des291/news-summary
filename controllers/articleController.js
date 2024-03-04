const Article = require("../models/article");
const asyncHandler = require("express-async-handler");

// Display list of all Articles.
exports.index = asyncHandler(async (req, res, next) => {
    const articles = await Article.find({}).exec();
    // res.send(articles)
    res.render('index', { articles });
});

// Display detail page for a specific Article.
exports.article_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Article detail: ${req.params.id}`);
});

// Display Article create form on GET.
exports.article_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Article create GET");
});

// Handle Article create on POST.
exports.article_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Article create POST");
});

// Display Article delete form on GET.
exports.article_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Article delete GET");
});

// Handle Article delete on POST.
exports.article_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Article delete POST");
});

// Display Article update form on GET.
exports.article_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Article update GET");
});

// Handle Article update on POST.
exports.article_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Article update POST");
});