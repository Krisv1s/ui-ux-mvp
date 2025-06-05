"use client";

import { Button, Center, Field, Heading, Input, Stack } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const registerSchema = z
  .object({
    email: z.string().email("Введите корректный email"),
    name: z.string().min(3, "Имя должно быть не менее 3 символов"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    repeat_password: z.string().min(6, "Повторите пароль"),
  })
  .refine((data) => data.password === data.repeat_password, {
    message: "Пароли не совпадают",
    path: ["repeat_password"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      });
      
      if (!response.ok) throw new Error("Ошибка регистрации");

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
        <Heading>Регистрация</Heading>

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

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Имя</Field.Label>
          <Input placeholder="Иванов Иван" {...register("name")} />
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

        <Field.Root invalid={!!errors.repeat_password}>
          <Field.Label>Повторите пароль</Field.Label>
          <Input
            type="password"
            placeholder="***"
            {...register("repeat_password")}
          />
          {errors.repeat_password && (
            <Field.ErrorText>{errors.repeat_password.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Button colorPalette="blue" type="submit" loading={isSubmitting}>
          Зарегистрироваться
        </Button>

        <Link href="/login">Уже есть аккаунт?</Link>
      </Stack>
    </Center>
  );
}

export default Register;
