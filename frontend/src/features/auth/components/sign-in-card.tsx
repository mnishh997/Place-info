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
    <Card className="w-full max-w-4xl mx-auto mt-10 overflow-hidden">
      <Toaster />
      <div className="flex min-h-[500px]">
        {/* Left side - Image */}
        <div className="flex-1 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center justify-center h-full p-8">
            <img 
              src="/path-to-your-illustration.svg" 
              alt="Sign up illustration" 
              className="max-w-full max-h-full object-contain"
            />
            {/* If you don't have an image, you can use this placeholder */}
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-lg opacity-90">Sign in to access your weather dashboard</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-2xl">Sign In</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
              <CardContent className="space-y-4 px-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
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
                      <Label htmlFor="password">Password</Label>
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
                />
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <div className="w-full border-t-4 border-border border-dotted" />
                <div className="text-sm text-center">
                  {"New user? "}
                  <Link to={"/sign-up"} className="text-blue-600">Sign Up</Link>
                </div>
              </CardContent>
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
}
