import { ChainInfo } from "@keplr-wallet/types";

import { Chain } from "config";
import { Tokens, TokenType } from "constants/";

type WindowWithKeplr = Window &
  typeof globalThis & {
    keplr: {
      experimentalSuggestChain?: (chainInfo: ChainInfo) => Promise<void>;
      enable: (chainId: string) => Promise<void>;
      getKey: (chainId: string) => Promise<{
        // Name of the selected key store.
        name: string;
        algo: string;
        pubKey: Uint8Array;
        address: Uint8Array;
        bech32Address: string;
      }>;
    };
  };

class Keplr {
  constructor(
    private _chain: Chain,
    private _keplr = (<WindowWithKeplr>window)?.keplr
  ) {}

  public get chain(): Chain {
    return this._chain;
  }

  public detect(): boolean {
    return !!this._keplr?.experimentalSuggestChain;
  }

  public async suggestChain(): Promise<boolean> {
    if (this._keplr && this._keplr.experimentalSuggestChain) {
      console.log(this._chain);
      const { id: chainId, alias: chainName, network } = this._chain;
      const { protocol, url, port } = network;
      const rpcUrl = `${protocol}://${url}${port ? ":" + port : ""}`;
      // The following should match our Rest API URL and be added to chain config
      // instead of hard-coding port here:
      const restUrl = `${protocol}://${url}:1317`;

      const tokenType: TokenType = "ATOM";
      const token = Tokens[tokenType];
      const { symbol, coinGeckoId } = token;

      const currency = {
        coinDenom: symbol,
        coinMinimalDenom: "uatom", // Add this to Token config?
        coinDecimals: 6,
        coinGeckoId,
      };

      const chainInfo: ChainInfo = {
        rpc: rpcUrl,
        rest: restUrl,
        chainId,
        chainName,
        stakeCurrency: currency,
        bip44: {
          coinType: token.type,
        },
        bech32Config: {
          bech32PrefixAccAddr: "cosmos",
          // Should the following change to match Namada (e.g., "atest", etc)?
          bech32PrefixAccPub: "cosmos" + "pub",
          bech32PrefixValAddr: "cosmos" + "valoper",
          bech32PrefixValPub: "cosmos" + "valoperpub",
          bech32PrefixConsAddr: "cosmos" + "valcons",
          bech32PrefixConsPub: "cosmos" + "valconspub",
        },
        currencies: [currency],
        feeCurrencies: [currency],
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 }, // This is optional!
      };

      console.log({ chainInfo });

      return this._keplr
        .experimentalSuggestChain(chainInfo)
        .then(() => Promise.resolve(true))
        .catch(() => Promise.reject(false));
    }
    return Promise.reject(false);
  }

  public async enable(): Promise<boolean> {
    if (this._keplr) {
      const { id } = this._chain;

      return this._keplr
        .enable(id)
        .then(() => Promise.resolve(true))
        .catch(() => Promise.reject(false));
    }
    return false;
  }

  public async getKey(): Promise<boolean> {
    if (this._keplr) {
      const { id } = this._chain;

      return this._keplr
        .getKey(id)
        .then(() => Promise.resolve(true))
        .catch(() => Promise.reject(false));
    }
    return false;
  }
}

export default Keplr;
