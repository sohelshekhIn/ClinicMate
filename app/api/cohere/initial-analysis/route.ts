import PatientData from "@/models/PatientData";

export async function POST(request: Request) {
  const data = await request.json();

  // email exists in PatientData, then update the data
  const patientDataExists = await PatientData.findOne({ email: data.email });
  if (patientDataExists) {
    await PatientData.findOneAndUpdate(
      { email: data.email },
      { preliminaryDiagnosis: data.preliminaryDiagnosis }
    );
    return Response.json({ status: "success" });
  }

  const patientData = new PatientData({
    preliminaryDiagnosis: data.preliminaryDiagnosis,
    email: data.email,
  });

  await patientData.save();
  return Response.json({ status: "success" });
}

export async function GET(request: Request) {
  // read url params from the request
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  // Find data where PatientData.email = email
  const patientData = await PatientData.findOne({ email: email });
  console.log(email, patientData);
  if (patientData === null) {
    return Response.json({ status: "error", message: "No data found" });
  }
  return Response.json({ status: "success", patientData });
}
