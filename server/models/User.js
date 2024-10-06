const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Import sequelize

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Member' // default to member if not provided
    },
    dob: { // Add the dob field here
        type: DataTypes.DATE, // Change to appropriate type if needed
        allowNull: true // Allow null values if date of birth is optional
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
