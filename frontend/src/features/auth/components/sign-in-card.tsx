import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "../api/use-login";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInCard() {
  const navigate = useNavigate()
  const { mutate } = useLogin();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInFormData) => {
    console.log("Sign In Data:", data);
    mutate(data, {
        onSuccess: () => {
            navigate("/")
            toast.success("Successfully Logged In")
        }, onError: () => {
            toast.error("Failed to Log In")
        }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster />
      <Card className="w-full max-w-6xl mx-auto overflow-hidden shadow-2xl">
        <div className="flex min-h-[600px]">
          {/* Left side - Branding */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-12 relative">
            {/* WeatherWise Logo */}
            <div className="mb-8">
              <div className="relative w-32 h-16">
                {/* Colorful overlapping circles representing the logo */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-90"></div>
                <div className="absolute top-0 left-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-90"></div>
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-90"></div>
                <div className="absolute top-4 left-12 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-90"></div>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to WeatherWise
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Your personal weather based companion
              </p>
            </div>
          </div>
          
          {/* Right side - Sign In Form */}
          <div className="flex-1 flex flex-col bg-white">
            <CardHeader className="pb-6 pt-12">
              <CardTitle className="text-center text-3xl font-bold text-gray-800">
                Sign In
              </CardTitle>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                <CardContent className="space-y-6 px-12 flex-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="a@a.com"
                            className="h-12 px-4 bg-yellow-50 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
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
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••"
                            className="h-12 px-4 bg-yellow-50 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                
                <div className="px-12 pb-12 mt-auto">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg mb-6"
                  >
                    Sign In
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Already own an Account?{" "}
                    <Link 
                      to="/sign-up" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}