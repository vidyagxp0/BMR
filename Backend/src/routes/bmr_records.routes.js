const express = require("express");
const router = express.Router();
const BmrRecordsController = require("../controllers/bmr_records.controller");
const Auth = require("../middlewares/authentication");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../documents/profile_pics/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize the original name if necessary
    const newFilename = `${uniqueSuffix}-${sanitizedOriginalName}${path.extname(
      file.originalname
    )}`;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/create-bmr-record",
  Auth.checkJwtToken,
  Auth.authorizeUserRole(2),
  upload.any(),
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

router.get(
  "/get-a-bmr-record/:id",
  Auth.checkJwtToken,
  BmrRecordsController.getABMRRecord
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
  BmrRecordsController.genrateBMRrecordReport
);

module.exports = router;
