import React from "react";
import ProductData from "./product-data";

async function Product({ params }: { params: Promise<{ id: string }> }) {
  const id = +(await params).id;

  return <ProductData id={id} />;
}

export default Product;
