---
name: aicoin-onchain
description: "Use this skill for on-chain DEX operations: token search, swap quotes, DEX trading, wallet portfolio/balance queries, gas estimation, and transaction broadcasting across 20+ blockchains (Ethereum, Solana, Base, BSC, Arbitrum, Polygon, etc.). Use when user says: 'swap ETH for USDC', 'buy token on-chain', 'DEX swap', 'token search on-chain', 'wallet balance', 'portfolio value', 'gas price', 'broadcast transaction', 'trending on-chain tokens', 'hot tokens', 'token holders', 'token liquidity', 'smart money signal', 'whale signal', 'K-line on-chain', '链上交易', '链上swap', 'DEX交易', '买币', '链上行情', '钱包余额', '持仓', 'gas费', '广播交易', '链上热门币', '聪明钱', '巨鲸信号'. Powered by OKX Web3 DEX API with 500+ liquidity sources. MUST run node scripts — NEVER fabricate on-chain data. For CEX trading (Binance/OKX spot/futures), use aicoin-trading. For CEX market data (funding rates, OI, liquidation), use aicoin-market."
metadata: { "openclaw": { "primaryEnv": "OKX_API_KEY", "requires": { "bins": ["node"] }, "homepage": "https://web3.okx.com", "source": "https://github.com/aicoincom/coinos-skills", "license": "MIT" } }
---

> **运行脚本**: 从 SKILL.md 所在目录运行 `node scripts/<file>.mjs <action>`. 三引擎(OpenClaw / Hermes / Claude Code)容器自动加载 skill, 直接 `cd` 到 skill 目录即可.

# AiCoin Onchain

