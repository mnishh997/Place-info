import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    initialData: {
      status: "Loading",
    },
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/auth/user", {
        credentials: "include",
      });
      if (!res.ok) {
        return {
          status: "Unauthenticated",
        };
      } else {
        const data = await res.json();
        return {
          status: "Authenticated",
          data: data.data,
        };
      }
    },
  });
  return query;
};
