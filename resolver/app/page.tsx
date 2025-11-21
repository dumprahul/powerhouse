
import { XXNetwork, XXDirectMessages, XXDirectMessagesReceived, XXMsgSender, XXMyCredentials } from "./xxdk";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-slate-900 p-6">
      <XXNetwork>
        <XXDirectMessages>
          <div className="flex w-full max-w-4xl flex-col gap-4">
            <XXMyCredentials title="🔵 CLIENT 2 - MY CREDENTIALS" accentClass="border-purple-300 bg-purple-50" />
            <section className="flex max-h-96 flex-col overflow-y-auto rounded border border-slate-200 bg-white p-4">
              <p className="mb-2 text-center font-semibold text-slate-900">📥 Received Messages</p>
              <div className="flex-grow space-y-2 text-slate-900">
                <XXDirectMessagesReceived />
              </div>
              <div id="anchor2" className="h-1 [overflow-anchor:auto]" />
            </section>
            <section className="rounded border border-purple-200 bg-white">
              <XXMsgSender
                recipientLabel="Client 1"
                recipientTokenLabel="Recipient's Token (Client 1)"
                recipientPubKeyLabel="Recipient's Public Key (Client 1)"
                buttonText="Send Message to Client 1"
              />
            </section>
          </div>
        </XXDirectMessages>
      </XXNetwork>
    </main>
  );
}
