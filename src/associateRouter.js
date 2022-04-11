import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Specialization from './associateModel.js';

import cors from 'cors';
import { execute, executeOne, insert, updateOne } from './dbHelper.js';
const  dbName="ams"
const schemaName='associate'

const associateRouter=express.Router();
associateRouter.use(cors());


associateRouter.get('/specialization/list/get', expressAsyncHandler(async (req,res)=>{
    const q1=`SELECT * FROM ${schemaName}."specialization_Master"`
    let specialization=await execute(dbName,q1)
     res.send(specialization)
    }));

associateRouter.post('/specialization/list/add', expressAsyncHandler(async (req, res)=>{
  const q1=`SELECT * FROM ${schemaName}."specialization_Master" where "specializationName"='${req.body.body}'`
  let specialization=await executeOne(dbName,q1)
  if(specialization){
    throw {message:'Already Exists'}
  }else{
    let params={
      specializationName:req.body.body
    }
    let response =await insert(dbName,schemaName,"specialization_Master", params)
     res.send(response)
  }
 
}));


associateRouter.get('/associate/list/get', expressAsyncHandler(async (req,res)=>{
  const q1=`SELECT * FROM ${schemaName}."associate_Master"`
  let associate=await execute(dbName,q1)
   res.send(associate)
  }));

  associateRouter.post('/associate/list/delete', expressAsyncHandler(async (req,res)=>{
    const q1=`DELETE FROM ${schemaName}."associate_Master" WHERE "associateId"='${req.body.body.associateId}'`
    let associate=await execute(dbName,q1)
     res.send(associate)
    }));

    associateRouter.get('/associate/findById', expressAsyncHandler(async (req,res)=>{
      const q1=`SELECT * FROM ${schemaName}."associate_Master" WHERE "associateId"='${req.query.associateId}'`
      let associate=await executeOne(dbName,q1)
       res.send(associate)
      }));


associateRouter.post('/associate/list/add', expressAsyncHandler(async (req, res)=>{
  const q1=`SELECT * FROM ${schemaName}."associate_Master" where "associateName"='${req.body.body.associateName}'`
  let associate=await executeOne(dbName,q1)
  if(associate){
    throw {message:'Already Exists'}
  }else{
    let params={
      phone:req.body.body.phone,
      address:req.body.body.address,
      associateName:req.body.body.associateName,
      specializationId:req.body.body.specializationId
    }
    let response =await insert(dbName,schemaName,"associate_Master", params)
     res.send(response)
  }
 
}));

associateRouter.put('/associate/list/update', expressAsyncHandler(async (req, res)=>{
  const q1=`SELECT * FROM ${schemaName}."associate_Master" where "associateId"='${req.body.body.associateId}'`
  let associate=await executeOne(dbName,q1)
  if(associate){
    let cond=`where "associateId"='${req.body.body.associateId}'`
    let params={
      associateId:req.body.body.associateId,
      phone:req.body.body.phone,
      address:req.body.body.address,
      associateName:req.body.body.associateName,
      specializationId:req.body.body.specializationId
    }
    let response =await updateOne(dbName,schemaName,"associate_Master", params, cond)
     res.send(response)
  }else{
    throw {message:'Associate doesn\'t Exists'}
  }
 
}));

export default associateRouter;