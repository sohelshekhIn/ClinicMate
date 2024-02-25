import { NextRequest } from "next/server";

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

function formatKeyValuePair(key: string, value: any): string {
  return `${key.charAt(0).toUpperCase()}${key.slice(1)}: ${value}\n`;
}

function formatQA(question: string, answer: string): string {
  return `Q. ${question}\nA. ${answer}\n`;
}

const endingText =
  "Based n the provided info, ONLY ask a question regarding symtoms or other stuff that you think will help to find possible disease. \n\n DO NOT ASK SIMILAR QUESTIONS IN REPEAT AND ONLY ASK THE QUESTION NOTHING ELSE";

type QaData = {
  [key: number]: { q: string; a: string };
};

export async function POST(request: NextRequest) {
  const data = await request.text();
  const res = await JSON.parse(data);
  console.log(res);
  //   const res = await request.json();

  const formattedPatientString = Object.entries(res.preliminaryDiagnosis)
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

  //   const formattedQnAString = res.questionData
  //     .map((question: any, index: any) =>
  //       formatQA(question, res.answerData[index])
  //     )
  //     .join("");

  //   const finalString = `Patient: ${formattedPatientString}\n\n${formattedQnAString}\n\n${endingText}`;
  const finalString = `Patient: ${formattedPatientString}\n\n${formatQA(
    res.qaData
  )}\n\n${endingText}`;
  console.log(finalString);
  const QAMaker = async () => {
    const generate = await cohere.generate({
      prompt: finalString,
    });
    // console.log(generate.generations[0].text);
    return generate.generations[0].text;
  };

  const question = await QAMaker();

  return Response.json({ status: "success", question });
  //   return Response.json({ status: "success" });
}
