"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

export default function QNAPage({ params }: { params: { slug: string } }) {
  const [patientData, setPatientData] = useState({});
  const [questionData, setQuestionData] = useState<string[]>([""]);
  const [answerData, setAnswerData] = useState<string[]>([""]);
  const { data: session, status } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    "Loading your questions..."
  );
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const fetchQnAData = async (pre: any = null, ans: any = null) => {
    const qres = await fetch(`/api/cohere/diagnose`, {
      method: "POST",
      body: JSON.stringify({
        preliminaryDiagnosis: pre || patientData,
        questionData: questionData,
        answerData: ans || answerData,
      }),
    }).then((qres) => qres.json());
    if (qres.status === "success") {
      setCurrentQuestion(qres.question);
      console.log("Q to user", qres.question);
      // append the question to the questionData
      setQuestionData([...questionData, qres.question]);
    }
  };

  useEffect(() => {
    let tempData = "";
    const fetchData = async () => {
      const data = await fetch(
        `/api/cohere/initial-analysis?email=${session?.user?.email}`
      ).then((res) => res.json());
      if (data.status === "success") {
        console.log("Hello THere this is good");
        tempData = data.preliminaryDiagnosis;
        setPatientData(data.preliminaryDiagnosis);
        fetchQnAData({ pre: data.preliminaryDiagnosis });
      }
    };
    fetchData();
  }, [status, session?.user?.email]);

  const handleQuestions = () => {
    // check if the answer is empty
    if (currentAnswer === "") {
      setValidationError("Answer cannot be empty");
      return;
    } else {
      setValidationError("");
    }
    // append the answer to the answerData
    setAnswerData([...answerData, currentAnswer]);
    setCurrentAnswer("");
    fetchQnAData({ ans: [...answerData, currentAnswer] });
  };

  return (
    <div className="max-w-[80%] mx-auto mt-24 py-8 px-10">
      <div className="w-[80%] mx-auto p-14 shadow-xl rounded-lg">
        <h1 className="text-center text-slate-900 text-4xl font-bold">
          Answer few more simple questions
        </h1>
        <div className="flex flex-col space-y-6 mt-24">
          <div className="flex flex-col space-y-4">
            <label htmlFor="question" className="text-lg font-medium">
              {currentQuestion}
            </label>
            <input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              type="text"
              id="question"
              className="p-7 rounded-md border-b-4 border-gray-700"
              placeholder="Type your answer here"
            />

            {validationError ? (
              <p className="text-red-500 font-semibold "> {validationError}</p>
            ) : (
              ""
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleQuestions}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
