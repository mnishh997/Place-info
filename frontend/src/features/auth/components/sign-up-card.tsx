// frontend/src/features/auth/components/sign-up-card.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast, Toaster } from "sonner";
import { useRegister } from "../api/use-register";
import { Link, useNavigate } from "react-router";

const signUpSchema = z.object({
  name: z.string().regex(/^[a-zA-Z ]+$/, {
    message:
      "Name must contain only letters and spaces (no numbers or special characters)",
  }).trim(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  location: z.string(),
  showDefaultLocation: z.boolean(),
  dateOfBirth: z.string().optional(),
  foodPreference: z.enum(["Veg", "Non-Veg", "Vegan", "Other"]).optional(),
  foodPreferenceDescription: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpCard() {
  const navigate = useNavigate();
  const { mutate } = useRegister();  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      showDefaultLocation: true,
      dateOfBirth: "",
      foodPreference: undefined,
      foodPreferenceDescription: "",
      bio: "",
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log("Sign In Data:", data);
    mutate(data, {
      onSuccess: () => {
        toast.success("Successfully Registered");
        navigate("/sign-in");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <Card className="w-full mx-auto rounded-sm overflow-hidden h-screen ">
      <Toaster />
      <div className="flex h-full">
        {/* Left side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center p-8">
          <div className="text-center">
            <img
              src="public/project-logo.svg"
              alt="Project Logo"
              className="w-full max-w-sm rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Welcome to WeatherWise</h3>
            <p className="text-lg opacity-90">Your personal weather based companion</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-blue-50">
          <CardHeader className="pb-4 pt-2 flex-shrink-0">
            <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
          </CardHeader>

          {/* Scrollable form container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
                <CardContent className="space-y-4 px-8 pb-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="name" className="font-semibold">
                          Name<span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email" className="font-semibold">
                          Email<span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password" className="font-semibold">
                          Password<span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="confirmPassword" className="font-semibold">
                          Confirm Password<span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="location" className="font-semibold">
                          Location<span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="location"
                            placeholder="Enter your location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showDefaultLocation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="font-semibold">
                            Show default location
                          </Label>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="dateOfBirth" className="font-semibold">
                          Date of Birth
                        </Label>
                        <FormControl>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foodPreference"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="foodPreference" className="font-semibold">
                          Food Preference
                        </Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select food preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Veg">Vegetarian</SelectItem>
                            <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                            <SelectItem value="Vegan">Vegan</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foodPreferenceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="foodPreferenceDescription" className="font-semibold">
                          Food Preference Description (Optional)
                        </Label>
                        <FormControl>
                          <Textarea
                            id="foodPreferenceDescription"
                            placeholder="Describe your food preferences..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="bio" className="font-semibold">
                          Bio
                        </Label>
                        <FormControl>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>

                </CardContent>
              </form>
            </Form>
          </div>
          <div className="w-full border-t-4 border-border border-dotted" />
          <div className="text-sm text-center">
            {"Already own an Account? "}
            <Link to={"/sign-in"} className="text-blue-600">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
