import {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

// Hedera Configuration
const MY_ACCOUNT_ID = AccountId.fromString("0.0.5161124");
const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("0x65daa5b4616b0af96bea690f5c4afc0337a002bc7f5c3f2e28e575b9a253d31e");

/**
 * Initialize and return a Hedera client for testnet
 */
export function getHederaClient(): Client {
  const client = Client.forTestnet();
  client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
  return client;
}

/**
 * Create a new HCS topic on the Hedera network
 * @returns Promise with topicId, transactionId, status, and hashscanUrl
 */
export async function createTopic(): Promise<{
  topicId: string;
  transactionId: string;
  status: string;
  hashscanUrl: string;
}> {
  let client;
  try {
    client = getHederaClient();

    // Create the transaction
    const txCreateTopic = new TopicCreateTransaction();

    // Sign with the client operator private key and submit the transaction to a Hedera network
    const txCreateTopicResponse = await txCreateTopic.execute(client);

    // Request the receipt of the transaction
    const receiptCreateTopicTx = await txCreateTopicResponse.getReceipt(client);

    // Get the transaction consensus status
    const statusCreateTopicTx = receiptCreateTopicTx.status;

    // Get the Transaction ID
    const txCreateTopicId = txCreateTopicResponse.transactionId.toString();

    // Get the topic ID
    const topicId = receiptCreateTopicTx.topicId?.toString() || '';

    console.log("------------------------------ Create Topic ------------------------------ ");
    console.log("Receipt status           :", statusCreateTopicTx.toString());
    console.log("Transaction ID           :", txCreateTopicId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/transaction/" + txCreateTopicId);
    console.log("Topic ID                 :", topicId);

    return {
      topicId,
      transactionId: txCreateTopicId,
      status: statusCreateTopicTx.toString(),
      hashscanUrl: "https://hashscan.io/testnet/transaction/" + txCreateTopicId
    };
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

/**
 * Submit a message to a Hedera topic
 * @param topicId - The topic ID to submit the message to
 * @param message - The message content to submit
 * @returns Promise with transactionId, status, message, hashscanUrl, and consensusTimestamp
 */
export async function submitMessageToTopic(
  topicId: string,
  message: string
): Promise<{
  transactionId: string;
  status: string;
  message: string;
  hashscanUrl: string;
  consensusTimestamp: any;
}> {
  let client;
  try {
    client = getHederaClient();

    // Create the transaction
    const txTopicMessageSubmit = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message);

    // Sign with the client operator private key and submit to a Hedera network
    const txTopicMessageSubmitResponse = await txTopicMessageSubmit.execute(client);

    // Request the receipt of the transaction
    const receiptTopicMessageSubmitTx = await txTopicMessageSubmitResponse.getReceipt(client);

    // Get the transaction consensus status
    const statusTopicMessageSubmitTx = receiptTopicMessageSubmitTx.status;

    // Get the transaction message
    const getTopicMessage = txTopicMessageSubmit.getMessage();

    // Get the transaction ID
    const txTopicMessageSubmitId = txTopicMessageSubmitResponse.transactionId.toString();

    console.log("-------------------------------- Submit Message -------------------------------- ");
    console.log("Receipt status           :", statusTopicMessageSubmitTx.toString());
    console.log("Transaction ID           :", txTopicMessageSubmitId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/transaction/" + txTopicMessageSubmitId);
    console.log("Topic Message            : " + getTopicMessage.toString());

    const result = {
      transactionId: txTopicMessageSubmitId,
      status: statusTopicMessageSubmitTx.toString(),
      message: getTopicMessage.toString(),
      hashscanUrl: "https://hashscan.io/testnet/transaction/" + txTopicMessageSubmitId,
      consensusTimestamp: receiptTopicMessageSubmitTx.consensusTimestamp
    };

    // Close client before returning
    client.close();

    return result;
  } catch (error) {
    console.error("Error submitting message:", error);
    if (client) client.close();
    throw error;
  }
}

