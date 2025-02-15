require("dotenv").config();
const axios = require("axios");
const SOCRATA_API_URL = process.env.SOCRATA_API_URL;

exports.getAllTrips = async (req, res) => {
  try {
    let { startDate, endDate, paymentType, limit, page, sortBy } = req.query;

    // Default values
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    const offset = (page - 1) * limit;

    let whereClauses = [];

    if (startDate) whereClauses.push(`pickup_datetime >= '${startDate}'`);
    if (endDate) whereClauses.push(`pickup_datetime <= '${endDate}'`);
    if (paymentType) whereClauses.push(`payment_type = '${paymentType}'`);

    let whereQuery =
      whereClauses.length > 0 ? whereClauses.join(" AND ") : null;

    const validSortFields = [
      "pickup_datetime",
      "fare_amount",
      "trip_distance",
      "payment_type",
    ];

    let orderBy = "pickup_datetime ASC";

    if (sortBy) {
      const [field, order] = sortBy.split(":");
      const validOrder =
        order &&
        (order.toUpperCase() === "ASC" || order.toUpperCase() === "DESC");

      if (validSortFields.includes(field) && validOrder) {
        orderBy = `${field} ${order.toUpperCase()}`;
      }
    }

    let queryParams = {
      $limit: limit,
      $offset: offset,
      $order: orderBy,
    };

    if (whereQuery) {
      queryParams.$where = whereQuery;
    }

    const response = await axios.get(SOCRATA_API_URL, { params: queryParams });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Socrata:", error);
    res.status(500).json({ error: "Error fetching data from Socrata" });
  }
};
