import { imagePlaceholderURL } from "../service/api";
import Button from "./Button";

export function GameCardContainer({ children }) {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-4 grid-cols-1">
      {children}
    </div>
  );
}
export function GameCard({ game, favoriteToggle, isFavorite, onClick = null }) {
  return (
    <div
      className="bg-gray-100 rounded-2xl cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={game.image ?? imagePlaceholderURL(game.name)}
          className="max-h-full max-w-full object-cover aspect-[2/1]"
        />
      </div>
      <div className="m-5 p-2 bg-gray-200 rounded-2xl">
        <h2 className="text-xl font-bold">{game.name}</h2>
        <p>
          {game.year} - {game.genre}
        </p>
        <div className="flex justify-between items-center">
          <p>
            {Math.round(game.rating?.mean * 100)}%{" "}
            <i className="fa fa-star text-yellow-500" aria-hidden="true"></i>
          </p>
          <Button
            color={isFavorite ? "orange" : "red"}
            onClick={(e) => {
              e.stopPropagation();
              favoriteToggle?.(game);
            }}
          >
            {isFavorite ? (
              <i className="fas fa-heart-broken"></i>
            ) : (
              <i className="fa fa-heart"></i>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
