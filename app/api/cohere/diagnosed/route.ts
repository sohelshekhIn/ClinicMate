import PatientData from "@/models/PatientData";

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

function formatKeyValuePair(key: string, value: any): string {
  return `${key.charAt(0).toUpperCase()}${key.slice(1)}: ${value}\n`;
}

type QaData = {
  [key: number]: { q: string; a: string };
};

const endingText =
  "Based on the above info tell me which disease it is 1-2 words";

export async function POST(request: Request) {
  const res = await request.json();
  const formattedPatientString = Object.entries(res.patientData)
    .map(([key, value]) => formatKeyValuePair(key, value))
    .join("");

  console.log("formatted PS", formattedPatientString);

  function formatQA(qaData: QaData): string {
    let formattedString = "";

    for (const [key, value] of Object.entries(qaData)) {
      formattedString += `Q. ${value.q}\nA. ${value.a}\n\n`;
    }

    return formattedString;
  }

  const finalString = `Patient: ${formattedPatientString}\n\n${formatQA(
    res.qaData
  )}\n\n${endingText}`;
  console.log(finalString);
  const DecisionMaker = async () => {
    const generate = await cohere.generate({
      prompt: finalString,
    });
    // console.log(generate.generations[0].text);
    return generate.generations[0].text;
  };

  const diseasse = await DecisionMaker();

  // update the PatientData with the disease and qaData
  await PatientData.findOneAndUpdate(
    { email: res.patientData.email },
    { disease: diseasse, qaData: res.qaData }
  );

  return Response.json({ status: "success" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const patientData = await PatientData.findOne({ email: email });
  // console.log(email, patientData);
  if (patientData === null) {
    return Response.json({ status: "error", message: "No data found" });
  }
  const disease = patientData.diseasse;
  return Response.json({ status: "success", disease });
}
