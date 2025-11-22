'use client';

import { XXNetwork, XXDirectMessages, XXDirectMessagesReceived, useSDKStatus, useCredentialsStatus, XXMyCredentials } from "./xxdk";

function StatusButton({ status, label }: { status: 'initializing' | 'ready' | 'error', label: string }) {
  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'initializing':
        return 'bg-yellow-500 animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'error':
        return 'Error';
      case 'initializing':
        return 'Initializing...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
      <span className="text-sm font-medium">{label}: {getStatusText()}</span>
    </div>
  );
}


function HomeContent() {
  const sdkStatus = useSDKStatus();
  const credentialsStatus = useCredentialsStatus();

  return (
    <main className="min-h-screen w-full p-6 relative overflow-hidden">
      {/* Floating particles for animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-300 rounded-full opacity-40 floating-particle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-300 rounded-full opacity-30 floating-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-emerald-300 rounded-full opacity-40 floating-particle" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-teal-300 rounded-full opacity-30 floating-particle" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Status Buttons */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                🔵 Resolver - Message Receiver
              </h1>
              <p className="text-gray-600 text-base">
                Receive and view whistleblower reports securely via xx Network
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:min-w-[200px]">
              <StatusButton status={sdkStatus} label="SDK Status" />
              <StatusButton status={credentialsStatus} label="Credentials Status" />
            </div>
          </div>
        </div>

        {/* Credentials Card */}
        <div className="mb-8">
          <XXMyCredentials 
            title="🔵 RESOLVER - MY CREDENTIALS" 
            accentClass="border-purple-300 bg-purple-50" 
          />
        </div>

        {/* Received Messages Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              📥 Received Messages
            </h2>
            <p className="text-gray-600 text-sm">
              Messages and reports received through the xx Network
            </p>
          </div>

          <div className="max-h-[600px] overflow-y-auto border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <XXDirectMessagesReceived />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <XXNetwork>
      <XXDirectMessages>
        <HomeContent />
      </XXDirectMessages>
    </XXNetwork>
  );
}
