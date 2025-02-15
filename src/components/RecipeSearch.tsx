import { useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";

interface RecipeSearchProps {
  onSearch: (query: string, diet: string) => void;

  isLoading: boolean;
}

export const RecipeSearch = ({ onSearch, isLoading }: RecipeSearchProps) => {
  const [query, setQuery] = useState("");

  const [diet, setDiet] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    onSearch(query, diet);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search recipes by ingredients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={diet} onValueChange={setDiet}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Diet" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="">Any</SelectItem>

            <SelectItem value="vegetarian">Vegetarian</SelectItem>

            <SelectItem value="vegan">Vegan</SelectItem>

            <SelectItem value="gluten-free">Gluten Free</SelectItem>

            <SelectItem value="ketogenic">Keto</SelectItem>

            <SelectItem value="paleo">Paleo</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};
