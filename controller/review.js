const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const reviewUpdater = require('../utilities/reviewUpdater'); // Adjust path if needed


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
            .find({ destinationId: placeId })
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

const createReview = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const newReview = {
            userId: req.body.userId,
            destinationId: req.body.destinationId,
            rating: req.body.rating,
            reviewText: req.body.reviewText,
            visitDate: req.body.visitDate,
            reviewDate: req.body.reviewDate
        }

        const result = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('review')
            .insertOne(newReview);

        if (result.acknowledged) {
            await reviewUpdater.updateDestinationAverage(newReview.destinationId);
            res.status(201).json({ message: 'Review created successfully', id: result.insertedId });
        } else {
            res.status(400).json({ error: 'Failed to create Review' });
        };
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateReview = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const reviewId = new ObjectId(req.params.id);
        const updateFields = {};
        const reviewFields = ['userId', 'destinationId', 'rating', 'reviewText', 'reviewDate'];

        // const updateFields = Object.fromEntries(
        //     fields
        //         .filter(field => req.body[field] !== undefined)
        //         .map(field => [field, req.body[field]])
        // );

        for (const field of reviewFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        const result = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('review')
            .updateOne(
                { _id: reviewId}, 
                { $set: updateFields }
            );

        if (result.modifiedCount > 0) {
            //Need to add this here to make sure it can either grab the id from the db or from the input.
            const destinationId = req.body.destinationId || (await mongodb.getDatabase()
                .db('lucky7Travel')
                .collection('review')
                .findOne({ _id: reviewId })).destinationId;
            
            await reviewUpdater.updateDestinationAverage(destinationId);
            res.status(200).json({ message: 'Review updated successfully' });
        } else {
            res.status(404).json({ error: 'Rwview not found or no changes applied' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteReview = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const reviewId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('review')
            .deleteOne({ _id: reviewId });

        if (result.deletedCount > 0 ) {
            await reviewUpdater.updateDestinationAverage(review.destinationId);
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { 
    getAll, 
    getSingle, 
    getByDestination, 
    getByUser, 
    createReview,
    updateReview,
    deleteReview 
};