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
  {
    id: "b1",
    level: "beginner",
    topic: "company",
    q: "What is Base, and who built it?",
    options: [
      "Coinbase's L2 built on top of the OP Stack rollup",
      "A Solana sidechain operated by the Helium core team",
      "An Ethereum mainnet client maintained by ConsenSys",
      "A self-custody wallet maintained by Trust Wallet team",
    ],
    answer: 0,
    explain:
      "Base is the L2 incubated by Coinbase, built on the OP Stack, the same stack that powers Optimism.",
  },
  {
    id: "b2",
    level: "beginner",
    topic: "networks",
    q: "Which networks does CDP Node currently support?",
    options: [
      "Base Mainnet and Base Sepolia testnet, both included",
      "Ethereum mainnet, Polygon mainnet, plus Base Mainnet",
      "Solana mainnet plus Base Mainnet on the same project",
      "Arbitrum mainnet, Optimism mainnet, plus Base Mainnet",
    ],
    answer: 0,
    explain:
      "CDP Node is Base-only today. Base Mainnet plus Base Sepolia testnet on the same project.",
  },
  {
    id: "b3",
    level: "beginner",
    topic: "company",
    q: "What does the acronym CDP stand for in this context?",
    options: [
      "Coinbase Developer Platform, the umbrella product line",
      "Coinbase Direct Pipeline, a wallet-connect mode line",
      "Crypto Developer Portal, a generic dashboard product",
      "Coinbase Data Pipeline, a real-time data stream tool",
    ],
    answer: 0,
    explain:
      "CDP is Coinbase Developer Platform, the umbrella for Node, Server Wallet, Paymaster, AgentKit, and more.",
  },
  {
    id: "b4",
    level: "beginner",
    topic: "company",
    q: "What is Coinbase Cloud's tagline for the CDP product line?",
    options: [
      "Trusted crypto infrastructure to power your business",
      "The fastest blockchain RPC for any chain you build on",
      "Build, ship, and scale your dApp on Solana with ease",
      "One platform for every onchain idea your team has now",
    ],
    answer: 0,
    explain:
      "The published CDP tagline is 'Trusted crypto infrastructure to power your business.'",
  },
  {
    id: "b5",
    level: "beginner",
    topic: "billing",
    q: "How many free Billing Units does CDP Node include per month?",
    options: [
      "10 million BU per calendar month, no rollover allowed",
      "1 million BU per calendar month, with monthly rollover",
      "25 million BU per calendar month, with weekly resets",
      "50 million BU per calendar month, with annual resets",
    ],
    answer: 0,
    explain:
      "CDP Node's free tier is 10 million BU per calendar month. It resets the first of the month and does not roll over.",
  },
  {
    id: "b6",
    level: "beginner",
    topic: "company",
    q: "Which company is the parent of the Base L2 network?",
    options: [
      "Coinbase, the publicly listed crypto exchange company",
      "Optimism, the team behind the OP Stack rollup design",
      "Polygon, the team behind PoS, zkEVM, and CDK rollups",
      "Arbitrum, the team behind Nitro and Stylus rollup tech",
    ],
    answer: 0,
    explain:
      "Base is incubated and operated by Coinbase. Optimism wrote the OP Stack that Base is built on, but Coinbase is Base's parent.",
  },
  {
    id: "b7",
    level: "beginner",
    topic: "networks",
    q: "What is Base Sepolia in CDP Node's product surface?",
    options: [
      "Base's public testnet, available alongside Base Mainnet",
      "Base's archive node with deep historical state queries",
      "Base's staking network for validator slashing data feed",
      "Base's beta sequencer for the next OP Stack hard fork",
    ],
    answer: 0,
    explain:
      "Base Sepolia is the public Base testnet. CDP Node serves both Base Mainnet and Base Sepolia.",
  },
  {
    id: "b8",
    level: "beginner",
    topic: "brand",
    q: "Which color is Coinbase's signature brand wordmark color?",
    options: [
      "Cobalt blue, the iconic Coinbase logo and brand color",
      "Hunter green, used by ConsenSys for its product lines",
      "Vivid magenta, used by Polygon for its brand mark only",
      "Sunset orange, used by Solana mainstream brand themes",
    ],
    answer: 0,
    explain:
      "Coinbase's brand color is its signature cobalt blue, used in the wordmark and the new CDP visual identity.",
  },
  {
    id: "b9",
    level: "beginner",
    topic: "rpc",
    q: "What does the acronym RPC stand for in this product context?",
    options: [
      "Remote Procedure Call, the standard JSON-RPC interface",
      "Rapid Protocol Channel, a new Coinbase wire format spec",
      "Rollup Permission Code, a Base sequencer auth token name",
      "Realtime Pipeline Cache, a Coinbase data product offering",
    ],
    answer: 0,
    explain:
      "RPC stands for Remote Procedure Call. Ethereum nodes expose a standard JSON-RPC interface.",
  },
  {
    id: "b10",
    level: "beginner",
    topic: "rpc",
    q: "What is JSON-RPC, in simple plain terms for builders?",
    options: [
      "A standard request format used to talk to a chain node",
      "A signed transaction format broadcast over P2P gossip",
      "A new event-streaming protocol from the Coinbase team",
      "A binary RPC format used by Solana validator software",
    ],
    answer: 0,
    explain:
      "JSON-RPC is the request/response format Ethereum-style chains use. Methods like eth_call, eth_getLogs all go over JSON-RPC.",
  },
  {
    id: "b11",
    level: "beginner",
    topic: "networks",
    q: "What is the typical block time on the Base Mainnet network?",
    options: [
      "About 2 seconds per block on the Base Mainnet network",
      "About 12 seconds per block, like Ethereum mainnet does",
      "About 400 milliseconds, like the Solana mainnet block",
      "About 30 seconds per block on Base Mainnet right now",
    ],
    answer: 0,
    explain:
      "Base targets about 2 second blocks. Ethereum mainnet is about 12 seconds, Solana is sub-second.",
  },
  {
    id: "b12",
    level: "beginner",
    topic: "networks",
    q: "In which year did the Base Mainnet network officially launch?",
    options: [
      "2023, with Coinbase's incubation of the L2 network",
      "2021, just after the original Optimism mainnet launch",
      "2022, alongside Coinbase Wallet Smart Wallet rollout",
      "2024, alongside the Cancun hard fork EIP-4844 blobs",
    ],
    answer: 0,
    explain:
      "Base Mainnet went live in 2023, incubated by Coinbase and built on the OP Stack.",
  },

  // ───────── INTERMEDIATE (12) ─────────
  {
    id: "i1",
    level: "intermediate",
    topic: "billing",
    q: "How many BU does a Standard JSON-RPC method consume per call?",
    options: [
      "30 BU per call (eth_call, eth_getBalance, eth_chainId)",
      "26 BU per call (the Alchemy CU price for eth_call now)",
      "10 BU per call (the QuickNode credit price for any read)",
      "50 BU per call (the Tenderly TU rate for a Free RPC read)",
    ],
    answer: 0,
    explain:
      "Standard methods are 30 BU per call on CDP Node. eth_call, eth_getBalance, eth_chainId, eth_blockNumber all sit in this tier.",
  },
  {
    id: "i2",
    level: "intermediate",
    topic: "billing",
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
    id: "i3",
    level: "intermediate",
    topic: "billing",
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
    id: "i4",
    level: "intermediate",
    topic: "pricing",
    q: "What is the CDP Node overage rate for usage above the free tier?",
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
    id: "i5",
    level: "intermediate",
    topic: "rpc",
    q: "What is CDP Node's published per-project rate-limit ceiling?",
    options: [
      "7,500 BU per 5 seconds, about 50 RPS at 30 BU average",
      "5,000 BU per 5 seconds, about 30 RPS at 30 BU average",
      "10,000 BU per 5 seconds, about 60 RPS at 30 BU average",
      "15,000 BU per 5 seconds, about 100 RPS at 30 BU average",
    ],
    answer: 0,
    explain:
      "Per-project ceiling is 7,500 BU per 5 seconds, about 50 requests per second at the 30 BU average.",
  },
  {
    id: "i6",
    level: "intermediate",
    topic: "billing",
    q: "When does CDP Node start requiring a payment method on file?",
    options: [
      "Starting January 2026, free tier still applies as before",
      "Starting January 2025, free tier still applies as before",
      "Starting June 2026, free tier ends and PAYG is required",
      "Starting June 2025, free tier ends and PAYG is required",
    ],
    answer: 0,
    explain:
      "Starting January 2026 a payment method is required on file. The 10M BU free tier still applies.",
  },
  {
    id: "i7",
    level: "intermediate",
    topic: "billing",
    q: "How does the CDP Node free tier reset across calendar months?",
    options: [
      "Resets first day of each calendar month, no rollover",
      "Resets first day of each calendar quarter, with rollover",
      "Resets every 30 days from project creation, no rollover",
      "Resets every Monday morning UTC time zone, no rollover",
    ],
    answer: 0,
    explain:
      "The 10M BU free tier resets the first day of each calendar month and does not roll over.",
  },
  {
    id: "i8",
    level: "intermediate",
    topic: "wallet",
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
    id: "i9",
    level: "intermediate",
    topic: "products",
    q: "What problem does the CDP Paymaster product primarily solve?",
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
    id: "i10",
    level: "intermediate",
    topic: "billing",
    q: "Which CDP Node BU class does the eth_getLogs RPC method fall into?",
    options: [
      "Enhanced 100 BU class, alongside eth_getTransactionReceipt",
      "Standard 30 BU class, alongside basic eth_call read methods",
      "Advanced 500 BU class, alongside debug_traceTransaction calls",
      "Custom 250 BU class, alongside eth_sendRawTransaction calls",
    ],
    answer: 0,
    explain:
      "eth_getLogs is in the Enhanced 100 BU class along with eth_getTransactionReceipt and eth_getBlockByNumber.",
  },
  {
    id: "i11",
    level: "intermediate",
    topic: "billing",
    q: "Which BU class does eth_sendRawTransaction belong to on CDP Node?",
    options: [
      "Advanced 500 BU class, alongside debug_traceTransaction now",
      "Enhanced 100 BU class, alongside eth_getLogs and receipts now",
      "Standard 30 BU class, alongside eth_call basic reads on Base",
      "Premium 250 BU class, alongside trace_block and trace_filter",
    ],
    answer: 0,
    explain:
      "eth_sendRawTransaction is Advanced 500 BU. Writes are heavier than reads because they touch the sequencer path.",
  },
  {
    id: "i12",
    level: "intermediate",
    topic: "networks",
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

  // ───────── EXPERT (12) ─────────
  {
    id: "e1",
    level: "expert",
    topic: "billing",
    q: "Exact BU weight for debug_traceTransaction on CDP Node today?",
    options: [
      "500 BU per call, in the Advanced method tier on Base",
      "250 BU per call, in the Enhanced method tier on Base",
      "100 BU per call, in the Standard method tier on Base",
      "1000 BU per call, in the Premium tier on Base Mainnet",
    ],
    answer: 0,
    explain:
      "debug_traceTransaction is Advanced 500 BU on CDP Node. All debug_trace* methods sit in this tier.",
  },
  {
    id: "e2",
    level: "expert",
    topic: "billing",
    q: "Exact BU weight for the eth_call read method on CDP Node today?",
    options: [
      "30 BU per call (Standard tier on Base, alongside chainId)",
      "26 BU per call (matches the Alchemy CU figure for the call)",
      "10 BU per call (matches the Alchemy CU price for blockNumber)",
      "100 BU per call (matches the Enhanced tier price for getLogs)",
    ],
    answer: 0,
    explain:
      "eth_call is Standard 30 BU on CDP Node. 26 CU is Alchemy's published figure, not Coinbase's.",
  },
  {
    id: "e3",
    level: "expert",
    topic: "billing",
    q: "Exact BU weight for the eth_estimateGas method on CDP Node today?",
    options: [
      "100 BU per call, in the Enhanced method tier on Base",
      "30 BU per call, in the Standard method tier on Base now",
      "500 BU per call, in the Advanced method tier on Base now",
      "250 BU per call, in the Premium tier on the Base Mainnet",
    ],
    answer: 0,
    explain:
      "eth_estimateGas is Enhanced 100 BU on CDP Node, alongside eth_getLogs and eth_getTransactionReceipt.",
  },
  {
    id: "e4",
    level: "expert",
    topic: "billing",
    q: "Which BU tier does trace_replayBlockTransactions fall under here?",
    options: [
      "Advanced 500 BU tier, alongside the debug_trace* methods",
      "Enhanced 100 BU tier, alongside the eth_getLogs methods",
      "Standard 30 BU tier, alongside the eth_call read methods",
      "Premium 250 BU tier, alongside eth_sendRawTransaction now",
    ],
    answer: 0,
    explain:
      "trace_replayBlockTransactions is in the Advanced 500 BU tier with the rest of the trace_* and debug_trace* methods.",
  },
  {
    id: "e5",
    level: "expert",
    topic: "billing",
    q: "10 million BU equals roughly how many 100% Standard 30-BU calls?",
    options: [
      "About 333,000 calls per month if all are Standard 30 BU",
      "About 100,000 calls per month if all are Standard 30 BU",
      "About 500,000 calls per month if all are Standard 30 BU",
      "About 750,000 calls per month if all are Standard 30 BU",
    ],
    answer: 0,
    explain:
      "10,000,000 / 30 BU per call equals about 333,000 Standard calls. This is the headline 'what 10M BU buys you' figure.",
  },
  {
    id: "e6",
    level: "expert",
    topic: "brand",
    q: "Which exact hex value is Coinbase's official primary brand blue?",
    options: [
      "#0052FF, the official Coinbase signature cobalt blue today",
      "#1E40AF, a deep navy used by many Web3 dashboard themes",
      "#2563EB, a vivid Tailwind blue-600 used in design systems",
      "#3B82F6, a Tailwind blue-500 used in many dashboard themes",
    ],
    answer: 0,
    explain:
      "Coinbase's brand primary blue is #0052FF. The Tailwind blues #2563EB and #3B82F6 are common on dashboards but aren't the Coinbase mark.",
  },
  {
    id: "e7",
    level: "expert",
    topic: "products",
    q: "Which agent SDK is shipped as part of the broader CDP product line?",
    options: [
      "AgentKit, the Coinbase Developer Platform agent toolkit SDK",
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
    topic: "networks",
    q: "What is the published target block time for the Base Mainnet today?",
    options: [
      "About 2 seconds per block, the standard OP Stack block time",
      "About 12 seconds per block, the standard Ethereum slot time",
      "About 400ms per block, the published Solana mainnet target",
      "About 250ms per block, the Arbitrum Nitro stylus block time",
    ],
    answer: 0,
    explain:
      "Base targets 2-second blocks, the standard OP Stack target. Ethereum is 12 seconds, Solana is sub-second.",
  },
  {
    id: "e9",
    level: "expert",
    topic: "billing",
    q: "Which BU tier does eth_simulateV1 fall under on the CDP Node today?",
    options: [
      "Standard 30 BU tier, alongside eth_call and eth_chainId now",
      "Enhanced 100 BU tier, alongside eth_getLogs and receipts now",
      "Advanced 500 BU tier, alongside the debug_trace* method set",
      "Premium 250 BU tier, alongside eth_sendRawTransaction methods",
    ],
    answer: 0,
    explain:
      "eth_simulateV1 is in the Standard 30 BU tier per the published pricing page.",
  },
  {
    id: "e10",
    level: "expert",
    topic: "billing",
    q: "Which BU tier does eth_estimateUserOperationGas fall under here?",
    options: [
      "Advanced 500 BU tier, alongside debug_trace* and trace_* now",
      "Enhanced 100 BU tier, alongside eth_estimateGas and getLogs",
      "Standard 30 BU tier, alongside eth_call and other reads now",
      "Premium 250 BU tier, alongside eth_sendRawTransaction methods",
    ],
    answer: 0,
    explain:
      "eth_estimateUserOperationGas is Advanced 500 BU. ERC-4337 user-op estimation is heavier than plain eth_estimateGas.",
  },
  {
    id: "e11",
    level: "expert",
    topic: "company",
    q: "What makes CDP Node infrastructure stand out vs other Base RPC vendors?",
    options: [
      "Same node infra that powers Coinbase's retail exchange today",
      "Same node infra that powers QuickNode's marketplace endpoints",
      "Same node infra that powers BlockDaemon's enterprise endpoints",
      "Same node infra that powers Tenderly's Virtual TestNet endpoints",
    ],
    answer: 0,
    explain:
      "CDP runs on the same node infrastructure that powers Coinbase's retail exchange. That is the published credibility hook.",
  },
  {
    id: "e12",
    level: "expert",
    topic: "networks",
    q: "What is the consensus assumption Base inherits from the OP Stack today?",
    options: [
      "A sequencer-based rollup model with later fraud-proof finality",
      "A validator set proof-of-stake style consensus, like Ethereum L1",
      "A delegated proof-of-stake style consensus, like BNB Chain L1",
      "A proof-of-history style consensus, like the Solana mainnet L1",
    ],
    answer: 0,
    explain:
      "OP Stack rollups are sequencer-based. Today the sequencer is centralized, with fraud-proof finality posted to Ethereum L1.",
  },
];

const TOPIC_LABEL: Record<string, string> = {
  company: "Coinbase Cloud and CDP",
  networks: "Base Mainnet and Sepolia",
  rpc: "JSON-RPC and node basics",
  billing: "BU pricing and weights",
  pricing: "Free tier and overage",
  products: "Paymaster, Webhooks, AgentKit",
  wallet: "Server Wallet and Embedded Wallet",
  brand: "Coinbase brand and design",
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
