const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Import sequelize
const User = require('./User'); // Import User model for association

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('todo', 'in-progress', 'done'),
        defaultValue: 'todo'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    description: {
        type: DataTypes.TEXT
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow tasks to be unassigned
        references: {
            model: User,
            key: 'id'
        }
    },
    createdBy: {
        type: DataTypes.INTEGER, // Track the admin who created the task
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'tasks',
    timestamps: false
});

// Associations
Task.belongsTo(User, { foreignKey: 'userId', as: 'assignedUser' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = Task;

