const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        guardian_link: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        datestamp: {
            type: String,
            required: true
        }
    }, {
    timestamps: true,
});

module.exports = mongoose.model('Article', ArticleSchema);