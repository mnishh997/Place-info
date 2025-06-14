import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useLogout() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", 
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Logout failed")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  return mutation
}
