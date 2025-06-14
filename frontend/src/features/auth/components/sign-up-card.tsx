import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpCard() {
  const navigate = useNavigate();
  const { mutate } = useRegister();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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
    <Card className="w-full max-w-sm mx-auto mt-10">
      <Toaster />
      <CardHeader>
        <CardTitle className="text-center">Sign Up</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="font-semibold">
                    Name
                  </Label>
                  <FormControl>
                    <Input
                      id="email"
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
                    Email
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
                    Password
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
            />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <div className="w-full  border-t-4 border-border border-dotted" />
            <div className="text-sm text-center">
              {"Already own an Account? "}
              <Link to={"/sign-in"} className="text-blue-600">
                Sign In
              </Link>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
