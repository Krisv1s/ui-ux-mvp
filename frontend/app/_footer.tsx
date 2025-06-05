import { Box, Flex, Text, Link, Stack, Heading } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      as="footer"
      borderTopWidth={1}
      py={10}
      mx={10}
      px={{ base: 4, md: 10 }}
      role="contentinfo"
      aria-label="Подвал сайта"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        mx="auto"
      >
        <Box mb={{ base: 6, md: 0 }} maxW="300px">
          <Heading as="h2" size="md" mb={2} color="teal.300">
            BuyWise
          </Heading>
          <Text fontSize="sm" opacity={0.8}>
            Агрегатор цен на электронику с расчетом всех издержек при покупке
            из-за рубежа.
          </Text>
        </Box>

        <Stack direction={{ base: "column", md: "row" }}>
          <Box>
            <Text as="h3" fontWeight="bold" mb={2} fontSize="md">
              Поддержка
            </Text>
            <Stack as="nav" aria-label="Поддержка">
              <Link
                href="#"
                fontSize="sm"
                _hover={{ color: "teal.300" }}
                aria-label="Контакты компании"
              >
                Контакты
              </Link>
              <Link
                href="#"
                fontSize="sm"
                _hover={{ color: "teal.300" }}
                aria-label="Часто задаваемые вопросы"
              >
                FAQ
              </Link>
              <Link
                href="#"
                fontSize="sm"
                _hover={{ color: "teal.300" }}
                aria-label="Политика конфиденциальности"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="#"
                fontSize="sm"
                _hover={{ color: "teal.300" }}
                aria-label="Условия использования сайта"
              >
                Условия использования
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Flex>

      <Text
        fontSize="sm"
        opacity={0.7}
        mt={6}
        aria-label={`Copyright ${new Date().getFullYear()} BuyWise. Все права защищены.`}
      >
        © {new Date().getFullYear()} BuyWise. Все права защищены.
      </Text>
    </Box>
  );
};

export default Footer;
