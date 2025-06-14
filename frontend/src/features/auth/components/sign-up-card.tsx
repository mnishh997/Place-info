import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";
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
  location: z.string().optional(),
  dateOfBirth: z.string().optional(),
  foodPreference: z.enum(["Veg", "Non-Veg", "Vegan", "Other"]).optional(),
  foodPreferenceDescription: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const foodPreferenceOptions = [
  { value: "Veg", label: "Vegetarian" },
  { value: "Non-Veg", label: "Non-Vegetarian" },
  { value: "Vegan", label: "Vegan" },
  { value: "Other", label: "Other" },
];

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
      dateOfBirth: "",
      foodPreference: undefined,
      foodPreferenceDescription: "",
      bio: "",
    },
  });
  const onSubmit = (data: SignUpFormData) => {
    console.log("Sign Up Data:", data);
    
    // Transform data for backend
    const submitData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    };
    
    mutate(submitData, {
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
    <Card className="w-full mx-auto rounded-sm bg-blue-100 overflow-hidden h-screen">
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
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
          </CardHeader>
          
          {/* Scrollable form container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">                <CardContent className="space-y-4 px-8 pb-8">
                  {/* Required Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Required Information</h3>
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="name"
                      label="Name"
                      placeholder="Enter your name"
                      required
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Optional Fields */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Additional Information (Optional)</h3>
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="location"
                      label="Location"
                      placeholder="City, Country"
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="foodPreference"
                      label="Food Preference"
                      type="select"
                      placeholder="Select your food preference"
                      options={foodPreferenceOptions}
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="foodPreferenceDescription"
                      label="Food Preference Description"
                      placeholder="Describe your dietary restrictions or preferences"
                    />
                    
                    <FormFieldWrapper
                      control={form.control}
                      name="bio"
                      label="Bio"
                      type="textarea"
                      placeholder="Tell us a bit about yourself"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-6">
                    Sign Up
                  </Button>
                  
                  <div className="w-full border-t-4 border-border border-dotted" />
                  
                  <div className="text-sm text-center">
                    {"Already own an Account? "}
                    <Link to={"/sign-in"} className="text-blue-600">
                      Sign In
                    </Link>
                  </div>
                </CardContent>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  );
}
