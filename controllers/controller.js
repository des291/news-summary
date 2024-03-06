const Article = require("../models/article");
const asyncHandler = require("express-async-handler");

// Display list of all Articles.
exports.index = asyncHandler(async (req, res, next) => {
    const articles = await Article.find({}).exec();
    const datestamp = await Article.distinct('datestamp');
    res.render('index', { articles, datestamp });
});