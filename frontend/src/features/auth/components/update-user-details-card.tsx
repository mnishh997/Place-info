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
import { useGetUser } from "../api/use-get-user";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const updateUserSchema = z.object({
  name: z.string().regex(/^[a-zA-Z ]+$/, {
    message:
      "Name must contain only letters and spaces (no numbers or special characters)",
  }).trim(),
  email: z.string().email({ message: "Invalid email address" }),
  location: z.string(),
  showDefaultLocation: z.boolean(),
  dateOfBirth: z.string().optional(),
  foodPreference: z.enum(["Veg", "Non-Veg", "Vegan", "Other"]).optional(),
  foodPreferenceDescription: z.string().optional(),
  bio: z.string().optional(),
  changePassword: z.boolean(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.changePassword) {
    return data.newPassword && data.newPassword.length >= 6;
  }
  return true;
}, {
  message: "Password must be at least 6 characters when changing password",
  path: ["newPassword"],
}).refine((data) => {
  if (data.changePassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export function UpdateUserDetailsCard() {
  const navigate = useNavigate();
  const { data: userQuery, isLoading } = useGetUser();
  const [changePassword, setChangePassword] = useState(false);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      showDefaultLocation: true,
      dateOfBirth: "",
      foodPreference: undefined,
      foodPreferenceDescription: "",
      bio: "",
      changePassword: false,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Prefill form with user data when it loads
  useEffect(() => {
    if (userQuery?.status === "Authenticated" && userQuery.data) {
      const userData = userQuery.data;
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        location: userData.location || "",
        showDefaultLocation: userData.showDefaultLocation ?? true,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : "",
        foodPreference: userData.foodPreference || undefined,
        foodPreferenceDescription: userData.foodPreferenceDescription || "",
        bio: userData.bio || "",
        changePassword: false,
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [userQuery, form]);

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      const updatePayload = {
        name: data.name,
        email: data.email,
        location: data.location,
        showDefaultLocation: data.showDefaultLocation,
        dateOfBirth: data.dateOfBirth,
        foodPreference: data.foodPreference,
        foodPreferenceDescription: data.foodPreferenceDescription,
        bio: data.bio,
        ...(data.changePassword && data.newPassword && { newPassword: data.newPassword }),
      };

      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatePayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("User details updated successfully");
        navigate("/");
      } else {
        toast.error(result.message || "Failed to update user details");
      }
    } catch (error) {
      toast.error("An error occurred while updating user details");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading user details...</div>
      </div>
    );
  }

  if (userQuery?.status !== "Authenticated") {
    navigate("/sign-in");
    return null;
  }

  return (
    <Card className="w-full mx-auto rounded-sm overflow-hidden h-screen">
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
            <h3 className="text-2xl font-bold mb-2">Update Your Profile</h3>
            <p className="text-lg opacity-90">Keep your information up to date</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-blue-50">
          <CardHeader className="pb-4 pt-2 flex-shrink-0">
            <CardTitle className="text-center text-2xl">Update Profile</CardTitle>
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
                  
                  {/* Password Change Section */}
                  <FormField
                    control={form.control}
                    name="changePassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setChangePassword(checked as boolean);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="font-semibold">
                            Change Password
                          </Label>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {changePassword && (
                    <>
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="newPassword" className="font-semibold">
                              New Password<span className="text-red-500">*</span>
                            </Label>
                            <FormControl>
                              <Input
                                id="newPassword"
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
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="confirmNewPassword" className="font-semibold">
                              Confirm New Password<span className="text-red-500">*</span>
                            </Label>
                            <FormControl>
                              <Input
                                id="confirmNewPassword"
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                    Update Profile
                  </Button>
                </CardContent>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  );
}