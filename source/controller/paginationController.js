const sequelize = require('../database')
const appConst = require('../router/constants')
const Zeological_parks = require('../models/pagination')
const fetch = require('node-fetch')
const redis = require('redis')
const REDIS_PORT = process.env.REDIS_PORT || 6379
const client = redis.createClient(REDIS_PORT, process.env.host || 'localhost')
client.connect()

const getfromCache = async (req, res, next) => {
  try {
    let key = 'todos' + req.params.id
    let resp
    const value = await client.get(key)
    if (value) {
      console.log('Data successfully fetched from cache...')

      resp = JSON.parse(value)

      console.log('value', value)
    } else if (!resp) {
      console.log('Data fetched from Database')

      resp = await Zeological_parks.findOne({ where: { id: req.params.id } })

      let setKey = 'todos' + req.params.id

      await client.set(setKey, JSON.stringify(resp))
    }
    res.status(200).json(resp)
  } catch (err) {
    console.log(err.message)
  }
}

const getallrecords = async (req, res) => {
  try {
    let key = 'todos1' + '#'
    let resp
    const value = await client.get(key)
    if (value) {
      console.log('Data successfully fetched from cache....')

      resp = JSON.parse(value)
      console.log('value1', value)
    } else if (!resp) {
      console.log('fetch from DB.')
      resp = await Zeological_parks.findAll()
      let setKey = 'todos1' + '#'
      await client.set(setKey, JSON.stringify(resp), { EX: 30 })
    }
    res.status(200).json(resp)
  } catch (error) {
    console.log(error.message)
  }
}

const insert = async (req, res) => {
  try {
    let key = 'todos2' + req.body + '#'
    let resp
    //let newValue;
    const value = await client.get(key)

    if (value) {
      console.log('Data successfully fetched from cache....')

      resp = JSON.parse(value)
      console.log('value2', value)
    } else if (!resp) {
      console.log('fetch from DB.')
      resp = await Zeological_parks.create(req.body)

      let setKey = 'todos2' + req.body + '#'
      await client.set(setKey, JSON.stringify(resp))
    }
    res.send(resp)
  } catch (error) {
    console.log(error.message)
  }
}
const updateOne = async (req, res) => {
  try {
    let key = 'todos3' + req.params.id + '#'
    let resp

    const value = await client.get(key)
    await client.flushAll()

    if (value) {
      console.log('Data successfully updated from cache....')

      resp = JSON.parse(value)
      console.log('value3', resp)
    } else if (!resp) {
      console.log('fetch from DB.')
      resp = await Zeological_parks.update(req.body, {
        where: { id: req.params.id }
      })
      let setKey = 'todos3' + req.params.id + '#'
      await client.set(setKey, JSON.stringify(resp))
    }
    res.status(200).json(resp)
  } catch (error) {
    console.log(error.message)
  }
}

const deleteOne = async (req, res) => {
  try {
    let key = 'todos4' + req.params.id + '#'
    let resp

    const value = await client.get(key)
    await client.flushAll()

    if (value) {
      console.log('Data successfully deleted from cache....')

      resp = JSON.parse(value)
      console.log('value4', value)
    } else if (!resp) {
      console.log('Data deleted from Database.')
      resp = await Zeological_parks.destroy({
        where: { id: req.params.id }
      })
      let setKey = 'todos4' + req.params.id + '#'
      await client.set(setKey, JSON.stringify(resp))
    }
    res.status(200).json(resp)
  } catch (error) {
    console.log(error.message)
  }
}
//findMany
const findMany = async (req, res) => {
  try {
    let key = 'todos5' + req.body.City_Name + '#'
    let resp
    const value = await client.get(key)
    //await client.flushAll();

    if (value) {
      console.log('fetch from cache.')

      resp = JSON.parse(value)
      console.log('value5', value)
    } else if (!resp) {
      console.log('fetch from DB.')
      //const con=req.body.firstName.subString(req.body.firstName.length()-2);
      //console.log(con)
      resp = await Zeological_parks.findAll({
        where: {
          City_Name: {
            //[Op.like]: `${req.body.firstName}%`
            [Op.or]: [
              { [Op.like]: `%${req.body.City_Name}%` },
              { [Op.like]: `${req.body.City_Name}%` },
              { [Op.like]: `%${req.body.City_Name}` }
            ]
          }
        }
      })
      console.log(resp)
      let setKey = 'todos5' + req.body.City_Name + '#'
      await client.set(setKey, JSON.stringify(resp))
    }
    res.status(200).json(resp)
  } catch (err) {
    console.log(err.message)
  }
}

const bulkInsert = async (req, res) => {
  try {
    let key = 'todos6' + req.body + '#'
    let resp
    //let newValue;
    const value = await client.get(key)
    // await client.flushAll();

    if (value) {
      console.log('fetch from cache.')

      resp = JSON.parse(value)
      console.log('value6', value)
    } else if (!resp) {
      console.log('fetch from DB.')
      resp = await Zeological_parks.bulkCreate(req.body)

      let setKey = 'todos6' + req.body + '#'
      await client.set(setKey, JSON.stringify(resp))
    }
    res.send(resp)
  } catch (error) {
    console.log(error.message)
  }
}

// const PaginationBulkRecordsCreation = async (req, res) => {
//   try {
//     const resp = await Zeological_parks.bulkCreate(req.body)
//     console.log(resp)
//     res.status(200).json({
//       status: appConst.status.success,
//       response: resp,
//       message: 'Records are inserted into database successfully'
//     })
//   } catch (error) {
//     console.log(error.message)
//     res.status(404).json({
//       status: appConst.status.fail,
//       response: null,
//       message: 'Failed!......'
//     })
//   }
// }
// const findPaginationRecords = async (req, res) => {
//   const { page, size } = req.body
//   try {
//     const resp = await Zeological_parks.findAndCountAll({
//       limit: size,
//       offset: (page-1)* size,
//       where: {
//         City_Name: {
//             [Op.or]: [
//                 { [Op.like]: `%${req.body.City_Name}%` },
//                 { [Op.like]: `%${req.body.City_Name}` },
//                 { [Op.like]: `${req.body.City_Name}%`}
//             ]
//             }
//           }
//         })
//     res.status(200).json({
//       status: appConst.status.success,
//       response: resp,
//       message: 'Successfully fetched from the database'
//     })
//   } catch (error) {
//     console.error(error.message)
//     res.status(400).json({
//       status: appConst.status.fail,
//       response: null,
//       message: 'failed to fetch the records from the database'
//     })
//   }
// }
const getAll = async (req, res) => {
  const { page, size } = req.body
  try {
    const resp = await Zeological_parks.findAll()
    res.status(200).json({
      status: appConst.status.success,
      response: resp,
      message: 'Successfully fetched from the database'
    })
  } catch (error) {
    console.error(error.message)
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: 'failed to fetch the records from the database'
    })
  }
}

module.exports = {
  getfromCache,
  getallrecords,
  getAll,
  insert,
  updateOne,
  deleteOne,
  findMany,
  bulkInsert
}
