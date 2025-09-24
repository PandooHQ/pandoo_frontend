import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UserLogin } from "../types/UserLoginType";
import { login } from "../services/loginService";
import type { AxiosResponse } from "axios";

type LoginResponse = AxiosResponse<string>;

export const useLogin = () => {
  const mutation: UseMutationResult<LoginResponse, Error, UserLogin> = useMutation({
    mutationFn: (data: UserLogin) => login(data),
  });

  return {
    doLogin: mutation.mutate,  
    ...mutation,              
  };
};
