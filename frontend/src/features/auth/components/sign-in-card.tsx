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
    <Card className="w-full max-w-sm mx-auto mt-10">
        <Toaster />
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
            <div className="w-full  border-t-4 border-border border-dotted" />
            <div className="text-sm text-center">
              {"New user? "}
              <Link to={"/sign-up"} className="text-blue-600">Sign Up</Link>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
