"use client";

import { signOut, signIn } from "next-auth/react";
import { LucideLogIn, LucideLogOut } from "lucide-react";
import { Button } from "./ui/button";

const LogOutBtn = () => {
  return (
    <Button onClick={() => signOut()}>
      Sign Out
      <LucideLogOut className="w-4 h-4 ml-3" />
    </Button>
  );
};

const LogInBtn = () => {
  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: "/clinic-jouney",
        })
      }
    >
      <LucideLogIn className="w-4 h-4 mr-3" />
      Sign In
    </Button>
  );
};

export { LogOutBtn, LogInBtn };
