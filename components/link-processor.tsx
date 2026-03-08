"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, AlertCircle, Link as LinkIcon } from "lucide-react";

const CONTRIBUTOR_ID = "298069";

export default function LinkProcessor() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [useCustomId, setUseCustomId] = useState(false);
  const [customId, setCustomId] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("ambassadorName");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    if (name.trim()) {
      localStorage.setItem("ambassadorName", name);
    }
  }, [name]);

  const processUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setProcessedUrl("");

    if (!url.trim() || !name.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (useCustomId && !customId.trim()) {
      setError("Please enter your custom sharing ID");
      return;
    }

    if (!url.includes("microsoft.com")) {
      setError("Please enter a valid Microsoft URL");
      return;
    }

    try {
      setLoading(true);

      const processedInputUrl = url.trim();

      let urlPart = processedInputUrl;
      let queryPart = "";

      if (processedInputUrl.includes("?")) {
        const parts = processedInputUrl.split("?");
        urlPart = parts[0];
        queryPart = parts.slice(1).join("?");
      }

      if (!urlPart.startsWith("http://") && !urlPart.startsWith("https://")) {
        urlPart = "https://" + urlPart;
      }

      const urlObj = new URL(urlPart);

      let pathname = urlObj.pathname;
      pathname = pathname.replace(/^\/[a-z]{2}-[a-z]{2}\//, "/");
      pathname = pathname.replace(/^\/[a-z]{2}\//, "/");
      pathname = pathname.replace(/\/$/, "");

      urlObj.pathname = pathname;

      const params = new URLSearchParams(queryPart);
      params.delete("wt.mc_id");
      params.delete("WT.mc_id");

      let sharingId = `studentamb_${CONTRIBUTOR_ID}`;
      if (useCustomId) {
        const trimmedCustomId = customId.trim();
        // Check if user entered full parameter format
        const idMatch = trimmedCustomId.match(/(?:\?|&)?wt\.mc_id=(.+)/i);
        sharingId = idMatch ? idMatch[1] : trimmedCustomId;
      }

      const baseUrl = `${urlObj.protocol}//${urlObj.host}${pathname}`;
      const paramString = params.toString();
      const finalUrl = paramString
        ? `${baseUrl}?${paramString}&wt.mc_id=${sharingId}`
        : `${baseUrl}?wt.mc_id=${sharingId}`;

      setProcessedUrl(finalUrl);
      setSuccess(true);
      setCopied(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <Card className="w-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-full neo-inset mx-auto mb-6">
        <LinkIcon className="text-primary size-8" />
      </div>
      <form onSubmit={processUrl} className="space-y-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground px-1">
            Your Name
          </label>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground px-1">
            Microsoft URL
          </label>
          <Input
            type="url"
            placeholder="https://learn.microsoft.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 p-5 neo-inset rounded-[1.25rem]">
          <input
            type="checkbox"
            id="customIdToggle"
            checked={useCustomId}
            onChange={(e) => setUseCustomId(e.target.checked)}
            className="w-5 h-5 rounded shadow-inner text-primary focus:ring-primary cursor-pointer accent-primary"
          />
          <label
            htmlFor="customIdToggle"
            className="text-sm font-bold text-foreground cursor-pointer select-none"
          >
            Not a member of MSC-ECU
          </label>
        </div>

        {useCustomId && (
          <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <label className="block text-sm font-semibold text-foreground px-1">
              Custom Sharing ID
            </label>
            <Input
              type="text"
              placeholder="e.g., studentamb_123456"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground font-medium px-2">
              Enter your full sharing parameter
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 neo-inset rounded-xl text-destructive font-semibold">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? "Processing..." : "Generate Magic Link"}
        </Button>
      </form>

      {processedUrl && (
        <div className="mt-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-3 px-1">
                Your Processed Link
              </p>
              <div className="p-5 neo-inset rounded-[1.25rem] break-all text-sm text-foreground font-mono leading-relaxed selection:bg-primary selection:text-white">
                {processedUrl}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-green-500" />
                  <span className="text-green-500">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={20} className="text-primary" />
                  Copy Link
                </>
              )}
            </Button>

            {success && (
              <p className="text-sm text-green-500 font-bold text-center mt-4">
                ✓ Link magically generated and ready to share!
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
