import express from "express";
import expressAsyncHandler from "express-async-handler";

import cors from "cors";
import { execute, executeOne, insert, updateOne } from "../dbHelper.js";
const dbName = "Cab";
const schemaName = "cab_booking_details";

const cabRouter = express.Router();
cabRouter.use(cors());

cabRouter.post(
  "/register/user",
  expressAsyncHandler(async (req, res) => {
    try {
      let userType = req.body.body.userType; //from front end
      if (userType == "Driver") {
        const q1 = `SELECT * FROM ${schemaName}."Driver" where "email"='${req.body.body.email}' or "phone"='${req.body.body.phone}'`;
        let res1 = await executeOne(dbName, q1);
        if (res1) {
          throw { message: "Account Already Exists!!" };
        } else {
          let params = {
            email: req.body.body.email,
            userName: req.body.body.userName,
            phone: req.body.body.phone,
            address: c.address,
            password: bcrypt(req.body.body.password),
            isAvailable:'ON',
            is_licence:true,
            cab_model:'AAA231BB12'
          };

          let response = await insert(dbName, schemaName, "Driver", params);
          res.send(response);
        }
      } else {
        const q1 = `SELECT * FROM ${schemaName}."User" where "email"='${req.body.body.email}' or "phone"='${req.body.body.phone}'`;
        let res1 = await executeOne(dbName, q1);
        if (res1) {
          throw { message: "Account Already Exists!!" };
        } else {
          let params = {
            email: req.body.body.email,
            driverName: req.body.body.userName,
            phone: req.body.body.phone,
            address: c.address,
            password: bcrypt(req.body.body.password),
          
          };

          let response = await insert(dbName, schemaName, "User", params);
          res.send(response);
      }
    }} catch (err) {
        return err;
      }
  })
);

cabRouter.post(
    "/booking/cab",
    expressAsyncHandler(async (req, res) => {
      try {
          let userLocation={x:10, y:20}
          let cab_Location={x:12, y:21}
          let shortDistance=Math.sqrt((cab_Location.y-userLocation.y)*(cab_Location.y-userLocation.y) + (cab_Location.x-userLocation.x)*(cab_Location.x-userLocation.x) )
          let params = {
            userId: req.body.body.userId,
            driverId: req.body.body.driverId,
            user_pick_up_location:req.body.body.user_pick_up_location,
            user_drop_location:req.body.body.user_drop_location,
            otp:generateOTP(),
            is_licence:true,
            booking_status:getBookingStatus(),
            cab_model:getCabNearBy(shortDistance)
          };

          let response = await insert(dbName, schemaName, "riding_details", params);
          res.send(response);

       } catch (err) {
          return err;
        }
    })

  );

 const getCabNearBy= async ()=>{
            // always need to show all cabs list near by user location

    const q1 = `SELECT * FROM ${schemaName}."Driver" where "driverId"=1`;
    let res1 = await executeOne(dbName, q1);
    return res1.cab_model
  }

  const getBookingStatus=()=>{
      // always need to update status like booking initiated, booking confirmed, booking cancelled in real time
      return 'confirm'
  }

 const  generateOTP=()=>{
      // send this otp to user and verify by drvier  in real time scenerio
      return 5577
  }
export default cabRouter;
