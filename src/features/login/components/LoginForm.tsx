import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/login.schema";
import type { LoginFormValues } from "../types/login.types";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/shared/stores/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/loginService";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setAuth(data.data.token);
      navigate(`/${lang}/`);
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("login.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("login.subtitle")}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">{t("login.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">{t("login.password")}</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("login.forgot_password")}
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="*********"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
          loading={mutation.isPending}
        >
          {t("login.button")}
        </Button>

        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            {t("login.continue_with")}
          </span>
        </div>

        <Button variant="outline" className="w-full">
          <img
            src="/google-logo.svg"
            alt="Google Logo"
            className="mr-2 h-4 w-4"
          />
          {t("login.login_with_google")}
        </Button> */}
      </div>

      {/* <div className="text-center text-sm">
        {t("login.dont_have_account")}{" "}
        <a href="#" className="underline underline-offset-4">
          {t("login.register")}
        </a>
      </div> */}
    </form>
  );
}
