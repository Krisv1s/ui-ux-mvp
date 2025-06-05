"use client";

import { ICatalog } from "@/type/ICatalog";
import { IProductType } from "@/type/IProductType";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  Combobox,
  Flex,
  Heading,
  IconButton,
  Image,
  Pagination,
  Portal,
  Skeleton,
  Text,
  useListCollection,
  Wrap,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import useSWR from "swr";

export default function Page() {
  const { data: productTypes } = useSWR<IProductType[]>("/api/product_type");

  const [selectedProductTypes, setSelectedProductTypes] = useState<
    IProductType[]
  >([]);
  const [inputValue, setInputValue] = useState("");

  const [selectedPage, setSelectedPage] = useState(1);

  const { data: catalog, isLoading: isLoadingCatalog } = useSWR<ICatalog>(
    `/api/catalog?page=${selectedPage}${
      selectedProductTypes.length
        ? `&product_type=${selectedProductTypes.map((item) => item.id).join()}`
        : ""
    }`
  );

  const { collection, set } = useListCollection<IProductType>({
    initialItems: [],
    itemToString: ({ name }) => name,
    itemToValue: (item) => item.name,
  });

  useEffect(() => {
    if (productTypes)
      set(
        productTypes.filter((item) =>
          item.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        )
      );
  }, [set, productTypes, inputValue]);

  return (
    <Box p={30} as="main" aria-label="Каталог товаров">
      <Heading as="h1" fontSize="3xl" tabIndex={0}>
        Каталог
      </Heading>
      <Flex justifyContent="end" gap={2} alignItems="end">
        <Combobox.Root
          multiple
          collection={collection}
          onInputValueChange={(e) => setInputValue(e.inputValue)}
          onValueChange={(detail) => setSelectedProductTypes(detail.items)}
          width="320px"
          aria-labelledby="product-type-filter-label"
        >
          <Wrap gap="2" aria-live="polite" aria-atomic="true">
            {selectedProductTypes.map((productType) => (
              <Badge
                h="fit-content"
                key={productType.id}
                aria-label={`Выбран тип: ${productType.name}`}
              >
                {productType.name}
              </Badge>
            ))}
          </Wrap>
          <Combobox.Label id="product-type-filter-label">
            Фильтр типа товара
          </Combobox.Label>
          <Combobox.Control>
            <Combobox.Input
              placeholder="Пишите для поиска"
              aria-autocomplete="list"
              aria-controls="product-type-options"
            />
            <Combobox.IndicatorGroup>
              <Combobox.ClearTrigger aria-label="Очистить выбранные типы товаров" />
              <Combobox.Trigger aria-label="Открыть список типов товаров" />
            </Combobox.IndicatorGroup>
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content id="product-type-options" role="listbox">
                <Combobox.Empty>Не найдено</Combobox.Empty>
                {collection.items.map((item) => (
                  <Combobox.Item
                    item={item}
                    key={item.id}
                    role="option"
                    aria-selected={selectedProductTypes.some(
                      (pt) => pt.id === item.id
                    )}
                  >
                    {item.name}
                    <Combobox.ItemIndicator aria-hidden="true" />
                  </Combobox.Item>
                ))}
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      </Flex>
      <Skeleton
        loading={isLoadingCatalog}
        h={isLoadingCatalog ? "400px" : undefined}
      >
        <>
          <Wrap
            justify="space-between"
            mt={5}
            gap={10}
            role="grid"
            aria-label="Список товаров"
          >
            {catalog?.data.map((item) => (
              <Card.Root
                maxW="sm"
                minW="sm"
                overflow="hidden"
                key={item.id}
                role="gridcell"
                aria-labelledby={`product-${item.id}-title product-${item.id}-price`}
              >
                <Image
                  src={item.img_link}
                  alt={`Картинка товара под названием ${item.name}`}
                  objectFit="cover"
                  minH="250px"
                  maxH="250px"
                  aria-hidden="true"
                />
                <Card.Body gap="2">
                  <Card.Title id={`product-${item.id}-title`}>
                    {item.name}
                  </Card.Title>

                  <Text
                    textStyle="2xl"
                    fontWeight="medium"
                    letterSpacing="tight"
                    mt="2"
                    id={`product-${item.id}-price`}
                  >
                    От {item.price}₽
                  </Text>
                </Card.Body>
                <Card.Footer gap="2">
                  <Link href={`/product/${item.id}`} passHref>
                    <Button
                      colorPalette="teal"
                      aria-label={`Купить товар ${item.name}`}
                    >
                      Купить
                    </Button>
                  </Link>
                </Card.Footer>
              </Card.Root>
            ))}
          </Wrap>
          <Flex mt={5} justifyContent="center">
            <Pagination.Root
              count={catalog?.count || 20}
              pageSize={20}
              page={selectedPage}
              onPageChange={(e) => setSelectedPage(e.page)}
              aria-label="Навигация по страницам каталога"
            >
              <ButtonGroup variant="ghost" size="sm">
                <Pagination.PrevTrigger asChild>
                  <IconButton
                    aria-label="Предыдущая страница"
                    disabled={selectedPage === 1}
                  >
                    <HiChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(page) => (
                    <IconButton
                      variant={{ base: "ghost", _selected: "outline" }}
                      aria-label={`Страница ${page.value}`}
                      aria-current={
                        page.value === selectedPage ? "page" : undefined
                      }
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton
                    aria-label="Следующая страница"
                    disabled={
                      selectedPage === Math.ceil((catalog?.count || 0) / 20)
                    }
                  >
                    <HiChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </>
      </Skeleton>
    </Box>
  );
}
