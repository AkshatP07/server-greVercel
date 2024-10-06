const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get current user profile
exports.getCurrentUser = async (req, res) => {
    try {
        console.log('try');
        const token = req.cookies.token; // Extract token from cookies
        console.log("Token received:", token); // Log the received token
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        console.log("Decoded token:", decoded); // Log decoded token

        const user = await User.findByPk(decoded.id); // Find user by ID in the token

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user data excluding password
        console.log("User profile found:", user);
        
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            dob: user.dob 
        });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, dob } = req.body; // Include dob in destructuring

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with dob
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role, 
            dob // Add dob here
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1hr' });

        console.log("Token generated", token);

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript access to the cookie
           secure: false, // Use secure flag in production
            maxAge: 3600000,
            sameSite: 'Lax' // Set the cookie to expire in 1 hour
        });

        console.log("Cookie set with token.");

        // Respond with user details excluding password
        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email,dob:user.dob, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users (Optional for listing users)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
