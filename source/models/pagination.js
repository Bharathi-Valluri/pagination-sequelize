const Sequelize = require('sequelize')
const {sequelize} =require('../database')
const zeological_park = sequelize.define('Zeological_parks',{
    id:{
        primaryKey:true,
        type:Sequelize.INTEGER,
        autoIncrement :true,
        allowNull :true
    },
    animal_name:{
        type :Sequelize.STRING,
        allowNull:false
    },
    Zoo_Name:{
        type :Sequelize.STRING,
        allowNull:false
    },
    City_Name :{
        type :Sequelize.STRING,
        allowNull:false
    }
    
},{
    freezeTableName:true,
    timestamps:false
    
    
  })
module.exports = zeological_park