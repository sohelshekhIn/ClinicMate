import type { NextApiRequest, NextApiResponse } from "next";
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(request: Request) {
  // get body fmo request
  const body = await request.json();
  // get text from body
  const text = body.text;
  console.log(text);

  let generatedClassy = "";
  (async () => {
    const classify = await cohere.classify({
      inputs: [text],
    });
    generatedClassy = classify;
    console.log(classify);
  })();

  return Response.json(generatedClassy);
}
