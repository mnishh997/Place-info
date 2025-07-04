import { SignUpCard } from "@/features/auth/components/sign-up-card"

const SignUpPage = () => {
    return <main className="w-screen h-screen overflow-auto bg-background"> 
        <div className="flex flex-col items-center justify-center h-full w-full p-5 sm:p-24">
            <SignUpCard />
        </div>
    </main>
}

export default SignUpPage