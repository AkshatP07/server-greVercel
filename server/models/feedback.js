const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tasks', // Assuming tasks is the name of the table
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Assuming users is the name of the table
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'feedbacks',
    timestamps: false
});

// Associations can be defined here if needed
module.exports = Feedback;
