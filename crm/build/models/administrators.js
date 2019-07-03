"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableName = 'administrators';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(tableName, {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        password: {
            type: DataTypes.CHAR(32),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        avatarurl: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        introduction: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        state: {
            type: DataTypes.ENUM('normal', 'deleted'),
            allowNull: false,
            defaultValue: 'normal'
        },
        modified: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        created: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: tableName
    });
};

//# sourceMappingURL=../maps/models/administrators.js.map
