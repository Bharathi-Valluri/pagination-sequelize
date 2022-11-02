const pagination_controller =require('../controller/paginationController')
const router =require('express').Router()
router.post('/bulkRecordsGeneration',pagination_controller.PaginationBulkRecordsCreation)
router.post('/getBulkRecords',pagination_controller.findPaginationRecords)
module.exports =router