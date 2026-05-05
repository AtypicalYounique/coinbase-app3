import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// 36 questions: 12 beginner + 12 intermediate + 12 expert. 4 choices each.
// Length parity: max/min char count of choices stays within 1.10 per question.
// Distractors lean on real EVM RPC competitors (Alchemy, QuickNode, Infura, Tenderly,
// Ankr, BlockDaemon, Chainstack), real Coinbase products (Wallet, Prime, Exchange,
// Commerce, Pay), and real OP/Base terms (OP Stack, Optimism, Bedrock, Cancun,
// EIP-4844 blobs).

type Question = {
  id: string;
  level: "beginner" | "intermediate" | "expert";
  topic: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

const BANK: Question[] = [
  // ───────── BEGINNER (12) ─────────
  // 5 fun, 5 product, 2 industry
  {
    id: "b1",
    level: "beginner",
    topic: "company-fun-facts",
    q: "Who are the two co-founders of Coinbase, the parent of Base?",
    options: [
      "Brian Armstrong and Fred Ehrsam, who met via Reddit",
      "Vitalik Buterin and Gavin Wood, of the early Ethereum",
      "Changpeng Zhao and He Yi, who built the Binance group",
      "Jesse Powell and Thanh Luu, who built Kraken exchange",
    ],
    answer: 0,
    explain:
      "Coinbase was co-founded in 2012 by Brian Armstrong (a former Airbnb engineer) and Fred Ehrsam (a former Goldman Sachs currency trader). They met on the Bitcoin subreddit.",
  },
  {
    id: "b2",
    level: "beginner",
    topic: "company-fun-facts",
    q: "In what year was Coinbase, the company behind Base, founded?",
    options: [
      "2012, the same year it joined Y Combinator's S12 batch",
      "2010, the same year as the famous Bitcoin pizza buy day",
      "2014, the same year as the original Mt Gox exchange fall",
      "2017, the year of the original ICO bull run on Ethereum",
    ],
    answer: 0,
    explain:
      "Coinbase was founded in 2012 and joined Y Combinator's Summer 2012 (S12) batch the same year, originally pitched as 'Bitbank.'",
  },
  {
    id: "b3",
    level: "beginner",
    topic: "company-fun-facts",
    q: "What stock ticker does Coinbase trade under on Nasdaq today?",
    options: [
      "COIN, the ticker assigned for its 2021 direct listing",
      "CBSE, the ticker often guessed but never used by them",
      "CNBS, the ticker often confused with the cable network",
      "CBNE, the ticker briefly suggested in early IPO drafts",
    ],
    answer: 0,
    explain:
      "Coinbase trades on Nasdaq under the ticker COIN, assigned at its April 14, 2021 direct listing.",
  },
  {
    id: "b4",
    level: "beginner",
    topic: "company-fun-facts",
    q: "What is the iconic brand color of the Coinbase wordmark?",
    options: [
      "A signature cobalt blue used in the Coinbase logo",
      "A vivid magenta used in the Polygon brand wordmark",
      "A deep hunter green used in the ConsenSys product",
      "A bright sunset orange used by the Solana branding",
    ],
    answer: 0,
    explain:
      "Coinbase's brand color is its signature cobalt blue (hex #0052FF), used across the wordmark and CDP visual identity.",
  },
  {
    id: "b5",
    level: "beginner",
    topic: "company-fun-facts",
    q: "Which famous startup accelerator did Coinbase graduate from?",
    options: [
      "Y Combinator, in the Summer 2012 (S12) cohort batch",
      "Techstars, in the New York City Summer 2012 cohort",
      "500 Startups, in the early Mountain View 2012 batch",
      "AngelPad, in the original Bay Area Summer 2012 batch",
    ],
    answer: 0,
    explain:
      "Coinbase went through Y Combinator's Summer 2012 (S12) batch, applying under the original name 'Bitbank.'",
  },
  {
    id: "b6",
    level: "beginner",
    topic: "company-products",
    q: "Which networks does CDP Node currently support out of the box?",
    options: [
      "Base Mainnet and Base Sepolia testnet, both included",
      "Ethereum mainnet, Polygon mainnet, plus Base Mainnet",
      "Solana mainnet plus Base Mainnet on the same project",
      "Arbitrum mainnet, Optimism mainnet, plus Base Mainnet",
    ],
    answer: 0,
    explain:
      "CDP Node is Base-only today: Base Mainnet plus Base Sepolia testnet on the same project.",
  },
  {
    id: "b7",
    level: "beginner",
    topic: "company-products",
    q: "What does the acronym CDP stand for in Coinbase's product line?",
    options: [
      "Coinbase Developer Platform, the umbrella product line",
      "Coinbase Direct Pipeline, a wallet-connect mode line",
      "Crypto Developer Portal, a generic dashboard product",
      "Coinbase Data Pipeline, a real-time data stream tool",
    ],
    answer: 0,
    explain:
      "CDP is the Coinbase Developer Platform, the umbrella for Node, Server Wallet, Paymaster, Onramp, AgentKit, and more.",
  },
  {
    id: "b8",
    level: "beginner",
    topic: "company-products",
    q: "What is the main job of the CDP Server Wallet product?",
    options: [
      "A backend wallet API for signing and broadcasting txs",
      "A self-custody mobile wallet app for end retail users",
      "A hosted explorer that decodes wallet activity history",
      "A custodial exchange wallet behind Coinbase Pro trades",
    ],
    answer: 0,
    explain:
      "Server Wallet is a backend API for programmatic wallets: key management, signing, broadcasting, and policy evaluation from your server.",
  },
  {
    id: "b9",
    level: "beginner",
    topic: "company-products",
    q: "How many free Billing Units does CDP Node include each month?",
    options: [
      "10 million BU per calendar month, with no rollover",
      "1 million BU per calendar month, with monthly rollover",
      "25 million BU per calendar month, with weekly resets",
      "50 million BU per calendar month, with annual resets",
    ],
    answer: 0,
    explain:
      "CDP Node's free tier is 10 million BU per calendar month. It resets the first of the month and does not roll over.",
  },
  {
    id: "b10",
    level: "beginner",
    topic: "company-products",
    q: "What is Base Sepolia in the CDP Node product surface?",
    options: [
      "Base's public testnet, served alongside Base Mainnet",
      "Base's archive node with deep historical state queries",
      "Base's staking network for validator slashing data feed",
      "Base's beta sequencer for the next OP Stack hard fork",
    ],
    answer: 0,
    explain:
      "Base Sepolia is the public Base testnet. CDP Node serves both Base Mainnet and Base Sepolia from the same project.",
  },
  {
    id: "b11",
    level: "beginner",
    topic: "industry",
    q: "What does the acronym RPC stand for in this product context?",
    options: [
      "Remote Procedure Call, the JSON-RPC standard format",
      "Rapid Protocol Channel, a Coinbase wire format spec",
      "Rollup Permission Code, a Base sequencer auth token",
      "Realtime Pipeline Cache, a Coinbase data product API",
    ],
    answer: 0,
    explain:
      "RPC stands for Remote Procedure Call. EVM nodes expose a standard JSON-RPC interface for methods like eth_call.",
  },
  {
    id: "b12",
    level: "beginner",
    topic: "industry",
    q: "What is JSON-RPC, in plain terms for an app developer?",
    options: [
      "A standard request format used to talk to a chain node",
      "A signed transaction format broadcast over P2P gossip",
      "A new event-streaming protocol from the Coinbase team",
      "A binary RPC format used by Solana validator software",
    ],
    answer: 0,
    explain:
      "JSON-RPC is the request/response format EVM-style chains use. Methods like eth_call, eth_getLogs all go over JSON-RPC.",
  },

  // ───────── INTERMEDIATE (12) ─────────
  // 5 fun, 5 product, 2 industry
  {
    id: "i1",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "On what date did Coinbase go public on Nasdaq via direct listing?",
    options: [
      "April 14, 2021, with reference price set at $250",
      "April 14, 2020, with reference price set at $250",
      "October 5, 2021, with reference price set at $381",
      "January 12, 2022, with reference price set at $250",
    ],
    answer: 0,
    explain:
      "Coinbase went public on Nasdaq via direct listing on April 14, 2021. Nasdaq set a reference price of $250 the day before.",
  },
  {
    id: "i2",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Who led Coinbase's $5M Series A funding round back in May 2013?",
    options: [
      "Union Square Ventures, with Fred Wilson on the lead",
      "Andreessen Horowitz, with Marc Andreessen on the lead",
      "Sequoia Capital, with Roelof Botha leading the round",
      "Founders Fund, with Peter Thiel leading the A round",
    ],
    answer: 0,
    explain:
      "Coinbase's $5M Series A in May 2013 was led by Union Square Ventures (Fred Wilson). Ribbit Capital, SV Angel, and FundersClub also took part.",
  },
  {
    id: "i3",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "When did the Base Mainnet network officially open to all users?",
    options: [
      "August 9, 2023, alongside the Onchain Summer launch",
      "August 9, 2022, alongside the Onchain Summer launch",
      "February 23, 2023, with the original developer beta",
      "December 15, 2023, alongside the Optimism Bedrock fork",
    ],
    answer: 0,
    explain:
      "Base Mainnet opened to all users on August 9, 2023, kicking off the multi-week 'Onchain Summer' launch event.",
  },
  {
    id: "i4",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Who at Coinbase is the public face and lead of the Base L2 network?",
    options: [
      "Jesse Pollak, who also leads Coinbase Wallet now",
      "Paul Grewal, who leads the Coinbase legal team now",
      "Emilie Choi, who leads the Coinbase Ventures group",
      "Surojit Chatterjee, who once led the product group",
    ],
    answer: 0,
    explain:
      "Jesse Pollak created Base and leads it. In late 2024 he joined the Coinbase exec team and also took the lead on Coinbase Wallet.",
  },
  {
    id: "i5",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Where is Coinbase's official corporate headquarters located today?",
    options: [
      "Nowhere, Coinbase declared no HQ in February 2021",
      "San Francisco, in the original SoMa office building",
      "New York City, in a Manhattan financial district tower",
      "Wilmington, Delaware, in a small registered office park",
    ],
    answer: 0,
    explain:
      "After moving remote-first in May 2020, Coinbase declared in February 2021 that it has no headquarters and is a 'decentralized company.'",
  },
  {
    id: "i6",
    level: "intermediate",
    topic: "company-products",
    q: "How many BU does a Standard JSON-RPC method consume per call?",
    options: [
      "30 BU per call (eth_call, eth_getBalance, eth_chainId)",
      "26 BU per call (the Alchemy CU price for eth_call now)",
      "10 BU per call (the QuickNode credit price for any read)",
      "50 BU per call (the Tenderly TU rate for a Free RPC read)",
    ],
    answer: 0,
    explain:
      "Standard methods are 30 BU per call on CDP Node. eth_call, eth_getBalance, eth_chainId, eth_blockNumber sit in this tier.",
  },
  {
    id: "i7",
    level: "intermediate",
    topic: "company-products",
    q: "How many BU does an Enhanced JSON-RPC method consume per call?",
    options: [
      "100 BU per call (eth_getLogs, eth_getTransactionReceipt)",
      "75 BU per call (matches Alchemy's eth_getLogs CU rating)",
      "150 BU per call (matches BlockDaemon's published weight)",
      "250 BU per call (matches Ankr's published premium weight)",
    ],
    answer: 0,
    explain:
      "Enhanced methods are 100 BU per call on CDP Node. That includes eth_getLogs, eth_getTransactionReceipt, eth_getBlockByNumber, eth_estimateGas.",
  },
  {
    id: "i8",
    level: "intermediate",
    topic: "company-products",
    q: "What is the CDP Node overage rate above the monthly free tier?",
    options: [
      "$0.50 per 1,000,000 BU above the 10M monthly free tier",
      "$0.40 per 1,000,000 BU above the 10M monthly free tier",
      "$1.00 per 1,000,000 BU above the 10M monthly free tier",
      "$0.10 per 1,000,000 BU above the 10M monthly free tier",
    ],
    answer: 0,
    explain:
      "CDP Node bills $0.50 per million BU above the 10M free tier. $0.40 is Alchemy's PAYG rate, not Coinbase's.",
  },
  {
    id: "i9",
    level: "intermediate",
    topic: "company-products",
    q: "How is the CDP Server Wallet add-on actually billed each month?",
    options: [
      "$0.005 per op, with the first 5,000 ops free per month",
      "$0.010 per op, with the first 1,000 ops free per month",
      "$0.001 per op, with the first 50,000 ops free per month",
      "$0.020 per op, with the first 2,500 ops free per month",
    ],
    answer: 0,
    explain:
      "Server Wallet is $0.005 per op, with 5,000 ops per month free. Ops include signing, broadcasting, and policy evaluation.",
  },
  {
    id: "i10",
    level: "intermediate",
    topic: "company-products",
    q: "What problem does the CDP Paymaster product primarily solve for apps?",
    options: [
      "Gas sponsorship so users don't need to hold ETH on Base",
      "Gas indexing so analysts don't need to query trace_block",
      "Gas hedging so treasuries don't need to bridge USDC daily",
      "Gas streaming so explorers don't need to decode log topics",
    ],
    answer: 0,
    explain:
      "Paymaster sponsors gas for end users so they don't need to hold ETH on Base, paired with Smart Wallet and ERC-4337.",
  },
  {
    id: "i11",
    level: "intermediate",
    topic: "industry",
    q: "Which rollup framework is the Base Mainnet network built on top of?",
    options: [
      "OP Stack, the open rollup framework from Optimism today",
      "Polygon CDK, the modular rollup toolkit from Polygon Labs",
      "Arbitrum Orbit, the rollup framework from Offchain Labs Inc",
      "ZK Stack, the rollup framework from Matter Labs and zkSync",
    ],
    answer: 0,
    explain:
      "Base is built on the OP Stack, Optimism's open-source rollup framework. Polygon CDK, Arbitrum Orbit, and ZK Stack are competitors.",
  },
  {
    id: "i12",
    level: "intermediate",
    topic: "industry",
    q: "What is the typical block time on the Base Mainnet network today?",
    options: [
      "About 2 seconds per block on the Base Mainnet network",
      "About 12 seconds per block, like Ethereum mainnet does",
      "About 400 milliseconds, like the Solana mainnet block",
      "About 30 seconds per block on Base Mainnet right now",
    ],
    answer: 0,
    explain:
      "Base targets about 2 second blocks, the standard OP Stack target. Ethereum mainnet is about 12 seconds, Solana is sub-second.",
  },

  // ───────── EXPERT (12) ─────────
  // 4 fun, 4 product, 4 industry
  {
    id: "e1",
    level: "expert",
    topic: "company-fun-facts",
    q: "At what price did Coinbase stock open on its first trading day?",
    options: [
      "$381, well above the $250 reference price level",
      "$250, exactly the Nasdaq-set reference price level",
      "$430, the published intraday high on listing day",
      "$328, the published settle price on the listing day",
    ],
    answer: 0,
    explain:
      "Coinbase opened at $381 on April 14, 2021, more than 50% above the $250 reference price. It hit ~$430 intraday and settled near $328.",
  },
  {
    id: "e2",
    level: "expert",
    topic: "company-fun-facts",
    q: "Where did Coinbase's CEO Brian Armstrong work just before founding it?",
    options: [
      "Airbnb, where he was an engineer before launching it",
      "Goldman Sachs, where he was a forex trader on the desk",
      "Google, where he led the Wallet team in Mountain View",
      "Stripe, where he was an early platform-side engineer",
    ],
    answer: 0,
    explain:
      "Brian Armstrong was an engineer at Airbnb before founding Coinbase. Co-founder Fred Ehrsam is the one who came from Goldman Sachs.",
  },
  {
    id: "e3",
    level: "expert",
    topic: "company-fun-facts",
    q: "Which crypto venture firm did co-founder Fred Ehrsam later launch?",
    options: [
      "Paradigm, the crypto venture fund he started in 2018",
      "Polychain Capital, the fund Olaf Carlson-Wee started",
      "a16z crypto, the crypto arm of Andreessen Horowitz LP",
      "Multicoin Capital, founded by Kyle Samani in Texas",
    ],
    answer: 0,
    explain:
      "Fred Ehrsam left Coinbase in early 2017 and later co-founded Paradigm in 2018 with Matt Huang, a top crypto-focused venture fund.",
  },
  {
    id: "e4",
    level: "expert",
    topic: "company-fun-facts",
    q: "Which consortium did Coinbase and Circle co-found in October 2018?",
    options: [
      "Centre Consortium, the original USDC governance group",
      "Travel Rule Information Sharing Alliance (TRISA) group",
      "Crypto Open Patent Alliance (COPA), the IP defense group",
      "Chamber of Digital Commerce, the DC-based policy group",
    ],
    answer: 0,
    explain:
      "Coinbase and Circle co-founded the Centre Consortium in October 2018 to govern the USDC stablecoin. Centre was later wound down in 2023.",
  },
  {
    id: "e5",
    level: "expert",
    topic: "company-products",
    q: "How many BU does an Advanced JSON-RPC method consume per call?",
    options: [
      "500 BU per call (debug_trace*, eth_sendRawTransaction)",
      "250 BU per call (matches Alchemy's eth_sendRawTransaction)",
      "1000 BU per call (matches Chainstack's premium weights)",
      "150 BU per call (matches QuickNode's standard credits)",
    ],
    answer: 0,
    explain:
      "Advanced methods are 500 BU per call on CDP Node. debug_traceTransaction, trace_block, eth_sendRawTransaction sit here.",
  },
  {
    id: "e6",
    level: "expert",
    topic: "company-products",
    q: "Which BU tier does debug_traceTransaction fall under on CDP Node?",
    options: [
      "Advanced 500 BU tier, alongside the trace_* method set",
      "Enhanced 100 BU tier, alongside the eth_getLogs methods",
      "Standard 30 BU tier, alongside the eth_call read methods",
      "Premium 250 BU tier, alongside eth_sendRawTransaction now",
    ],
    answer: 0,
    explain:
      "debug_traceTransaction is Advanced 500 BU on CDP Node. All debug_trace* and trace_* methods sit in this tier.",
  },
  {
    id: "e7",
    level: "expert",
    topic: "company-products",
    q: "Which agent SDK is shipped as part of the broader CDP product line?",
    options: [
      "AgentKit, the Coinbase Developer Platform agent toolkit",
      "OnchainKit, the Coinbase frontend React component library",
      "WalletConnect, the multi-wallet pairing protocol stack used",
      "RainbowKit, the popular React wallet connector library used",
    ],
    answer: 0,
    explain:
      "AgentKit is Coinbase's agent SDK in the CDP product line. OnchainKit is the React UI library, not the agent SDK.",
  },
  {
    id: "e8",
    level: "expert",
    topic: "company-products",
    q: "What is CDP Node's published per-project rate-limit ceiling?",
    options: [
      "7,500 BU per 5 seconds, around 50 RPS at 30 BU average",
      "5,000 BU per 5 seconds, around 30 RPS at 30 BU average",
      "10,000 BU per 5 seconds, around 60 RPS at 30 BU average",
      "15,000 BU per 5 seconds, around 100 RPS at 30 BU average",
    ],
    answer: 0,
    explain:
      "Per-project ceiling is 7,500 BU per 5 seconds, about 50 requests per second at the 30 BU Standard average.",
  },
  {
    id: "e9",
    level: "expert",
    topic: "industry",
    q: "What is the consensus assumption Base inherits from the OP Stack?",
    options: [
      "A sequencer-based rollup with later fraud-proof finality",
      "A validator-set proof-of-stake consensus, like Ethereum L1",
      "A delegated proof-of-stake consensus, like the BNB Chain L1",
      "A proof-of-history style consensus, like the Solana mainnet",
    ],
    answer: 0,
    explain:
      "OP Stack rollups are sequencer-based. Today the sequencer is centralized, with fraud-proof finality posted to Ethereum L1.",
  },
  {
    id: "e10",
    level: "expert",
    topic: "industry",
    q: "What is the main purpose of Ethereum's EIP-4844 'blobs' upgrade?",
    options: [
      "Cheaper L2 data availability for rollups like Base now",
      "Cheaper L1 calldata for plain ERC-20 transfers on the L1",
      "Faster L1 block times by halving the standard slot length",
      "Smaller L1 state proofs sent over the standard libp2p pipe",
    ],
    answer: 0,
    explain:
      "EIP-4844 (proto-danksharding) added 'blob' transactions, giving rollups like Base much cheaper data availability on Ethereum L1.",
  },
  {
    id: "e11",
    level: "expert",
    topic: "industry",
    q: "What does ERC-4337 standardize on EVM chains, including Base today?",
    options: [
      "Account abstraction with user ops and smart wallet flows",
      "An NFT royalty registry standard for marketplaces on EVM",
      "A token bridge standard for cross-chain canonical mints now",
      "A new gas-token standard for L2 sequencer fee bidding now",
    ],
    answer: 0,
    explain:
      "ERC-4337 standardizes account abstraction on EVM chains via user operations and bundlers, enabling smart-wallet flows like Coinbase Smart Wallet.",
  },
  {
    id: "e12",
    level: "expert",
    topic: "industry",
    q: "What is the published target block time for Ethereum L1 mainnet?",
    options: [
      "About 12 seconds per slot, the standard L1 slot timing",
      "About 2 seconds per slot, the standard OP Stack timing",
      "About 400ms per slot, the standard Solana mainnet timing",
      "About 250ms per slot, the standard Arbitrum Nitro timing",
    ],
    answer: 0,
    explain:
      "Ethereum L1 targets a 12 second slot. Base (and other OP Stack rollups) target 2 seconds; Solana targets sub-second slots.",
  },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Coinbase company fun facts",
  "company-products": "CDP product line",
  industry: "Industry and technical",
};

// ── Helpers ────────────────────────────────────────────────
// Fisher-Yates shuffle of question order, plus per-question position-shuffle
// of the correct answer to fight position bias.
function shuffleQuestions(questions: Question[]): Question[] {
  const ordered = [...questions];
  for (let i = ordered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
  }
  return ordered.map((q) => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_, i) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const targetPos = Math.floor(Math.random() * 4);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

function App() {
  const [stage, setStage] = useState<"setup" | "run" | "done">("setup");
  const [qs, setQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [toast, setToast] = useState(false);

  // On mount, prepare a default shuffled deck so the user can dive in.
  useEffect(() => {
    setQs(shuffleQuestions(BANK));
  }, []);

  const start = () => {
    setQs(shuffleQuestions(BANK));
    setIdx(0);
    setPicks({});
    setRevealed({});
    setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid: string, ci: number) => {
    if (revealed[qid] !== undefined) return;
    setPicks((p) => ({ ...p, [qid]: ci }));
    setRevealed((r) => ({ ...r, [qid]: ci }));
  };

  const nextQ = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else setStage("done");
  };

  const correctCount = useMemo(
    () => qs.reduce((acc, q) => acc + (picks[q.id] === q.answer ? 1 : 0), 0),
    [qs, picks]
  );

  const breakdown = useMemo(() => {
    const m = {
      beginner: { correct: 0, total: 0 },
      intermediate: { correct: 0, total: 0 },
      expert: { correct: 0, total: 0 },
    };
    for (const q of qs) {
      m[q.level].total++;
      if (picks[q.id] === q.answer) m[q.level].correct++;
    }
    return m;
  }, [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push("Coinbase Cloud · Base & CDP Node Trivia");
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Breakdown by difficulty:");
    lines.push(`  - Beginner: ${breakdown.beginner.correct}/${breakdown.beginner.total}`);
    lines.push(
      `  - Intermediate: ${breakdown.intermediate.correct}/${breakdown.intermediate.total}`
    );
    lines.push(`  - Expert: ${breakdown.expert.correct}/${breakdown.expert.total}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  - ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [correctCount, qs.length, breakdown, topicBreakdown]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setToast(true);
      setTimeout(() => setToast(false), 1600);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = summary;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast(true);
      setTimeout(() => setToast(false), 1600);
    }
  };

  const restart = () => {
    setStage("setup");
    setIdx(0);
    setPicks({});
    setRevealed({});
    setQs(shuffleQuestions(BANK));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (stage === "setup") {
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
            dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
          />
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="eyebrow">Coinbase Cloud knowledge quiz · 36 questions</div>
        <h1>
          Base & CDP Node <span className="hl">trivia</span>
        </h1>
        <p className="lede">
          12 beginner, 12 intermediate, 12 expert questions covering Base, the OP Stack, CDP Node Billing Units, Paymaster, Server Wallet, JSON-RPC method costs, and the broader Coinbase Developer Platform. Length parity validated. Plausible wrong answers.
        </p>

        <div className="card">
          <h2>What's inside</h2>
          <ul className="ticks">
            <li>36 questions total · 12 per difficulty tier</li>
            <li>4 choices each · correct answer position randomized per session</li>
            <li>Distractors use real EVM RPC competitors and Coinbase product names</li>
            <li>No accounts, no tracking, runs locally in your browser</li>
          </ul>
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}>
              Start the 36 question quiz
            </button>
          </div>
        </div>

        <div className="footer-note">
          CDP Node facts here come from the public pricing and docs pages: 10M BU per calendar month free, $0.50 per million BU above, 7,500 BU per 5 seconds rate limit, Standard 30 BU / Enhanced 100 BU / Advanced 500 BU method weights, Server Wallet at $0.005 per op with 5,000 free per month, payment method on file required from January 2026, Base Mainnet and Base Sepolia networks only, same node infrastructure that powers Coinbase's retail exchange.
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    if (!q) return null;
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
            dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
          />
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="progress">
          <div style={{ width: `${(idx / qs.length) * 100}%` }} />
        </div>
        <div className="eyebrow">
          Question {idx + 1} of {qs.length} · {TOPIC_LABEL[q.topic] || q.topic} · {q.level}
        </div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt, i) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return (
              <button key={i} className={cls} onClick={() => choose(q.id, i)}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
          {reveal && (
            <div className="explain">
              <strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}
            </div>
          )}
          {reveal && (
            <div style={{ marginTop: 14 }}>
              <button className="btn" onClick={nextQ}>
                {idx + 1 < qs.length ? "Next question" : "See results"}
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>
            Restart
          </button>
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = qs.length ? Math.round((correctCount / qs.length) * 100) : 0;
  const headline =
    pct >= 90
      ? "Genuinely sharp on Base, the OP Stack, and CDP Node billing."
      : pct >= 70
      ? "Solid working understanding of CDP Node and Base."
      : pct >= 50
      ? "Reasonable grasp. A few good rabbit holes ahead."
      : "Plenty of room to learn. The CDP docs are a good next stop.";

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent quiz</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>
        {correctCount} / {qs.length} correct · {pct}%
      </h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Breakdown by difficulty</h2>
        <div className="topic-row">
          <span style={{ color: "var(--text)" }}>Beginner</span>
          <span className="num">
            {breakdown.beginner.correct}/{breakdown.beginner.total}
          </span>
        </div>
        <div className="topic-row">
          <span style={{ color: "var(--text)" }}>Intermediate</span>
          <span className="num">
            {breakdown.intermediate.correct}/{breakdown.intermediate.total}
          </span>
        </div>
        <div className="topic-row">
          <span style={{ color: "var(--text)" }}>Expert</span>
          <span className="num">
            {breakdown.expert.correct}/{breakdown.expert.total}
          </span>
        </div>
      </div>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "var(--text)" }}>{TOPIC_LABEL[t] || t}</span>
            <span className="num">
              {v.correct}/{v.total}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Where to go next</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          The full CDP product reference, JSON-RPC method weights, and Server Wallet docs live at{" "}
          <a href="https://docs.cdp.coinbase.com" target="_blank" rel="noopener noreferrer">
            docs.cdp.coinbase.com
          </a>
          . Pricing and BU tables are at{" "}
          <a
            href="https://docs.cdp.coinbase.com/data/node/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs.cdp.coinbase.com/data/node/pricing
          </a>
          .
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>
            Copy results
          </button>
          <button className="btn secondary" onClick={restart}>
            Take the quiz again
          </button>
        </div>
      </div>

      <div className="footer-note">
        CDP Node facts in this quiz are sourced from the public pricing and docs pages (10M BU per calendar month free, $0.50 per million BU above, 7,500 BU per 5 seconds rate limit, Standard 30 BU / Enhanced 100 BU / Advanced 500 BU method weights, Server Wallet at $0.005 per op with 5,000 free per month, payment method on file required from January 2026, Base Mainnet and Base Sepolia networks). Distractors reference real EVM RPC competitors (Alchemy, QuickNode, Infura, Tenderly, Ankr, BlockDaemon, Chainstack), real Coinbase products (Wallet, Prime, Exchange, Commerce, Pay), and real OP/Base terms (OP Stack, Optimism, Bedrock, Cancun, EIP-4844 blobs) so guessing is genuinely harder.
      </div>

      <div className="pdf-footer print-only">
        An independent tool by Ryan Lacerda. Not affiliated with Coinbase Cloud. Visit coinbase cloud at https://www.coinbase.com/developer-platform.
      </div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
      <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
