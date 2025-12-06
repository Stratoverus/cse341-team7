const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=["Users"]
    //#swagger.summary = Get all users 
    //#swagger.security = [{ "githubOAuth": ["user:email"] }]
    //#swagger.responses[200] Lists all users - schema => _id, role, name, email, username, password
    try {
        const user = await mongodb.getDatabase().db('lucky7Travel').collection('user').find().toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error - could not find users", error: err });
    }
};

const getSingleUser = async (req, res) => {
    //#swagger.tags=["Users"]
    //#swagger.summary = get a single user - must know the _id
    //#swagger.security = [{ "githubOAuth": ["user:email"] }]
    //#swagger.responses[200] - lists the one user  schema =>  _id, username, name, email, role, password
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userId = new ObjectId(req.params.id);
        const user = await mongodb.getDatabase().db('lucky7Travel').collection("user").findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

/*const createUser = async (req, res) => {
    //#swagger.tags=["Users"]
    //#swagger.summary = creates user and add to database 
    //#swagger.security = [{ "githubOAuth": ["user:email"] }]
    //#swagger.responses[204]
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword
        };
        const response = await mongodb.getDatabase().db('lucky7Travel').collection("user").insertOne(user);
    
        if (response.acknowledged) {
            return res.status(201).json({ message: "User Created", id: response.insertedId });
        }
        res.status(500).json({ message: "Failed to create user" });
    } catch (error) {
        res.status(500).json({ message: "User creation failed" });
    }
};
*/
const updateUser = async (req, res) => {
    //#swagger.tags=["Users"]
    //#swagger.summary = updates user
    //#swagger.security = [{ "githubOAuth": ["user:email"] }]
    //#swagger.responses[204]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userId = new ObjectId(req.params.id);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword
        };

        const response = await mongodb.getDatabase().db('lucky7Travel').collection("user").updateOne({ _id: userId }, { $set: user });
        if (response.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        if (response.modifiedCount === 0) {
            return res.status(200).json({ message: "No changes were made to the user" });
        }

        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=["Users"]
    //#swagger.summary = delete user 
    //#swagger.security = [{ "githubOAuth": ["user:email"] }]
    //#swagger.responses[204]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db('lucky7Travel').collection("user").deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            return res.status(204).send();
        }
        res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while deleting the user." });
    }
};


module.exports = { getAll, getSingleUser, /*createUser,*/ updateUser, deleteUser }