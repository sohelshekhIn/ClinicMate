import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function QuickSolve() {
  const userSession = await getServerSession();
  if (userSession == null) redirect("/");
  const email = userSession?.user?.email || "";

  // api call to /api/cohera/diagnosed?email=${email}
  const response = await fetch(`/api/cohere/diagnosed?email=${email}`);
  const data = await response.json();
  console.log(data);
  return (
    <div
      className="max-w-[80%] mx-auto py-8 px-10
        "
    >
      <div className="w-[80]">
        <div className="">
          <h1 className="text-2xl font-semibold">
            According to our AI-powered system
          </h1>
          <h1>you are probbably diagnosed by</h1>
        </div>
        <div className="">
          {/* list of hospitals best suiteed for you near you */}
          <div className="">
            <h1 className="text-2xl font-semibold">Hospitals near you</h1>
            <div className="">
              <div className="">
                <h1 className="text-xl font-semibold">Hospital Name</h1>
                {/* rating, waiting times */}
                <p>Rating</p>
                <p>Wait time</p>
                <p>Location</p>
                <p>Distance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
