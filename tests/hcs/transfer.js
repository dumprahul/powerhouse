const {
  AccountId,
  PrivateKey,
  Client,
  TransferTransaction,
  AccountBalanceQuery,
  TokenId
} = require("@hashgraph/sdk"); // v2.64.5

// Configuration
const MY_ACCOUNT_ID = AccountId.fromString("0.0.5161124");
const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("0x65daa5b4616b0af96bea690f5c4afc0337a002bc7f5c3f2e28e575b9a253d31e");

// Your WHISTLE token ID from readme.md
const WHISTLE_TOKEN_ID = TokenId.fromString("0.0.7304457");

/**
 * Initialize and return a Hedera client for testnet
 */
function getClient() {
  const client = Client.forTestnet();
  client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
  return client;
}

/**
 * TRANSFER TOKENS
 * Transfers HTS tokens from one account to another
 * @param {string|TokenId} tokenId - The token ID to transfer (e.g., "0.0.7304457" or TokenId object)
 * @param {string|AccountId} senderAccountId - The sender's account ID
 * @param {PrivateKey} senderPrivateKey - The sender's private key
 * @param {string|AccountId} receiverAccountId - The receiver's account ID
 * @param {number|string} amount - The amount of tokens to transfer (must be positive)
 * @returns {Promise<Object>} Object containing transactionId, status, and hashscanUrl
 */
