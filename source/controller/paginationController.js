const sequelize =require('../database')
const appConst =require('../router/constants')
const Zeological_parks=require('../models/pagination')
const Sequelize= require('sequelize')
const Op = Sequelize.Op
const { SequelizeScopeError } = require('sequelize')

const PaginationBulkRecordsCreation = async(req,res) =>{
    try {
        const resp =await Zeological_parks.bulkCreate(req.body)
        console.log(resp)
        res.status(200).json({
            status:appConst.status.success,
            response:resp,
            message:"Records are inserted into database successfully"
        })
        
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status:appConst.status.fail,
            response:null,
            message:"Failed!......"
        })
    }
}
const findPaginationRecords =async (req, res) => {
    const {page,size}=req.body
    try {
      const resp= await Zeological_parks.findAndCountAll({ 
        limit: size, 
        offset:page*size,
        where: {
            City_Name:    
            {   
               
              [Op.or]: [   
                { [Op.like]: `%${req.body.City_Name}%` },   
                { [Op.like]: `${req.body.City_Name}%` },   
                { [Op.like]: `%${req.body.City_Name}`}    
            ] 
            }
        }
    })
        res.status(200).json({
        status:appConst.status.success,
        response:resp,
        message:"Successfully fetched from the database"
      }) 
    }  
    catch(error){
        console.error(error.message)
        res.status(400).json({
            status:appConst.status.fail,
            response:resp,
            message:"failed to fetch the records from the database"
        }) 
    }   
  }
module.exports ={PaginationBulkRecordsCreation,findPaginationRecords}