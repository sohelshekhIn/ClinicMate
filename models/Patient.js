const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
});

module.exports =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
