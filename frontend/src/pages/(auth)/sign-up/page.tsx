import { SignUpCard } from "@/features/auth/components/sign-up-card"

const SignUpPage = () => {
    return <main className="w-screen h-screen overflow-auto bg-accent"> 
        <div className="flex flex-col items-center justify-center h-full w-full pb-10">
            <SignUpCard />
        </div>
    </main>
}

export default SignUpPage