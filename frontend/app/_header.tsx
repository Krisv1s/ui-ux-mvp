"use client";

import { IProfile } from "@/type/IProfile";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

function Header() {
  const { data: profile, isLoading } = useSWR<IProfile>("/api/profile");

  return (
    <Flex
      as="header"
      justifyContent="space-between"
      px={5}
      py={2}
      borderBottomWidth={1}
      h="56px"
      role="banner"
    >
      <Flex alignItems="center">
        <Link href="/" aria-label="Перейти на главную страницу">
          <Image
            src="/static/logo.svg"
            alt="Логотип компании"
            minW="30px"
            maxW="30px"
          />
        </Link>
      </Flex>
      <Flex
        as="nav"
        gap={5}
        alignItems="center"
        aria-label="Основная навигация"
      >
        <Link href="/" aria-current="page">
          Главная
        </Link>
        <Link href="/profile">Профиль</Link>
      </Flex>
      <Box w="76px">
        {!profile?.name && !isLoading && (
          <Link href="/login" passHref>
            <Button colorPalette="teal" aria-label="Войти в аккаунт">
              Войти
            </Button>
          </Link>
        )}
      </Box>
    </Flex>
  );
}

export default Header;
