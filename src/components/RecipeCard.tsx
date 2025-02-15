import { Heart, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  instructions?: string;
  extendedIngredients?: {
    original: string;
    id: number;
  }[];
  summary?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState<Recipe | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: Recipe) => fav.id === recipe.id));
    
    // Load saved note
    const notes = JSON.parse(localStorage.getItem("recipe_notes") || "{}");
    setNote(notes[recipe.id] || "");
  }, [recipe.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((fav: Recipe) => fav.id !== recipe.id);
      toast({
        title: "Removed from favorites",
        description: "Recipe has been removed from your favorites",
      });
    } else {
      newFavorites = [...favorites, recipe];
      toast({
        title: "Added to favorites",
        description: "Recipe has been added to your favorites",
      });
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const saveNote = () => {
    const notes = JSON.parse(localStorage.getItem("recipe_notes") || "{}");
    notes[recipe.id] = note;
    localStorage.setItem("recipe_notes", JSON.stringify(notes));
    toast({
      title: "Note saved",
      description: "Your note has been saved for this recipe",
    });
  };

  const fetchRecipeDetails = async () => {
    try {
      const apiKey = localStorage.getItem("spoonacular_api_key");
      if (!apiKey) return;

      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch recipe details");
      
      const data = await response.json();
      setDetailedRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const handleCardClick = async () => {
    setIsOpen(true);
    if (!detailedRecipe) {
      await fetchRecipeDetails();
    }
  };

  return (
    <>
      <Card 
        className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-102 bg-gradient-to-br from-white to-secondary/80 backdrop-blur-sm"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 transition-all duration-300 ${
                isFavorite ? "text-accent scale-110" : "text-white scale-100"
              }`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-6 w-6 transition-all duration-300 ${
                  isFavorite ? "fill-current animate-heart-beat" : ""
                }`}
              />
            </Button>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors duration-300">
              {recipe.title}
            </h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{recipe.readyInMinutes} mins</span>
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-primary">
              {recipe.title}
            </SheetTitle>
          </SheetHeader>
          
          {detailedRecipe ? (
            <div className="mt-6 space-y-6 animate-fade-in">
              <img
                src={detailedRecipe.image}
                alt={detailedRecipe.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              
              <div className="space-y-6">
                <div className="flex justify-between text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                  <span>Cooking Time: {detailedRecipe.readyInMinutes} minutes</span>
                  <span>Servings: {detailedRecipe.servings}</span>
                </div>

                <div className="space-y-3 bg-white/50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-primary" />
                    Personal Notes
                  </h3>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add your personal notes about this recipe..."
                    className="min-h-[100px] bg-white/80"
                  />
                  <Button 
                    onClick={saveNote}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Save Note
                  </Button>
                </div>

                {detailedRecipe.summary && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Summary</h3>
                    <div 
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: detailedRecipe.summary }}
                    />
                  </div>
                )}

                {detailedRecipe.extendedIngredients && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Ingredients</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {detailedRecipe.extendedIngredients.map((ingredient) => (
                        <li key={ingredient.id} className="text-muted-foreground">
                          {ingredient.original}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailedRecipe.instructions && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Instructions</h3>
                    <div 
                      className="text-muted-foreground space-y-4 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: detailedRecipe.instructions }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg" />
                <div className="space-y-4 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};