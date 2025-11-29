const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const itineraries = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .find()
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const itineraryId = new ObjectId(req.params.id);
        const itinerary = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .findOne({ _id: itineraryId });

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found!" });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(itinerary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByUser = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const userId = req.params.userId;
        const itineraries = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .find({ userId: userId })
            .toArray();

        if (itineraries.length === 0) {
            return res.status(404).json({ message: `No itineraries found for user ${userId}` });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByDestination = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const destinationId = req.params.destinationId;
        const itineraries = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .find({ "destinations": destinationId })
            .toArray();

        if (itineraries.length === 0) {
            return res.status(404).json({ message: `No itineraries include destination ${destinationId}` });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createItinerary = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const newItinerary = {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            destinations: req.body.destinations || [], 
            isPublic: req.body.isPublic || false
        };

        const result = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .insertOne(newItinerary);

        if (result.acknowledged) {
            res.status(201).json({ 
                message: "Itinerary created successfully!",
                itineraryId: result.insertedId 
            });
        } else {
            res.status(500).json({ error: "Failed to create itinerary." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateItinerary = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const itineraryId = new ObjectId(req.params.id);
        
        // Check if exists
        const exists = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .findOne({ _id: itineraryId });

        if (!exists) {
            return res.status(404).json({ message: "Itinerary not found." });
        }

        const updates = {};
        const fields = ['title', 'description', 'startDate', 'endDate', 'destinations', 'isPublic'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const result = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .updateOne({ _id: itineraryId }, { $set: updates });

        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(200).json({ message: "No changes made to itinerary." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteItinerary = async (req, res) => {
    //#swagger.tags=["Itinerary"]
    try {
        const itineraryId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('itinerary')
            .deleteOne({ _id: itineraryId });

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Itinerary not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    getByUser,
    getByDestination,
    createItinerary,
    updateItinerary,
    deleteItinerary
};