async function transferTokens(tokenId, senderAccountId, senderPrivateKey, receiverAccountId, amount) {
  let client;
  try {
    client = getClient();

    // Convert string inputs to proper types if needed
    const token = typeof tokenId === 'string' ? TokenId.fromString(tokenId) : tokenId;
    const sender = typeof senderAccountId === 'string' ? AccountId.fromString(senderAccountId) : senderAccountId;
    const receiver = typeof receiverAccountId === 'string' ? AccountId.fromString(receiverAccountId) : receiverAccountId;
    const transferAmount = typeof amount === 'string' ? parseInt(amount) : amount;

    if (transferAmount <= 0) {
      throw new Error("Transfer amount must be greater than 0");
    }

    // Create the transfer transaction
    // Negative amount for sender (debit), positive amount for receiver (credit)
    const txTransfer = await new TransferTransaction()
      .addTokenTransfer(token, sender, -transferAmount) // Sender loses tokens
      .addTokenTransfer(token, receiver, transferAmount) // Receiver gains tokens
      .freezeWith(client);

    // Sign with the sender account private key
    const signTxTransfer = await txTransfer.sign(senderPrivateKey);

    // Sign with the client operator private key and submit to a Hedera network
    const txTransferResponse = await signTxTransfer.execute(client);

    // Request the receipt of the transaction
    const receiptTransferTx = await txTransferResponse.getReceipt(client);

    // Obtain the transaction consensus status
    const statusTransferTx = receiptTransferTx.status;

    // Get the Transaction ID
    const txTransferId = txTransferResponse.transactionId.toString();

    console.log("--------------------------------- Token Transfer ---------------------------------");
    console.log("Token ID                 :", token.toString());
    console.log("From Account             :", sender.toString());
    console.log("To Account               :", receiver.toString());
    console.log("Amount                   :", transferAmount);
    console.log("Receipt status           :", statusTransferTx.toString());
    console.log("Transaction ID           :", txTransferId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/transaction/" + txTransferId);

    return {
      tokenId: token.toString(),
      fromAccount: sender.toString(),
      toAccount: receiver.toString(),
      amount: transferAmount,
      transactionId: txTransferId,
      status: statusTransferTx.toString(),
      hashscanUrl: "https://hashscan.io/testnet/transaction/" + txTransferId
    };
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

/**
 * TRANSFER WHISTLE TOKENS
 * Convenience function to transfer WHISTLE tokens from your account to another
 * @param {string|AccountId} receiverAccountId - The receiver's account ID
 * @param {number|string} amount - The amount of WHISTLE tokens to transfer
 * @returns {Promise<Object>} Transfer result object
 */
async function transferWhistleTokens(receiverAccountId, amount) {
  return transferTokens(
    WHISTLE_TOKEN_ID,
    MY_ACCOUNT_ID,
    MY_PRIVATE_KEY,
    receiverAccountId,
    amount
  );
}

/**
 * GET TOKEN BALANCE
 * Gets the token balance for a specific account
 * @param {string|AccountId} accountId - The account ID to check balance for
 * @param {string|TokenId} tokenId - The token ID to check balance for (optional, if not provided returns all tokens)
 * @returns {Promise<Object>} Object containing account balance information
 */
async function getTokenBalance(accountId, tokenId = null) {
  let client;
  try {
    client = getClient();

    const account = typeof accountId === 'string' ? AccountId.fromString(accountId) : accountId;

    // Query the account balance
    const balanceQuery = new AccountBalanceQuery()
      .setAccountId(account);

    let accountBalance;
    try {
      accountBalance = await balanceQuery.execute(client);
    } catch (queryError) {
      console.error("Error querying account balance:", queryError.message);
      throw new Error(`Failed to query balance for account ${account.toString()}: ${queryError.message}`);
    }

    console.log("--------------------------------- Token Balance ---------------------------------");
    console.log("Account ID              :", account.toString());

    if (tokenId) {
      const token = typeof tokenId === 'string' ? TokenId.fromString(tokenId) : tokenId;
      
      // Check if tokens Map exists and is valid
      if (!accountBalance || !accountBalance.tokens) {
        console.log("Token ID                 :", token.toString());
        console.log("Balance                  : 0 (No tokens in account)");
        return {
          accountId: account.toString(),
          tokenId: token.toString(),
          balance: "0"
        };
      }
      
      // Safely get token balance
      let tokenBalance;
      try {
        tokenBalance = accountBalance.tokens.get(token.toString());
      } catch (error) {
        console.log("Token ID                 :", token.toString());
        console.log("Balance                  : 0 (Error retrieving balance)");
        return {
          accountId: account.toString(),
          tokenId: token.toString(),
          balance: "0"
        };
      }
      
      // Check if tokenBalance is valid before calling toString()
      if (tokenBalance !== undefined && tokenBalance !== null && typeof tokenBalance.toString === 'function') {
        console.log("Token ID                 :", token.toString());
        console.log("Balance                  :", tokenBalance.toString());
        return {
          accountId: account.toString(),
          tokenId: token.toString(),
          balance: tokenBalance.toString()
        };
      } else {
        console.log("Token ID                 :", token.toString());
        console.log("Balance                  : 0 (Token not found in account)");
        return {
          accountId: account.toString(),
          tokenId: token.toString(),
          balance: "0"
        };
      }
    } else {
      // Return all token balances
      const tokenBalances = {};
      
      if (accountBalance && accountBalance.tokens) {
        accountBalance.tokens.forEach((balance, token) => {
          if (balance && typeof balance.toString === 'function') {
            console.log(`Token ${token}          : ${balance.toString()}`);
            tokenBalances[token] = balance.toString();
          }
        });
      }
      
      const hbarBalance = accountBalance && accountBalance.hbars 
        ? accountBalance.hbars.toString() 
        : "0";
      
      console.log("HBAR Balance             :", hbarBalance);
      
      return {
        accountId: account.toString(),
        hbarBalance,
        tokenBalances
      };
    }
  } catch (error) {
    console.error("Error getting token balance:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

/**
 * GET WHISTLE TOKEN BALANCE
 * Convenience function to get WHISTLE token balance for an account
 * @param {string|AccountId} accountId - The account ID to check balance for
 * @returns {Promise<Object>} Balance information
 */
async function getWhistleTokenBalance(accountId) {
  return getTokenBalance(accountId, WHISTLE_TOKEN_ID);
}

/**
 * TRANSFER MULTIPLE TOKENS IN ONE TRANSACTION
 * Transfers multiple different tokens in a single transaction
 * @param {Array} transfers - Array of transfer objects: [{tokenId, senderId, senderKey, receiverId, amount}, ...]
 * @returns {Promise<Object>} Transaction result
 */
async function transferMultipleTokens(transfers) {
  let client;
  try {
    client = getClient();

    if (!Array.isArray(transfers) || transfers.length === 0) {
      throw new Error("Transfers must be a non-empty array");
    }

    const txTransfer = new TransferTransaction();

    // Add all token transfers
    for (const transfer of transfers) {
      const token = typeof transfer.tokenId === 'string' 
        ? TokenId.fromString(transfer.tokenId) 
        : transfer.tokenId;
      const sender = typeof transfer.senderId === 'string' 
        ? AccountId.fromString(transfer.senderId) 
        : transfer.senderId;
      const receiver = typeof transfer.receiverId === 'string' 
        ? AccountId.fromString(transfer.receiverId) 
        : transfer.receiverId;
      const amount = typeof transfer.amount === 'string' 
        ? parseInt(transfer.amount) 
        : transfer.amount;

      txTransfer.addTokenTransfer(token, sender, -amount);
      txTransfer.addTokenTransfer(token, receiver, amount);
    }

    // Freeze and sign with all required keys
    const frozenTx = await txTransfer.freezeWith(client);
    
    // Sign with all sender private keys
    let signedTx = frozenTx;
    for (const transfer of transfers) {
      signedTx = await signedTx.sign(transfer.senderKey);
    }

    // Execute the transaction
    const txTransferResponse = await signedTx.execute(client);
    const receiptTransferTx = await txTransferResponse.getReceipt(client);
    const txTransferId = txTransferResponse.transactionId.toString();

    console.log("---------------------------- Multiple Token Transfer ----------------------------");
    console.log("Number of transfers      :", transfers.length);
    console.log("Receipt status           :", receiptTransferTx.status.toString());
    console.log("Transaction ID           :", txTransferId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/transaction/" + txTransferId);

    return {
      transactionId: txTransferId,
      status: receiptTransferTx.status.toString(),
      hashscanUrl: "https://hashscan.io/testnet/transaction/" + txTransferId,
      transfersCount: transfers.length
    };
  } catch (error) {
    console.error("Error transferring multiple tokens:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

/**
 * EXAMPLE: Transfer WHISTLE tokens to another account
 */
async function exampleTransfer() {
  try {
    console.log("\n========== HTS Token Transfer Example ==========\n");

    // Example: Transfer 1000 WHISTLE tokens to another account
    // Replace with actual receiver account ID
    const receiverAccountId = "0.0.1234567"; // Replace with actual receiver account ID

    // Check sender balance before transfer
    console.log("Step 1: Checking sender balance...");
    await getWhistleTokenBalance(MY_ACCOUNT_ID);
    console.log();

    // Check receiver balance before transfer
    console.log("Step 2: Checking receiver balance...");
    await getWhistleTokenBalance(receiverAccountId);
    console.log();

    // Transfer tokens
    console.log("Step 3: Transferring 1000 WHISTLE tokens...");
    const transferAmount = 10;
    const result = await transferWhistleTokens(receiverAccountId, transferAmount);
    console.log();

    // Wait a bit for the transaction to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check balances after transfer
    console.log("Step 4: Checking sender balance after transfer...");
    await getWhistleTokenBalance(MY_ACCOUNT_ID);
    console.log();

    console.log("Step 5: Checking receiver balance after transfer...");
    await getWhistleTokenBalance(receiverAccountId);
    console.log();

    console.log("========== Transfer Complete ==========\n");
    console.log("Transfer Result:", result);

  } catch (error) {
    console.error("Error in example transfer:", error);
    console.log("\nNote: Make sure to replace the receiverAccountId with a valid account ID");
  }
}

// Export all functions
module.exports = {
  transferTokens,
  transferWhistleTokens,
  getTokenBalance,
  getWhistleTokenBalance,
  transferMultipleTokens,
  exampleTransfer,
  getClient,
  // Constants
  MY_ACCOUNT_ID,
  MY_PRIVATE_KEY,
  WHISTLE_TOKEN_ID
};

// If running directly, execute the example
if (require.main === module) {
  console.log("To use this file, import the functions or modify exampleTransfer() with a valid receiver account ID.");
  console.log("Example usage:");
  console.log("  const { transferWhistleTokens } = require('./transfer');");
  console.log("  await transferWhistleTokens('0.0.1234567', 1000);");
  console.log("\nRunning example (will fail without valid receiver account ID):\n");
  exampleTransfer().catch(console.error);
}

