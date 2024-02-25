"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const generalFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name is too short",
    })
    .max(100, {
      message: "Name is too long",
    }),
  age: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().gte(18, "Must be 18 and above").lte(100, "Must be 100 and below")
  ),
  sex: z.string().min(2).max(100),
  ethnicity: z.string({
    required_error: "Please select your ethnicity",
  }),
  weight: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z
      .number()
      .gte(10, "Weight must be greater than 10")
      .lte(200, "Weight must be less than 200)")
  ),
  height: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z
      .number()
      .gte(100, "Height must be greater than 100")
      .lte(250, "Height must be less than 250)")
  ),
  occupation: z
    .string()
    .min(2, {
      message: "Occupation is too short",
    })
    .max(100, {
      message: "Occupation is too long",
    }),
  currentMedications: z.string().min(2).max(400),
  allergies: z.string().min(2).max(200),
  symptons: z.string().min(2).max(400),
});

export default function GeneralQuestion() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      name: "",
      age: 0,
      sex: "",
      ethnicity: "",
      weight: 0,
      height: 0,
      occupation: "",
      currentMedications: "",
      allergies: "",
      symptons: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof generalFormSchema>) {
    const data = await fetch("/api/cohere/initial-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preliminaryDiagnosis: values,
        email: session?.user?.email,
      }),
    }).then((res) => res.json());

    if (data.status === "success") {
      router.push(`/clinic-journey/qna`);
    }
  }

  return (
    <div className="max-w-[80%] mx-auto py-8 px-10">
      <div className="w-[80%] mx-auto p-14 shadow-xl rounded-lg">
        <h1 className="text-center text-slate-900 text-4xl font-bold ">
          Smart Diagnose with our AI Powered Diagnoses
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" mt-20 ">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sex at Birth" {...field} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ethnicity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select your ethnicity"
                            {...field}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Hispanic">Hispanic</SelectItem>
                        <SelectItem value="Native American">
                          Native American
                        </SelectItem>
                        <SelectItem value="Pacific Islander">
                          Pacific Islander
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your weight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your height (cm)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your current medications"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your allergies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symptons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptons</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the symptons you feel"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex justify-end mt-5">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