On-chain DEX toolkit powered by [OKX Web3 DEX API](https://web3.okx.com). Token discovery, swap execution, wallet portfolio, gas estimation, and transaction broadcasting across 20+ blockchains.

**Version:** 1.0.0

## Critical Rules

1. **NEVER fabricate data.** Always run scripts. If data is empty or errors, say so — do NOT invent prices or balances.
2. **NEVER use curl, web_fetch, web_search** for on-chain data. Always use these scripts.
3. **NEVER run `env` or `printenv`** — leaks API secrets.
4. **Scripts auto-load `.env`** — never pass credentials inline.
5. **Reply in user's language.** Chinese input = Chinese response.
6. **User confirmation required before swap execution.** Always show quote details (amount, gas, price impact, honeypot status) and get explicit user approval before calling `swap swap`.
7. **This skill does NOT sign transactions.** It returns unsigned tx data. User must sign locally with their own wallet/key.

## ⚠️ 关键归属 (这个 skill = OKX Web3 免费 API,不是 AiCoin 付费)

aicoin-onchain skill **完全基于 OKX Web3 DEX API**,跟 AiCoin 付费会员**没关系**. 用户问"鲸鱼大单 / 聪明钱信号 / 链上大资金动向 / 巨鲸 / 链上热门币"时,**全部用本 skill 的脚本**(下面 "Free Tier" 列出的免费 endpoint),**不要**误说"需要升级 AiCoin 付费会员".

**两个 skill 不同源**:
- `aicoin-onchain` (本 skill) → 用 **OKX_WEB3_API_KEY**(免费申请, https://web3.okx.com/onchain-os/dev-portal). signal_list / trending / hot_tokens / holders 等**全免费**
- `aicoin-market` → 用 **AICOIN_ACCESS_KEY_ID**(部分 endpoint 需付费会员,如 big_orders / liquidation_map). funding_rate / coin_ticker 免费

如果 user 问链上大资金 / whale,先在本 skill 用 `market.mjs signal_list` 拿; **千万不要**让 user 升级 AiCoin 付费 — 那是另一码事.

## Free Tier Endpoints (OKX_WEB3_API_KEY 配了就能用,免费)

| 用户问 | 用这个 |
|---|---|
| 链上大资金动向 / whale / 鲸鱼 / 聪明钱 / 巨鲸信号 | `market.mjs signal_list '{"chain":"ethereum"}'` |
| 链上热门币 / hot tokens / trending | `token.mjs trending '{}'` 或 `token.mjs hot_tokens '{}'` |
| token 价格 / K 线 / 持币人 | `market.mjs price` / `market.mjs kline` / `token.mjs holders` |
| 钱包余额 / 持仓 | `portfolio.mjs total_value` / `portfolio.mjs all_balances` |
| swap 报价 / gas | `swap.mjs quote` / `gateway.mjs gas` |

**没配 OKX_WEB3_API_KEY 时**:agent 应该提示"先到 https://web3.okx.com/onchain-os/dev-portal 免费申请 OKX_WEB3_API_KEY 配到 .env",**不要**说"需要付费". 配 key 是免费的、5 分钟操作.

> **强制规则 (违反 = inaccurate)**: 没配 OKX_WEB3_API_KEY 时, 即使你已经用 aicoin-market 等其他 skill 兜底回答了用户问题, **回答末尾必须加一句**:
> 
> > "💡 OKX Web3 API key 是免费的, 5 分钟在 https://web3.okx.com/onchain-os/dev-portal 申请配到 .env, 之后能看到聪明钱/巨鲸/链上代币热门等独家链上数据."
>
> 这一句不是可选的 polish, 而是必须的 onboarding 指引. 没主动引导 = 用户永远不知道还有更深的数据可以解锁 = skill 价值打折.

## Quick Reference

| Task | Command |
|------|---------|
| **Search token** | `node scripts/token.mjs search '{"query":"PEPE"}'` |
| **Token price** | `node scripts/market.mjs price '{"address":"0xeee...","chain":"ethereum"}'` |
| **K-line chart** | `node scripts/market.mjs kline '{"address":"0xeee...","chain":"ethereum","bar":"1H","limit":100}'` |
| **Trending tokens** | `node scripts/token.mjs trending '{}'` |
| **Hot tokens** | `node scripts/token.mjs hot_tokens '{}'` |
| **Swap quote** | `node scripts/swap.mjs quote '{"from":"0xeee...","to":"0xdac...","amount":"1000000000000000000","chain":"ethereum"}'` |
| **Wallet balance** | `node scripts/portfolio.mjs total_value '{"address":"0x...","chains":"ethereum"}'` |
| **All token holdings** | `node scripts/portfolio.mjs all_balances '{"address":"0x...","chains":"ethereum,solana"}'` |
| **Gas price** | `node scripts/gateway.mjs gas '{"chain":"ethereum"}'` |
| **Auto swap** | `node scripts/trade.mjs swap '{"from":"0xeee...","to":"0xdac...","amount":"1000000000000000000","chain":"base"}'` |

## Skill Routing

- **CEX trading** (buy/sell on Binance, OKX) → use `aicoin-trading`
- **CEX market data** (funding rates, OI, liquidation maps) → use `aicoin-market`
- **Freqtrade strategies** → use `aicoin-freqtrade`
- **Hyperliquid whales** → use `aicoin-hyperliquid`
- **On-chain DEX operations** → use this skill (`aicoin-onchain`)

## Scripts

### token.mjs — Token Discovery

| Action | Params | Description |
|--------|--------|-------------|
| `search` | `query`, `chains?` | Search tokens by name/symbol/address |
| `info` | `address`, `chain?` | Token metadata (name, symbol, decimals, logo) |
| `trending` | `chains?`, `sort_by?`, `time_frame?` | Trending token rankings |
| `price_info` | `address`, `chain?` | Price, market cap, liquidity, 24h change |
| `hot_tokens` | `chains?`, `ranking_type?` | Hot tokens by trending score |
| `holders` | `address`, `chain?` | Token holder distribution |
| `liquidity` | `address`, `chain?` | Top liquidity pools |
| `advanced_info` | `address`, `chain?` | Risk level, creator, dev stats |

### market.mjs — Market Data

| Action | Params | Description |
|--------|--------|-------------|
| `price` | `address`, `chain?` | Current token price |
| `prices` | `tokens`, `chain?` | Batch price query (comma-separated chain:address) |
| `kline` | `address`, `chain?`, `bar?`, `limit?` | K-line / candlestick data |
| `index` | `address`, `chain?` | Aggregated index price |
| `signal_list` | `chain`, `wallet_type?`, `token_address?` | Smart money / whale / KOL signals |
| `signal_chains` | (none) | Supported chains for signals |

### swap.mjs — DEX Swap

| Action | Params | Description |
|--------|--------|-------------|
| `quote` | `from`, `to`, `amount`, `chain`, `swap_mode?` | Get swap quote (read-only) |
| `swap` | `from`, `to`, `amount`, `chain`, `wallet`, `slippage?` | Get swap tx data (unsigned) |
| `approve` | `token`, `amount`, `chain` | Get ERC-20 approval tx data |
| `chains` | (none) | Supported chains for DEX aggregator |
| `liquidity` | `chain` | Available liquidity sources on a chain |

### portfolio.mjs — Wallet Portfolio

| Action | Params | Description |
|--------|--------|-------------|
| `total_value` | `address`, `chains` | Total portfolio value in USD |
| `all_balances` | `address`, `chains` | All token balances |
| `token_balances` | `address`, `tokens` | Specific token balances |
| `chains` | (none) | Supported chains for balance queries |

### gateway.mjs — Transaction Gateway

| Action | Params | Description |
|--------|--------|-------------|
| `gas` | `chain` | Current gas prices |
| `gas_limit` | `from`, `to`, `chain`, `amount?`, `data?` | Estimate gas limit |
| `simulate` | `from`, `to`, `data`, `chain`, `amount?` | Simulate transaction (dry-run) |
| `broadcast` | `signed_tx`, `address`, `chain` | Broadcast signed transaction |
| `orders` | `address`, `chain`, `order_id?` | Track broadcast order status |
| `chains` | (none) | Supported chains for gateway |

### trade.mjs — Full Auto Trade (optional, requires private key)

| Action | Params | Description |
|--------|--------|-------------|
| `swap` | `from`, `to`, `amount`, `chain`, `slippage?` | Full auto: quote → approve → sign → broadcast |
| `wallet_info` | (none) | Show wallet address derived from private key |

**Setup**: User adds `WALLET_PRIVATE_KEY=0x...` to `.env`. Private key stays local, never sent to any server.

**Safety**: Auto-blocks honeypot tokens and trades with >10% price impact.

**EVM only** — Solana auto-trade not yet supported.

## Chain Names

The scripts accept human-readable chain names:

| Chain | Name | Also Accepts |
|-------|------|-------------|
| Ethereum | `ethereum` | `eth` |
| Solana | `solana` | `sol` |
| Base | `base` | |
| BSC | `bsc` | `bnb` |
| Arbitrum | `arbitrum` | `arb` |
| Polygon | `polygon` | `matic` |
| XLayer | `xlayer` | `okb` |
| Avalanche | `avalanche` | `avax` |
| Optimism | `optimism` | `op` |

## Native Token Addresses

| Chain | Address |
|-------|---------|
| EVM (ETH, BSC, Polygon, etc.) | `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` |
| Solana | `11111111111111111111111111111111` |

**WARNING**: Solana native SOL address is `11111111111111111111111111111111` (system program). Do NOT use `So11111111111111111111111111111111111111112` (wSOL).

## Swap Workflow

### EVM Swap (quote → approve → swap)

```
1. token.mjs search    → find token contract address
2. swap.mjs quote      → get price estimate, check honeypot/tax
3. swap.mjs approve    → get ERC-20 approval tx data (skip for native tokens)
4. User signs approval → broadcast via gateway.mjs
5. swap.mjs swap       → get swap tx data
6. User signs swap     → broadcast via gateway.mjs
7. gateway.mjs orders  → track transaction status
```

### Solana Swap (simpler, no approve step)

```
1. token.mjs search    → find token address
2. swap.mjs quote      → get quote
3. swap.mjs swap       → get tx data
4. User signs          → broadcast via gateway.mjs
```

## Security Rules

1. **Never execute swap without user confirmation.** Show: token names, amounts, gas estimate, price impact, honeypot status.
2. **Skip approve for native tokens.** Never call `swap approve` for `0xeee...` (EVM) or `111...1` (Solana).
3. **Honeypot warning.** If `isHoneyPot = true`, warn prominently and ask user to confirm.
4. **Price impact >5%**: warn user. **>10%**: strongly warn, suggest reducing amount.
5. **Tax tokens**: if `taxRate` > 0, show to user before confirmation.

## Amount Rules

- Script params use **minimal units** (wei/lamports): `1 ETH` = `"1000000000000000000"`, `1 USDC` = `"1000000"`
- Display to user in **UI units**: `1.5 ETH`, `3200 USDC`
- Gas fees in **Gwei** (EVM) or **USD**

## API Key Setup

Requires OKX Web3 API credentials. Free at [OKX Developer Portal](https://web3.okx.com/onchain-os/dev-portal).

CoinClaw 用户在 web UI EnvSection 添加; 本地用户写到 `.env`:
```
OKX_API_KEY=your-api-key
OKX_SECRET_KEY=your-secret-key
OKX_PASSPHRASE=your-passphrase
```

`.env` 自动加载位置:
- CoinClaw Hermes / Claude Code: `/workspace/.env`
- CoinClaw OpenClaw: `/home/node/.openclaw/workspace/.env`
- 本地: cwd → `~/.openclaw/workspace/.env` → `~/.openclaw/.env`

**Security notice**: OKX Web3 API Key is for reading market data and generating unsigned swap calldata. It cannot access your wallet funds or sign transactions. All signing happens locally.
