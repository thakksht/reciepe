import { Heart } from "lucide-react";

import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Recipe {
  id: number;

  title: string;

  image: string;

  readyInMinutes: number;

  servings: number;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    setIsFavorite(favorites.some((fav: Recipe) => fav.id === recipe.id));
  }, [recipe.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav: Recipe) => fav.id !== recipe.id);
    } else {
      newFavorites = [...favorites, recipe];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${
              isFavorite ? "text-accent" : "text-white"
            }`}
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-6 w-6 transition-all ${
                isFavorite ? "fill-current animate-heart-beat" : ""
              }`}
            />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg leading-tight">
            {recipe.title}
          </h3>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{recipe.readyInMinutes} mins</span>

            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
