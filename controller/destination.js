const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
    //#swagger.tags=["Destination"]
    try {
        const destinations = await mongodb.getDatabase().db('lucky7Travel').collection('destination').find().toArray();


        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(destinations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getSingle = async (req, res) => {
    //#swagger.tags=["Destination"]
    try {
        const destinationId = new ObjectId(req.params.id);
        const destination = await mongodb.getDatabase().db('lucky7Travel').collection('destination').findOne({ _id: destinationId });


        if (!destination) {
            return res.status(404).json({ message: "Destination not found!" })
        }


        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(destination);
    } catch {
        res.status(500).json({ error: err.message });
    }
};


const getAllByCountry = async (req, res) => {
    //#swagger.tags=["Destination"]
    try {
        const country = req.params.country;
        const destinations = await mongodb.getDatabase().db('lucky7Travel').collection('destination').find({ country }).toArray();


        if (destinations.length === 0) {
            return res.status(404).json({ message: `No destinations found in ${country}` });
        }


        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(destinations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getAllByTag = async (req, res) => {
    //#swagger.tags=["Destination"]
    try {
        const tag = req.params.tag;
        const destinations = await mongodb.getDatabase().db('lucky7Travel').collection('destination').find({ tags: tag }).toArray();


        if (destinations.length === 0) {
            return res.status(404).json({ message: `No destinations found with tag "${tag}"` });
        }


        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(destinations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const addDestination = async (req, res) => {
    //#swagger.tags=["Destination"]
    try {
        const newDestination = {
            name: req.body.name,
            city: req.body.city,
            country: req.body.country,
            description: req.body.description,
            tags: req.body.tags,
            rating: 0
        };


        const result = await mongodb.getDatabase().db('lucky7Travel').collection('destination').insertOne(newDestination);


        if (result.acknowledged) {
            res.status(201).json({ message: "Destination has been created!" });
        } else {
            res.status(500).json({ error: "An error occured while inserting." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateDestination = async (req, res) => {
    //#swagger.tags=["Destination"]
    /*#swagger.parameters['body'] = {
      in: 'body',
      description: 'Fields to update (any subset)',
      schema: {
        name: "any",
        city: "any",
        country: "any",
        description: "any",
        tags: ["any", "any"]
      }
    }
    */
    try {
        const destinationId = new ObjectId(req.params.id);
        const exists = await mongodb.getDatabase().db('lucky7Travel').collection('destination').findOne({ _id: destinationId})


        if (!exists) {
            return res.status(404).json({ message: "Destination not found."})
        }


        // Making it so that they can't updated the review field
        const updates = {};
        const updatableFields = ['name', 'city', 'country', 'description', 'tags']
        updatableFields.forEach((f) => {
            if (Object.prototype.hasOwnProperty.call(req.body, f)) {
                updates[f] = req.body[f];
            }
        });


        const result = await mongodb.getDatabase().db('lucky7Travel').collection('destination').updateOne({ _id: destinationId }, { $set: updates } )


        if (result.modifiedCount > 0) {
            res.status(204).json({ message: "Destination was updated." });
        } else {
            res.status(204).json({ message: "Destination was not updated, maybe nothing changed?" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const deleteDestination = async (req, res) => {
    //#swagger.tags=["Destination"]
    try {
        const destinationId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('lucky7Travel').collection('destination').deleteOne({ _id: destinationId });


        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Destination not found" });
        }
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = { getAll, getSingle, getAllByCountry, getAllByTag, addDestination, updateDestination, deleteDestination }