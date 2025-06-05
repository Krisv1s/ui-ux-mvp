"use client";

import { toaster, Toaster } from "@/components/ui/toaster";
import { IProduct, ISupplier } from "@/type/IProduct";
import { IProfile } from "@/type/IProfile";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Heading,
  Image,
  Input,
  Portal,
  Skeleton,
  Table,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

interface IProductDataProps {
  id: number;
}

function ProductData(props: IProductDataProps) {
  const { id } = props;

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [currentSupplier, setCurrentSupplier] = useState<ISupplier | null>(
    null
  );

  const [userData, setUserData] = useState({
    phone: "",
    address: "",
  });

  const { data: product, isLoading } = useSWR<IProduct>(`/api/product/${id}`);

  const { data: profile } = useSWR<IProfile>("/api/profile");

  const isAuthorized = profile?.name;

  if (isLoading) return <Skeleton h="400px" />;

  if (!product?.name) return <div>Товар не найден</div>;

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: id,
          supplier_id: currentSupplier?.id,
          phone: userData.phone,
          address: userData.address,
        }),
      });
      if (!response.ok) {
        throw new Error("Ошибка создания заказа");
      }
      toaster.create({
        title: "Ваш заказ успешно создан!",
        description:
          "С вами свяжутся в ближайшее время по контактным данным из заявки",
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Ошибка создания заказа",
        type: "error",
      });
    }
  };

  return (
    <Box p={30} as="main" aria-label="Карточка товара">
      <Toaster />
      <Heading as="h1" fontSize="3xl" tabIndex={0}>
        {product.name}
      </Heading>
      <Image
        src={product.img_link}
        alt={product.name}
        objectFit="cover"
        minW={{ base: "100px", lg: "300px" }}
        maxW={{ base: "100px", lg: "300px" }}
        minH={{ base: "100px", lg: "300px" }}
        maxH={{ base: "100px", lg: "300px" }}
        borderRadius={5}
      />
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Название</Table.ColumnHeader>
            <Table.ColumnHeader>Цена</Table.ColumnHeader>
            <Table.ColumnHeader>Где находится</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">
              Статус заказа
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {product?.suppliers_list.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.price}</Table.Cell>
              <Table.Cell>
                {item.type === "local" ? "Россия" : "Внешняя страна"}
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Button
                  onClick={() => {
                    if (!isAuthorized) {
                      router.push("/login");
                    } else {
                      setCurrentSupplier(item);
                      setOpen(true);
                    }
                  }}
                >
                  Оформить заявку
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Оформление заказа</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {!!currentSupplier && (
                  <Box>
                    <Field.Root>
                      <Field.Label>Название продукта</Field.Label>
                      <Input disabled value={product.name} />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Название поставщика</Field.Label>
                      <Input disabled value={currentSupplier.name} />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Адрес</Field.Label>
                      <Input
                        value={userData.address}
                        onChange={(e) =>
                          setUserData({ ...userData, address: e.target.value })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Телефон</Field.Label>
                      <Input
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                      />
                    </Field.Root>
                  </Box>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Отменить</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="teal" onClick={handleSubmit}>
                  Отправить заявку
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}

export default ProductData;
