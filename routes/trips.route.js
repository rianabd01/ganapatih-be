
const express = require("express");
const router = express.Router();

const { getAllTrips } =require( "../controller/trips.controller");

router.get('/', getAllTrips) 

module.exports = router;