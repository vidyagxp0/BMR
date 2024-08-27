const FormAuditTrail = require('../models/form_audittrail.model');

const logFormAuditTrail = async ({ bmr_id, changed_by, field_name, previous_value, new_value, previous_status, new_status, declaration, action }) => {
    try {
      await FormAuditTrail.create({
        bmr_id,
        changed_by,
        field_name,
        previous_value,
        new_value,
        previous_status,
        new_status,
        declaration,
        action,
      });
    } catch (error) {
      console.error('Failed to log audit trail:', error);
    }
  };

  module.exports.logFormAuditTrail = logFormAuditTrail;