"use client";

import { Button, Center, Field, Heading, Input, Stack } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toaster, Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Ошибка авторизации");

      mutate("/api/profile");
      router.push("/");
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Ошибка авторизации",
        type: "error",
      });
    }
  };

  return (
    <Center>
      <Toaster />
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        p="30px"
        borderRadius={16}
        alignItems="center"
        w="400px"
        gap={3}
        borderWidth={1}
      >
        <Heading>Авторизация</Heading>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="me@example.com"
            {...register("email")}
            type="email"
          />
          {errors.email && (
            <Field.ErrorText>{errors.email.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Пароль</Field.Label>
          <Input type="password" placeholder="***" {...register("password")} />
          {errors.password && (
            <Field.ErrorText>{errors.password.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Button colorPalette="blue" type="submit" loading={isSubmitting}>
          Авторизоваться
        </Button>

        <Link href={"/register"}>Нет аккаунта?</Link>
      </Stack>
    </Center>
  );
}

export default Login;
