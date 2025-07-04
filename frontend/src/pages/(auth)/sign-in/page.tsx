import { useGetUser } from "@/features/auth/api/use-get-user";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { useNavigate } from "react-router";

const SignInPage = () => {
  const {data: user} = useGetUser();
  const navigate = useNavigate()
  if (user.status === "Authenticated") {
    navigate("/")
  }
  return (
    <main className="w-screen h-screen overflow-auto bg-background">
      <div className="flex flex-col items-center justify-center h-full w-full p-5 sm:p-24">
        <SignInCard />
      </div>
    </main>
  );
};

export default SignInPage;
