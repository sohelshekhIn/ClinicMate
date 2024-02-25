const mongoose = require("mongoose");

const PatientDataSchema = new mongoose.Schema({
    preliminaryDiagnosis: Object,
  email: String,
  qaData: Object,
    disease: String,
});

module.exports =
  mongoose.models.PatientData ||
  mongoose.model("PatientData", PatientDataSchema);
