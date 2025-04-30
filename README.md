# 🔷 Sonic Pulse  
### Real-Time Analytics & Explorer Dashboard on Sonic SVM

---

## 📌 Overview

**Sonic Pulse** is a high-performance, real-time analytics and explorer dashboard built on top of the **Sonic Solana Virtual Machine (SVM)**. Designed with speed, clarity, and extensibility in mind, it provides both developers and users with deep insights into the state and performance of the Sonic network.

It combines direct RPC access from the client with enriched backend APIs to give you a complete view of the blockchain — from low-level metrics to decoded transaction and account data.

---

## ⚙️ Client-Side RPC Integration

The dashboard directly interfaces with the Sonic RPC to retrieve the most up-to-date blockchain information without intermediary delays. The following data points are fetched live from the client:

- `latestBlock`: Most recent block produced on the network
- `slotHeight`: Current slot height of the blockchain
- `epochInfo`: Object containing current epoch, slots per epoch, progress, etc.
- `inflationRate`: Current inflation rate of the network
- `inflationGovernor`: Details about inflation parameters like terminal and taper rates
- `supply`: Total supply of tokens
- `totalTransactions`: Total number of transactions on the network
- `tsps`: Current Transactions Per Second

---

## 📊 Metrics & Visualizations

Using the raw data above, **Sonic Pulse** computes and visualizes a wide range of informative metrics:

- **Current Slot**
- **Latest Block Time**
- **Block Height**
- **TPS (Transactions Per Second)**
- **Total Token Supply**
- **Current Inflation Rate**
- **Validator Inflation**
- **Foundation Inflation**
- **Initial Inflation**
- **Initial Rate**
- **Terminal Rate**
- **Taper Rate**
- **Foundation Percent**
- **Progress (%)**
- **Slots Remaining in Epoch**
- **Total Slots in Epoch**
- **Current Epoch**

---

## 🔧 Backend (Encore-Powered) APIs

To enrich the client-side analytics, a custom backend server built with **Encore** provides extended functionality through the following API routes:

- `GET /account`  
  Returns full details of a given account, including:
  - Token balance
  - Transaction count
  - Ownership status
  - Delegation or stake info (if applicable)

- `GET /transaction`  
  Retrieves a fully decoded transaction including:
  - Instructions
  - Program logs
  - Accounts involved

- `GET /transactions`  
  Returns a list of recent transactions for a given account or criteria.

- `GET /transfers`  
  Filters and displays token transfers based on:
  - Source and destination addresses
  - Token mint
  - Amount transferred

These APIs ensure a smoother UX by abstracting complex parsing and offloading heavy operations from the frontend.

---

## 🧠 On-Chain Program Integration

Sonic Pulse includes an **IDL (Interface Definition Language) Fetching Mechanism**:

- If a program has a verified IDL uploaded on-chain, the dashboard will detect it.
- Once detected, the UI dynamically renders program-specific decoded instructions.
- Helps in understanding custom smart contract behavior and debugging transactions.

---

## 📈 Future Scope & Enhancements

Sonic Pulse is an actively evolving project. Planned features include:

- 🤖 **AI-Powered Indexer**  
  Automatically categorize and tag transactions, smart contract interactions, and user behaviors.

- ☁️ **Cloud Storage for Historical Data**  
  Archive all blocks, transactions, and account states for faster querying and replay features.

- 📉 **Token Price Fetching & Visual Charts**  
  Real-time price feeds integrated with visual representations, candlestick charts, and market cap data.

- 📊 **Additional Analytics**  
  - Fee burn stats  
  - Active addresses per slot  
  - Validator uptime & ranking  
  - Smart contract deployment tracking

---

## 💻 Tech Stack

- **Frontend:** React, Next.js, Tailwind CSS 
- **Backend:** Encore (TS-based serverless backend)
- **RPC Interface:** Direct Sonic SVM RPC client integration
- **Blockchain:** Sonic SVM (Solana-compatible virtual machine)

---

## 👥 Contributors

- Developer: [Shan Rasool]

> Contributions are welcome! Future versions will support open-source collaboration.

---

## 📄 License

MIT License — feel free to fork, build, and contribute.

---
