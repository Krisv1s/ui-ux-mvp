import { Inter } from "next/font/google";
import Provider from "./provider";
import { Box } from "@chakra-ui/react";
import Header from "./_header";
import Footer from "./_footer";
import { SWRProvider } from "./swr-provider";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuyWise",
  description:
    "Агрегатор цен на электронику с расчетом всех издержек при покупке из-за рубежа.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <Provider>
          <SWRProvider>
            <Box
              minH="100dvh"
              display="grid"
              gridTemplateColumns="1fr"
              gridTemplateRows="auto 1fr auto"
              gridTemplateAreas="'header'
            'main'
    'footer'"
              position="relative"
            >
              <Header />
              {children}
              <Footer />
            </Box>
          </SWRProvider>
        </Provider>
      </body>
    </html>
  );
}
