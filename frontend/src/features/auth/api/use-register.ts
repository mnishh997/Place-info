// frontend/src/features/auth/api/use-register.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RegisterPayload {
  email: string;
  password: string;
}

export function useRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include"
      });
      if (response.status == 201) {
        return response.json();
      } else if (response.status === 302) {
        throw new Error("User Already Registered")
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Register failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
}
