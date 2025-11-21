'use client';

import { XXNetwork, XXDirectMessages, useSDKStatus, useCredentialsStatus } from "./xxdk";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useState, ChangeEvent } from "react";

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

function WhistleblowerForm() {
  const [formData, setFormData] = useState({
    issueType: '',
    category: '',
    severity: '',
    location: '',
    organization: '',
    description: '',
    evidence: '',
    contactPreference: '',
    anonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate submission
    setTimeout(() => {
      console.log('Whistleblower Report Submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          issueType: '',
          category: '',
          severity: '',
          location: '',
          organization: '',
          description: '',
          evidence: '',
          contactPreference: '',
          anonymous: false,
        });
        setSubmitStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🌱 Sustainability Whistleblower Portal
          </h2>
          <p className="text-gray-600">
            Report environmental violations, sustainability issues, or unethical practices anonymously and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Issue Type"
            placeholder="Select the type of issue"
            selectedKeys={formData.issueType ? [formData.issueType] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange('issueType', value);
            }}
            isRequired
          >
            <SelectItem key="pollution" value="pollution">Environmental Pollution</SelectItem>
            <SelectItem key="waste" value="waste">Waste Management Violations</SelectItem>
            <SelectItem key="emissions" value="emissions">Carbon Emissions Violations</SelectItem>
            <SelectItem key="deforestation" value="deforestation">Deforestation/Illegal Logging</SelectItem>
            <SelectItem key="water" value="water">Water Contamination</SelectItem>
            <SelectItem key="wildlife" value="wildlife">Wildlife Protection Violations</SelectItem>
            <SelectItem key="greenwashing" value="greenwashing">Greenwashing/Fraud</SelectItem>
            <SelectItem key="other" value="other">Other Sustainability Issue</SelectItem>
          </Select>

          <Select
            label="Category"
            placeholder="Select category"
            selectedKeys={formData.category ? [formData.category] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange('category', value);
            }}
            isRequired
          >
            <SelectItem key="corporate" value="corporate">Corporate</SelectItem>
            <SelectItem key="government" value="government">Government</SelectItem>
            <SelectItem key="ngo" value="ngo">NGO/Non-Profit</SelectItem>
            <SelectItem key="individual" value="individual">Individual</SelectItem>
            <SelectItem key="international" value="international">International Organization</SelectItem>
          </Select>

          <Select
            label="Severity Level"
            placeholder="How severe is this issue?"
            selectedKeys={formData.severity ? [formData.severity] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange('severity', value);
            }}
            isRequired
          >
            <SelectItem key="low" value="low">Low - Minor violation</SelectItem>
            <SelectItem key="medium" value="medium">Medium - Moderate concern</SelectItem>
            <SelectItem key="high" value="high">High - Serious violation</SelectItem>
            <SelectItem key="critical" value="critical">Critical - Immediate threat</SelectItem>
          </Select>

          <Input
            label="Location"
            placeholder="City, Country or Region"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            isRequired
            labelPlacement="outside"
          />

          <Input
            label="Organization/Entity Name"
            placeholder="Name of the organization involved"
            value={formData.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            isRequired
            labelPlacement="outside"
          />

          <Select
            label="Contact Preference"
            placeholder="How should we contact you?"
            selectedKeys={formData.contactPreference ? [formData.contactPreference] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange('contactPreference', value);
            }}
          >
            <SelectItem key="anonymous" value="anonymous">Remain Anonymous</SelectItem>
            <SelectItem key="email" value="email">Email</SelectItem>
            <SelectItem key="secure" value="secure">Secure Channel (via this platform)</SelectItem>
          </Select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
            placeholder="Provide a detailed description of the issue, including dates, times, and any relevant context..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence/Supporting Information
          </label>
          <textarea
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
            placeholder="Links to documents, photos, videos, or any other evidence (if available)..."
            value={formData.evidence}
            onChange={(e) => handleChange('evidence', e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.anonymous}
            onChange={(e) => handleChange('anonymous', e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            I want to remain completely anonymous
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="flat"
            onPress={() => {
              setFormData({
                issueType: '',
                category: '',
                severity: '',
                location: '',
                organization: '',
                description: '',
                evidence: '',
                contactPreference: '',
                anonymous: false,
              });
            }}
          >
            Clear Form
          </Button>
          <Button
            type="submit"
            color="success"
            isLoading={isSubmitting}
            isDisabled={!formData.issueType || !formData.category || !formData.severity || !formData.location || !formData.organization || !formData.description}
          >
            {submitStatus === 'success' ? 'Submitted ✓' : 'Submit Report'}
          </Button>
        </div>

        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Your report has been submitted securely. Thank you for helping protect our planet!
            </p>
          </div>
        )}
      </div>
    </form>
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
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🌍 Sustainability Whistleblower Platform
              </h1>
              <p className="text-gray-600">
                Secure, anonymous reporting for environmental protection
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <StatusButton status={sdkStatus} label="SDK Status" />
              <StatusButton status={credentialsStatus} label="Credentials Status" />
            </div>
          </div>
        </div>

        {/* Whistleblower Form */}
        <WhistleblowerForm />
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
