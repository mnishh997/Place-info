import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/api/use-logout";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router";

type UserSchema = {
  status: "Loading" | "Authenticated" | "Unauthenticated";
  data: {
    email: string;
    id: string;
    name: string;
  };
};

interface UserAvatarProps {
  className?: string;
}

export const UserAvatar = ({ className }: UserAvatarProps) => {
  const user = useGetUser().data as UserSchema;
  const { mutate } = useLogout();

  if (user?.status !== "Authenticated") return null;

  const { email, name } = user.data || {};

  const handleLogout = () => {
    console.log("Logging out...");
    mutate(undefined, {
      onSuccess: () => {
        toast("Logged Out");
      },
      onError: () => {
        toast("Failed to LogOut");
      },
    });
  };

  return (
    <>
      <Toaster />
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className={cn("h-9 w-9 cursor-pointer", className)}>
            <AvatarImage src={undefined} alt={email} />
            <AvatarFallback className="text-black bg-gray-300">
              {name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4 flex flex-col items-center bg-card">
          <div className="flex flex-col items-center my-4 gap-2">
            <Avatar className={cn("h-9 w-9 cursor-pointer", className)}>
              <AvatarImage src={undefined} alt={email} />
              <AvatarFallback className="text-black bg-gray-300">
                {name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>
          <div className="text-sm text-center pb-2 text-muted-foreground">
            <Link to={"/update-user"} className="text-blue-600">
              Update Profile
            </Link>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full cursor-pointer"
          >
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
};
