export type TopSearchTerm = {
  label: string;
  q: string;
  labelZh?: string;
};

/** Suggested queries — wire to /search when index exists */
export const topSearched: TopSearchTerm[] = [
  {
    label: "AA wallets",
    q: "account abstraction wallets",
    labelZh: "AA 钱包",
  },
  {
    label: "L2 bridges",
    q: "L2 bridge comparison",
    labelZh: "L2 跨链桥",
  },
  {
    label: "Solidity jobs",
    q: "Solidity hiring",
    labelZh: "Solidity 招聘",
  },
  {
    label: "Bug bounties",
    q: "bug bounty web3",
    labelZh: "漏洞赏金",
  },
];
