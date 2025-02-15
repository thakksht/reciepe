import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onKeySet: (key: string) => void;
}

export const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("spoonacular_api_key");

    if (savedKey) {
      setApiKey(savedKey);

      onKeySet(savedKey);
    }
  }, [onKeySet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (apiKey.trim()) {
      localStorage.setItem("spoonacular_api_key", apiKey.trim());

      onKeySet(apiKey.trim());

      toast({
        title: "API Key Saved",

        description: "Your Spoonacular API key has been saved successfully.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white rounded-lg shadow-sm animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome to Recipe Search
        </h2>

        <p className="text-sm text-muted-foreground">
          Please enter your Spoonacular API key to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Save API Key
        </Button>
      </form>

      <div className="text-center">
        <a
          href="https://spoonacular.com/food-api/console#Profile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Get your API key here
        </a>
      </div>
    </div>
  );
};
