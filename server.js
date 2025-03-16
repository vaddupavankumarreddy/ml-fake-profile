const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');  // Import Axios to connect with ML API

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema for User Profiles
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    bio: String,
    profile_score: Number,
    is_fake: Boolean,  // ML-based prediction
});

const User = mongoose.model('User', UserSchema);

// Add User with ML Prediction (Modified Code)
app.post('/addUser', async (req, res) => {
    const profileData = req.body;

    try {
        // Call ML Model API to predict fake profile
        const mlResponse = await axios.post('http://localhost:5001/predict', profileData);
        profileData.is_fake = mlResponse.data.is_fake;  // Get ML prediction

        // Save profile data with ML results
        const user = new User(profileData);
        await user.save();
        
        res.json({ message: "User added with verification!", is_fake: profileData.is_fake });
    } catch (error) {
        res.status(500).json({ message: "Error in ML Model", error: error.message });
    }
});

// Get User by Email
app.get('/getUser/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
});

// Update User
app.put('/updateUser/:email', async (req, res) => {
    await User.findOneAndUpdate({ email: req.params.email }, req.body);
    res.json({ message: "User updated successfully!" });
});

// Delete User
app.delete('/deleteUser/:email', async (req, res) => {
    await User.deleteOne({ email: req.params.email });
    res.json({ message: "User deleted successfully!" });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));