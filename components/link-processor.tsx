"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, AlertCircle } from "lucide-react";

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
    <Card className="p-6 md:p-8 bg-card border-border shadow-lg">
      <form onSubmit={processUrl} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name
          </label>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Microsoft URL
          </label>
          <Input
            type="url"
            placeholder="https://learn.microsoft.com/en-us/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-md border border-border">
          <input
            type="checkbox"
            id="customIdToggle"
            checked={useCustomId}
            onChange={(e) => setUseCustomId(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="customIdToggle"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Not a member of MSC-ECU
          </label>
        </div>

        {useCustomId && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Custom Sharing ID
            </label>
            <Input
              type="text"
              placeholder="e.g., ?wt.mc_id=studentamb_123456"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your full sharing parameter (e.g.,
              ?wt.mc_id=studentamb_123456)
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition-colors"
        >
          {loading ? "Processing..." : "Generate Link"}
        </Button>
      </form>

      {processedUrl && (
        <div className="mt-8 pt-8 border-t border-border">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Your Processed Link
              </p>
              <div className="p-4 bg-muted rounded-md border border-border break-all text-sm text-foreground font-mono">
                {processedUrl}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            {success && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Link saved and ready to share!
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
