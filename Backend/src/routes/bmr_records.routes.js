const express = require("express");
const router = express.Router();
const BmrRecordsController = require("../controllers/bmr_records.controller");
const Auth = require("../middlewares/authentication");

router.post(
  "/create-bmr-record",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(2),
  BmrRecordsController.createBmrRecord
);

router.put(
  "/update-bmr-record",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(2),
  BmrRecordsController.updateBMRRecord
);

router.put(
  "/delete-bmr-record/:id",
  Auth.checkJwtToken,
  BmrRecordsController.deleteBMRRecord
);

router.get(
  "/get-all-bmr-records",
  Auth.checkJwtToken,
  BmrRecordsController.getAllBMRRecords
);

router.put(
  "/send-record-for-review",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(2),
  BmrRecordsController.sendRecordForReview
);

router.put(
  "/send-record-from-review-to-open",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(3),
  BmrRecordsController.sendFromReviewToOpen
);

router.put(
  "/send-record-from-review-to-approval",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(3),
  BmrRecordsController.sendFromReviewToApproval
);

router.put(
  "/send-record-from-approval-to-open",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(4),
  BmrRecordsController.sendFromApprovalToOpen
);

router.put(
  "/approve-bmr",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(4),
  BmrRecordsController.approveBMR
);

router.post(
  "/generate-bmr-record",
  Auth.checkJwtToken,
  BmrRecordsController.genrateBMRrecord
);

module.exports = router;
