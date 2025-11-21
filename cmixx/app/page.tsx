import { XXNetwork, XXDirectMessages, XXDirectMessagesReceived, XXMsgSender, XXMyCredentials } from "./xxdk";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-6">
      <XXNetwork>
        <XXDirectMessages>
          <div className="flex w-full max-w-4xl flex-col gap-4">
            <XXMyCredentials />
            <section className="flex max-h-96 flex-col overflow-y-auto rounded border border-gray-300 bg-white p-4">
              <p className="mb-2 text-center font-semibold">📥 Received Messages</p>
              <div className="flex-grow space-y-2">
                <XXDirectMessagesReceived />
              </div>
              <div id="anchor2" className="h-1 [overflow-anchor:auto]" />
            </section>
            <section className="rounded border border-gray-300 bg-white">
              <XXMsgSender
                recipientLabel="Client 2"
                recipientTokenLabel="Recipient's Token (Client 2)"
                recipientPubKeyLabel="Recipient's Public Key (Client 2)"
              />
            </section>
          </div>
        </XXDirectMessages>
      </XXNetwork>
    </main>
  );
}
