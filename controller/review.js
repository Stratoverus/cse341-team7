const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const review = await mongodb.getDatabase().db('lucky7Travel').collection('review').find().toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const reviewId = new ObjectId(req.params.id);
        const review = await mongodb.getDatabase().db('lucky7Travel').collection('review').findOne({ _id: reviewId });

        if (!review) {
            return res.status(404).json({ message: "Review not found!" })
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByDestination = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const placeId = req.params.id;
        const reviews = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('review')
            .find({ destnationId: placeId })
            .toArray();

        if (reviews.length === 0) {
            return res.status(404).json({ message: "Review not found!" })
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByUser = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const user = req.params.id;
        const reviews = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('review')
            .find({ userId: user })
            .toArray();

        if (reviews.length === 0) {
            return res.status(404).json({ message: "Review not found!" })
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { getAll, getSingle, getByDestination, getByUser };