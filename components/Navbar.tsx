import { Button } from "@/components/ui/button";
import { LogInBtn, LogOutBtn } from "./AuthBtns";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";

const Navbar = async () => {
  const session = await getServerSession();
  return (
    <div className="w-full bg-white sticky top-0 left-0 sm:w-[80%] mx-auto p-8 flex flex-row justify-between">
      <Link href={"/"} className="">
        <h1 className="text-xl font-bold">ClinicMate</h1>
        {/* <div className="max-w-xs pr-32 hidden sm:block">
          <Image src={ClinicMate} alt="CliniMate Logo" />
        </div>
        <div className="max-w-xs sm:hidden pr-24 xs:pr-32 -mt-2 h-full flex justify-center">
          <Image src={SkillNodeMobileLogo} alt="SkillNode Mobile Logo" />
        </div> */}
      </Link>
      <div className="flex flex-row gap-5">
        <Link href="/">
          <Button variant={"ghost"}>Home</Button>
        </Link>
        {session ? (
          <>
            <Link href="/clinic-journey">
              <Button variant={"ghost"}>Diagnose</Button>
            </Link>
            <LogOutBtn />
          </>
        ) : (
          <LogInBtn />
        )}
      </div>
    </div>
  );
};

export default Navbar;
