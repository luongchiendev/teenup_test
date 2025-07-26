const express = require("express");
const router = express.Router();
const subscriptionController = require("./subcription.controller");

router.post("/", subscriptionController.createSubscription);
router.get("/", subscriptionController.getAllSubscriptions);
router.patch("/:id/use", subscriptionController.useSession);
router.get("/:id", subscriptionController.getSubscription);

module.exports = router;
