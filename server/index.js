const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/feedback', feedbackRoutes); // New feedback route



const PORT = process.env.PORT ;



app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is running on http://localhost:${PORT}`);
        
        // Sync all models with the database
        await sequelize.sync({ force: true }); // 'force: true' will drop existing tables and recreate them
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

