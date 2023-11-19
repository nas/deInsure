"use client"; // This is a client component 👈🏽
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useCallback, useEffect, useState } from "react";
import getChain from "./../utils/getChain";
import { initialChain } from "@/chains/chains";
import { ethers } from "ethers";
import Image from "next/image";
import { shortAddressLabel } from "@/utils/shortAddress";
import { ERC20_ABI } from "@/utils/erc20abi";

export default function Home() {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>("");

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([]);

  // chain selected
  const [chainId, setChainId] = useState<string>(() => {
    // if (isMoneriumRedirect()) {
    //   return '0x5'
    // }

    return initialChain.id;
  });
  // current safe selected by the user
  const [safeSelected, setSafeSelected] = useState<string>("");

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const isAuthenticated = !!ownerAddress && !!chainId;
  const chain = getChain(chainId) || initialChain;

  // reset React state when you switch the chain
  useEffect(() => {
    setOwnerAddress("");
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
  }, [chain]);

  useEffect(() => {
    (async () => {
      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
      const options: Web3AuthOptions = {
        clientId: "YOUR_WEB3_AUTH_CLIENT_ID", // https://dashboard.web3auth.io/
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x5",
          // https://chainlist.org/
          rpcTarget: "https://rpc.ankr.com/eth_goerli",
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "facebook"],
        },
      };

      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "metamask",
          showOnDesktop: true,
          showOnMobile: false,
        },
      };

      // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "mandatory",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
      });

      const web3AuthConfig: Web3AuthConfig = {
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      };

      // Instantiate and initialize the pack
      const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      setWeb3AuthModalPack(web3AuthModalPack);
    })();
  }, [chain]);

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    if (!web3AuthModalPack) return;

    try {
      const { safes, eoa } = await web3AuthModalPack.signIn();
      const provider =
        web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider;

      // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
      setChainId(chain.id);
      setOwnerAddress(eoa);
      setSafes(safes || []);
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
    } catch (error) {
      console.log("error: ", error);
    }
  }, [chain, web3AuthModalPack]);

  const logoutWeb3Auth = () => {
    web3AuthModalPack?.signOut();
    setOwnerAddress("");
    setSafes([]);
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
  };

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
      (async () => {
        await loginWeb3Auth();
      })();
    }
  }, [web3AuthModalPack, loginWeb3Auth]);

  web3AuthModalPack?.subscribe(ADAPTER_EVENTS.CONNECTED, () => {
    console.log("User is authenticated");
  });

  web3AuthModalPack?.subscribe(ADAPTER_EVENTS.DISCONNECTED, () => {
    console.log("User is not authenticated");
  });

  // const sentTxn = async () => {
  //   const txn = {
  //     to: "0x3391fA9045bBb346344a5EC39F89746Ae15a5820",
  //     value: ethers.utils.parseUnits("0.0005", "ether"),
  //   };
  //   console.info(txn);

  //   if (web3AuthModalPack) {
  //     console.info("HERE", ownerAddress);
  //     const provider = new ethers.providers.Web3Provider(
  //       web3AuthModalPack.getProvider(),
  //     );
  //     const signer = provider.getSigner();
  //     console.info(signer);
  //     const balance = await provider.getBalance(ownerAddress);
  //     console.info("Balance for email wallet", ethers.utils.formatEther(balance));

  //     await signer.sendTransaction(txn)
  //     await signer.signTransaction(txn)
  //     await signer.signMessage(" a pvt message");
  //   }
  // };

  return (
    <>
      <div className="mt-2">
        <h1 className="text-3xl font-bold underline text-white">OctoInsure - Decentralised P2P Insurance</h1>
      </div>

      <div>
        <Image
          className="rounded-lg shadow-lg"
          src="/images/de-insure.png"
          alt="decentralised insurance"
          width="500"
          height="500"
        />
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span className="mr-4 text-slate-300 font-semibold">
              {shortAddressLabel(ownerAddress)}
            </span>
            <button
              className="bg-red-500 mb-12 px-14 py-4 rounded-lg text-xl text-white font-semibold shadow-lg"
              onClick={async () => await logoutWeb3Auth()}
            >
              Disconnect
            </button>

            {/* <button onClick={async () => await sentTxn()}>Send Txn</button> */}
          </>
        ) : (
          <button
            className="bg-green-500 mb-12 px-24 py-6 rounded-lg text-xl text-white font-semibold shadow-lg"
            onClick={async () => await loginWeb3Auth()}
          >
            Connect
          </button>
        )}
      </div>
    </>
  );
}
