const express = require("express");
const router = express.Router();
const PrintControlController = require("../controllers/print_control.controllers");
const Auth = require("../middlewares/authentication");

router.post(
  "/create-print-control",
  Auth.checkJwtToken,
  PrintControlController.createPrintControl
);

router.get(
  "/get-all-print-control",
  Auth.checkJwtToken,
  PrintControlController.getPrintControls
);

router.put(
  "/update-print-control/:id",
  Auth.checkJwtToken,
  PrintControlController.updatePrintControl
);

router.put(
  "/delete-print-control/:id",
  Auth.checkJwtToken,
  PrintControlController.deletePrintControl
);

router.post(
  "/check-user-print-limit",
  Auth.checkJwtToken,
  PrintControlController.CheckUserPrintLimit
);

router.put(
  "/send-print-control-for-review",
  Auth.checkJwtToken,
  PrintControlController.SendPrintControlForReview
);

router.put(
  "/send-print-control-from-review-to-open",
  Auth.checkJwtToken,  
  PrintControlController.SendPrintControlfromReviewToOpen
);

router.put(
  "/send-print-control-from-review-to-approval",
  Auth.checkJwtToken,
  PrintControlController.SendPrintControlReviewToApproval
);

router.put(
  "/send-print-control-from-approval-to-open",
  Auth.checkJwtToken,
  PrintControlController.SendPrintControlfromApprovalToOpen
);

router.put(
  "/approve-print-control",
  Auth.checkJwtToken,
  PrintControlController.ApprovePrintControl
);

module.exports = router;
