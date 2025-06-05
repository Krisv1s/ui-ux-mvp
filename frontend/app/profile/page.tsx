"use client";

import { IProfile } from "@/type/IProfile";
import {
  Field,
  Heading,
  Input,
  Skeleton,
  Stack,
  Table,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

function Profile() {
  const { data: profile, isLoading } = useSWR<IProfile>("/api/profile");

  const router = useRouter();

  if (isLoading) return <Skeleton />;

  if (!profile?.name) {
    router.push("/");
    return <div>Произошла ошибка</div>;
  }

  return (
    <Stack p={30}>
      <Heading as="h1" fontSize="3xl" mb={2}>
        Профиль
      </Heading>

      <Heading as="h2">Информация о пользователе</Heading>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input disabled value={profile?.email} w="300px" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Имя</Field.Label>
        <Input disabled value={profile?.name} w="300px" />
      </Field.Root>

      <Heading as="h2">Информация о заказах</Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Название товара</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">
              Статус заказа
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {profile?.orders.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{new Date(item.date).toLocaleString()}</Table.Cell>
              <Table.Cell textAlign="end">{item.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}

export default Profile;
