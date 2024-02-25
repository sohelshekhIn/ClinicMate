"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface QaData {
  questionData: QuestionAnswer[];
  answerData: string[];
}

export default function SpecialityAnalysis({ email }: { email: string }) {
  const [patientData, setPatientData] = useState({});

  const [validationError, setValidationError] = useState<string>("");
  //   const [questionData, setQuestionData] = useState<string[]>([""]);
  //   const [answerData, setAnswerData] = useState<string[]>([""]);
  //   const [currentQuestion, setCurrentQuestion] = useState<string>(
  //     "Loading your questions..."
  //   );
  //   const [currentAnswer, setCurrentAnswer] = useState<string>("");

  interface QaData {
    questionData: { question: string; answer: string }[];
    answerData: string[];
  }

  const [qaData, setQaData] = useState<QaData>({
    questionData: [
      {
        question: "",
        answer: "",
      },
    ],
    answerData: [""],
  });

  const [currData, setCurrData] = useState({
    currentQuestion: "Loading your questions...",
    currentAnswer: "",
  });

  const [submitBtnClicked, setSubmitBtnClicked] = useState(false);

  const [fetchRunner, setFetchRunner] = useState(false);
  const [starter, setStarter] = useState(false);

  useEffect(() => {
    console.log(qaData.questionData.length, submitBtnClicked);
    if (qaData.questionData.length != 0 && !submitBtnClicked) {
      return;
    }
    const fetchQnAData = async () => {
      console.log("Dataa:"); // Use a colon after the label for consistency
      console.log(qaData);

      while (qaData.questionData.length <= 5) {
        // Assuming "patientData" is available in the parent component
        const response = await fetch(`/api/cohere/diagnose`, {
          method: "POST",
          body: JSON.stringify({
            patientData,
            qaData,
          }),
        });

        const qres = await response.json();

        if (qres.status === "success") {
          setCurrData({
            ...currData,
            currentQuestion: qres.question,
          });
          console.log("Q to user:", qres.question);

          setQaData({
            ...qaData,
            questionData: [...qaData.questionData, qres.question],
          });
          setSubmitBtnClicked(false);
        }
      }
      const response = await fetch(`/api/cohere/diagnosed`, {
        method: "POST",
        body: JSON.stringify({
          patientData,
          qaData,
        }),
      });

      const qres = await response.json();

      if (qres.status === "success") {
        setCurrData({
          currentAnswer: "",
          currentQuestion: "Loading your questions...",
        });
        setQaData({
          questionData: [],
          answerData: [],
        });
        setSubmitBtnClicked(false);
        // Redirect to the next page
      }
    };

    fetchQnAData();
  }, [fetchRunner, qaData, submitBtnClicked, starter]);

  useEffect(() => {
    setStarter(true);
    const fetchData = async () => {
      const data = await fetch(
        `/api/cohere/initial-analysis?email=${email}`
      ).then((res) => res.json());
      if (data.status === "success") {
        // console.log("Patient data", data.patientData.preliminaryDiagnosis);
        // window.localStorage.setItem("patientData", JSON.stringify(data.patientData.preliminaryDiagnosis));
        setPatientData(data.patientData.preliminaryDiagnosis);
        // fetchQnAData({ pre: data.preliminaryDiagnosis });
        setFetchRunner(!fetchRunner);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Dataa:");
    console.log(qaData);
    console.log(submitBtnClicked);
  }, [qaData, submitBtnClicked]);

  const handleQuestions = () => {
    // check if the answer is empty
    if (currData.currentAnswer === "") {
      setValidationError("Answer cannot be empty");
      return;
    } else {
      setValidationError("");
    }
    setSubmitBtnClicked(true);
    // append the answer to the answerData
    setQaData({
      ...qaData,
      answerData: [...qaData.answerData, currData.currentAnswer],
    });
    setCurrData({ ...currData, currentAnswer: "" });
    // setAnswerData([...answerData, currentAnswer]);
    // setCurrentAnswer("");
    // fetchQnAData();
    setFetchRunner(!fetchRunner);
    // fetchQnAData({ ans: [...answerData, currentAnswer] });
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
              {currData.currentQuestion}
            </label>
            <input
              value={currData.currentAnswer}
              onChange={(e) =>
                setCurrData({ ...currData, currentAnswer: e.target.value })
              }
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
