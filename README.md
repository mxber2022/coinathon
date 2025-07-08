# 🎥 LiveDrop – Powered by Zora & Farcaster

> **LiveDrop** is a Farcaster Mini App that lets creators go live and monetize directly. Fans must mint a [Zora CoinV4](https://docs.zora.co/docs/zora-network/coin) token to unlock access to the livestream and replay.
> Every livestream becomes a coin. Every viewer becomes an owner. No ads. No middlemen. Just direct creator ↔ supporter value exchange.

---

## 🌐 Live Demo

> 🚀 [https://coinathon.vercel.app/](https://coinathon.vercel.app/) *(Replace with your deployment URL)*
> 🧪 Try it on [Farcaster Frames](https://warpcast.com) or visit via browser

---

## 🧠 Problem

### Traditional Livestream Platforms Are Broken

Platforms like **YouTube**, **Twitch**, and **TikTok** dominate livestreaming — but their business model extracts most of the value from both creators and fans.

---

### ❌ Creators Are Exploited

* Platforms **take 30–50%** of revenue through ads, subscriptions, and tips.
* Creators rely on monetization systems that can be **changed or revoked at any time**.
* Algorithms control distribution — creators **don’t control their audience reach**.
* Creators **don’t own their content, monetization, or community**.

> 🔒 Creators are trapped in closed platforms where they create value but don’t fully benefit from it.

---

### ❌ Fans Get Nothing for Their Support

* Fans give **time**, **money**, and **attention** — but get **no ownership** or benefits in return.
* They help creators grow, but get **no rewards** for being early supporters.
* Their attention is monetized by the platform, not the creator.

> 🙅‍♂️ Fans are treated like passive viewers instead of engaged participants.

---

### ❌ Platforms Win — Everyone Else Loses

| Stakeholder   | What They Give                      | Who Captures the Value |
| ------------- | ----------------------------------- | ---------------------- |
| **Creators**  | Content, energy, community building | Platform & advertisers |
| **Fans**      | Attention, money, social engagement | Platform & advertisers |
| **Platforms** | Infrastructure & algorithms         | Platform (100%)        |

---

### 💥 We Can Do Better

**LiveDrop** rethinks the livestream economy with Web3-native tools:

* ✅ No middlemen
* ✅ No ads
* ✅ No extractive platforms

Instead, creators and fans participate in a tokenized value loop:

* **Each livestream becomes a CoinV4 token**
* **Fans mint tokens to access the stream + perks**
* **Value flows directly between creators and supporters**

> 🎥 Every livestream becomes a coin. Every fan becomes a holder. Every moment creates real value.

---

## 💡 Solution

LiveDrop enables a **new kind of livestream economy**, where:

* 📀 Each livestream is tokenized as a **Zora CoinV4** coin.
* 🧑‍🤝‍🧑 Fans must **mint the coin to unlock**:

  * Live video access
  * Token-gated replay archive
  * Exclusive perks (NFT drops, shoutouts, polls, merch)
* 💸 Creators monetize directly through onchain coin mints.

---

## 🎥 How It Works

1. **Creator** starts a livestream via LiveDrop:

   * Adds title, description, livestream URL (e.g. YouTube, Twitch, Livepeer)
   * A new CoinV4 token is deployed

2. **Fan** opens the Farcaster Frame or Web App:

   * Clicks “Mint to Watch”
   * Gains access to livestream + future replay

3. **Replay** becomes accessible *only* to coin holders

4. **Optional Perks** for holders:

   * NFT airdrops
   * Shoutouts or leaderboard recognition
   * Token-gated chat or polls

---

## 🧰 Tech Stack

| Feature          | Tech                                                           |
| ---------------- | -------------------------------------------------------------- |
| Coin minting     | [Zora CoinV4 SDK](https://docs.zora.co/docs/zora-network/coin) |
| Mini App         | Farcaster Frame (Vite + React + Tailwind)                      |
| Token Gating     | wagmi + viem + CoinV4 ownership check                          |
| Livestream Embed | YouTube Live / Twitch / Livepeer iframe                        |
| Replay Storage   | IPFS or dynamic embed reuse                                    |
| NFT Airdrops     | Zora Create API                                                |
| Identity         | Sign-in with Ethereum + Farcaster handle                       |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mxber2022/coinathon
cd livedrop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_ZORA_API_KEY=your_zora_api_key
```

### 4. Run the app locally

```bash
npm run dev
```

---

## 📌 Roadmap (Post-Hackathon Ideas)

* 💬 Token-gated group chats via XMTP / Lens / Telegram
* 📈 Trending stream leaderboard based on coin price velocity
* 🧩 Remix livestreams by top holders (UGC loops)
* 🎁 Reward drops to top holders using Zora or Superfluid

---

## 🤝 Team

| Name          | Role                         |
| ------------- | ---------------------------- |
| MX            | Full Stack & Smart Contracts |
| You?          | DM to join the next version! |

---

## 📜 License

MIT License © 2025 LiveDrop Team

---
