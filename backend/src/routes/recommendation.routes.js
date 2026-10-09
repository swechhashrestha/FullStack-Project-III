const express = require("express");
const router = express.Router();
const { getContentRecommendations, getKnnRecommendations } = require("../controllers/recommendation.controller");

router.get("/content/:productId", getContentRecommendations);
router.get("/collaborative/knn", getKnnRecommendations);

module.exports = router;