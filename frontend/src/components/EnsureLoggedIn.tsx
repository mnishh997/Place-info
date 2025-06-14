import { useGetUser } from "@/features/auth/api/use-get-user";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

type userType = {
  status?: "Authenticated" | "Loading" | "Unauthenticated"
}

export const EnsureLoggedIn = ({ children }: { children: ReactNode }) => {
  const user = useGetUser().data as userType;
  const navigate = useNavigate();
  if (user.status === "Authenticated") {
    return <>{children}</>;
  } else if (user.status === "Loading") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  } else {
    navigate("/sign-in");
  }
};
