import type { Metadata } from "next";
import "./globals.css";
// import { WagmiConfig, createConfig, mainnet } from 'wagmi'
// import { createPublicClient, http } from 'viem'

// import {
//   arbitrum,
//   polygon,
//   avalanche,
//   optimism,
//   bsc,
//   sepolia,
//   goerli,
//   avalancheFuji,
//   polygonMumbai,
//   arbitrumGoerli,
//   optimismGoerli,
//   bscTestnet,
// } from "wagmi/chains";
export const metadata: Metadata = {
  title: "Decentralised P2P insurance",
  description: "Connect wallet and keep it safe",
  icons: {
    icon: "/images/favicon.ico", // /public path
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const config = createConfig({
  //   autoConnect: true,
  //   publicClient: createPublicClient({
  //     chain: sepolia,
  //     transport: http()
  //   }),
  // })
  return (
    <html lang="en">
      <body className="grid h-screen place-items-center bg-slate-500">
      {/* <WagmiConfig config={config}> */}
        {children}
        {/* </WagmiConfig> */}
      </body>
    </html>
  );
}
