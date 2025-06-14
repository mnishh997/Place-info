
import { UpdateUserDetailsCard } from "@/features/auth/components/update-user-details-card"

const UpdateUserDetailsPage = () => {
    return <main className="w-screen h-screen overflow-auto bg-accent"> 
        <div className="flex flex-col items-center justify-center h-full w-full pb-10">
            <UpdateUserDetailsCard />
        </div>
    </main>
}

export default UpdateUserDetailsPage