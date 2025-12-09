const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const updateDestinationAverage = async (destinationId) => {
    const reviews = await mongodb.getDatabase()
        .db('lucky7Travel')
        .collection('review')
        .find({ destinationId: destinationId })
        .toArray();
    
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
    
    await mongodb.getDatabase()
        .db('lucky7Travel')
        .collection('destination')
        .updateOne(
            { _id: new ObjectId(destinationId) },
            { $set: { rating: parseFloat(averageRating.toFixed(1)), totalReviews: reviews.length } }
        );
};

module.exports = { updateDestinationAverage };