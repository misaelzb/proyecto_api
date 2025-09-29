import { imagePlaceholderURL } from "../service/api";
import Button from "./Button"

export function FavoriteGameCardContainer({ children }) {
    return <div className="grid grid-rows-1 gap-4">
        {children}
    </div>
}
export function FavoriteGameCard({ game, favoriteToggle, onClick = null }) {
    return <div className="bg-gray-200 cursor-pointer hover:shadow-xl transition-shadow p-2 rounded-2xl flex flex-col gap-2 text-center" onClick={onClick}>
            <img className="object-cover h-20 rounded-2xl" src={game.image ?? imagePlaceholderURL(game.name)}/> 
            <div className="flex items-center justify-center"><p>{game.name}</p></div>

        <Button onClick={(e) => {
            e.stopPropagation();
            favoriteToggle(game)
        }}><i className="fa fa-heart-broken"></i></Button>
    </div>
}