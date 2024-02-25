import { Button } from "./ui/button";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="mt-16">
        <h1 className="text-8xl font-bold">
          Experience{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
            AI-Driven
          </span>{" "}
          Diagnosis
          {/* Revolutionizing Healthcare Management */}
        </h1>
      </div>
      <p className="w-full text-2xl text-center ">Lowering wait times!</p>
      <div className="w-full flex justify-center mt-10">
        <Button variant={"default"} className="p-7 font-semibold">
          <a href="/clinic-journey">
            Get Started with our AI Powered Diagnoses
          </a>
        </Button>
      </div>
    </div>
  );
}
