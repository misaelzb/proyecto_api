import { useEffect, useState } from "react";
import {
  fetchGameDetail,
  fetchManyGames,
  imagePlaceholderURL,
} from "./service/api";
import { toast } from "react-toastify";
import { GameCard, GameCardContainer } from "./components/GameCard";
import Button from "./components/Button";
import { Loader } from "./components/Loader";
import {
  FavoriteGameCard,
  FavoriteGameCardContainer,
} from "./components/FavoriteGameCard";
import { Player } from "video-react";

function capitalize(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function App() {
  const [games, setGames] = useState([]);
  const [platform, setPlatform] = useState(null);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [focusedGame, setFocusedGame] = useState({ brief: null, detail: null });

  const CachedMainPageKey = "cached_main_page";
  const CachedFavoritesKey = "cached_favorite_list";
  const CachedGameDetailKey = "cached_game_detail-";

  useEffect(() => {
    doMainLoading();
  }, []);
  function doMainLoading() {
    /**
     *
     * Cargado de la página principal
     * Usando almacenamiento del navegador para evitar peticiones innecesarias
     */
    let cache = window.localStorage.getItem(CachedMainPageKey);
    if (cache) {
      console.log("Página principal desde almacenamiento");
      setGames(JSON.parse(cache));
    } else {
      fetchManyGames().then((games) => {
        window.localStorage.setItem(CachedMainPageKey, JSON.stringify(games));
        setGames(games);
      });
    }
    let favorites = window.localStorage.getItem(CachedFavoritesKey);
    if (favorites) {
      setFavorites(JSON.parse(favorites));
    }
  }
  function favoriteToggle(game) {
    // game.id
    if (favorites.find((x) => x.id == game.id)) {
      // Remover de la lista
      let nuevosFavoritos = favorites.filter((x) => x.id != game.id);
      setFavorites(nuevosFavoritos);
      window.localStorage.setItem(
        CachedFavoritesKey,
        JSON.stringify(nuevosFavoritos)
      );
      toast.warning(`"${game.name}" eliminado de favoritos`);
    } else {
      let nl = [...favorites, game];
      setFavorites(nl);
      window.localStorage.setItem(CachedFavoritesKey, JSON.stringify(nl));
      toast.success(`"${game.name}" agregado a favoritos`);
    }
    console.log(favorites);
  }

  function handleMainSearch() {
    let filters = [];
    if (platform == null && query.trim() == "") return;
    if (platform !== null) {
      filters.push({
        key: "platform",
        values: [
          {
            value: platform,
          },
        ],
      });
    }
    setGames([]);
    fetchManyGames({
      query,
      filters,
    }).then((games) => {
      console.log(games);
      setGames(games);
    });
  }

  function handleGameDetailModal(game) {
    setFocusedGame({ brief: game, detail: null });
    setShowModal(true);
    let cache = window.localStorage.getItem(CachedGameDetailKey + game.id);
    if (cache) {
      setFocusedGame({ brief: game, detail: JSON.parse(cache) });
    } else {
      fetchGameDetail(game.id).then((detail) => {
        window.localStorage.setItem(
          CachedGameDetailKey + game.id,
          JSON.stringify(detail)
        );
        setFocusedGame({ brief: game, detail: detail });
      });
    }
  }
  return (
    <>
      <div className="p-5 rounded-2xl bg-gray-100 mb-5">
        <h1 className="text-2xl font-bold">Buscador de juegos</h1>
        <p>Encuentra un juego que te interese</p>
        <br />
        <div className="grid md:grid-cols-2 gap-5 md:max-w-2/4 sm:grid-cols-1 sm:max-w-full">
          <select
            className="bg-gray-200 p-3 rounded-2xl"
            name="plataforma"
            defaultValue={"none"}
            value={platform || "none"}
            onChange={(e) =>
              setPlatform(e.target.value == "none" ? null : e.target.value)
            }
          >
            <option value="none">Plataforma:</option>
            <option value="pc">PC</option>
            <option value="playstation">Playstation</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="bg-gray-200 p-3 rounded-2xl"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
        <div className="flex mt-5 gap-2">
          <Button onClick={() => handleMainSearch()}>
            <i className="fa fa-search"></i> Realizar búsqueda
          </Button>
          <Button
            color="red"
            onClick={() => {
              setPlatform(null);
              setQuery("");
              doMainLoading();
            }}
          >
            <i class="fa-solid fa-circle-exclamation"></i> Restablecer filtros
          </Button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg w-4xl relative p-6 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="closeModal"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-3xl font-semibold mb-4">
              {focusedGame.brief.name}
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <img
                src={
                  focusedGame.brief.image ??
                  imagePlaceholderURL(focusedGame.brief.name)
                }
                className="rounded-2xl w-md"
              />
              {focusedGame.detail ? (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">
                      <i className="fa fa-info-circle"></i> Enlaces:
                    </h3>
                    <Button
                      color="green"
                      href={focusedGame.detail.link}
                      target="_blank"
                    >
                      <i className="fa fa-link"></i> Ver en GameBrain
                    </Button>
                    {focusedGame.detail.x_url && (
                      <Button
                        color="black"
                        href={focusedGame.detail.x_url}
                        target="_blank"
                        className="text-white"
                      >
                        <i className="fa-brands fa-x-twitter"></i> X
                      </Button>
                    )}
                    {focusedGame.detail.official_stores
                      ? [
                          ...new Map(
                            focusedGame.detail.official_stores.map((item) => [
                              item.source,
                              item,
                            ])
                          ).values(),
                        ].map((store) => {
                          return (
                            <Button
                              color={"gray"}
                              href={store.url}
                              target="_blank"
                            >
                              <i className="fa fa-link"></i>{" "}
                              {capitalize(store.source)}
                            </Button>
                          );
                        })
                      : null}
                  </div>
                </>
              ) : null}
            </div>

            {focusedGame.detail ? (
              <>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">
                    <i className="fa fa-info-circle"></i> Descripción
                  </h3>
                  <p className="bg-gray-200 p-7 rounded-2xl">
                    {focusedGame.detail.description.length >
                    focusedGame.detail.short_description
                      ? focusedGame.detail.description
                      : focusedGame.detail.short_description}
                  </p>
                  {focusedGame.detail.micro_trailer ? (
                    <Player
                      autoPlay={true}
                      muted={true}
                      playsInline
                      poster={focusedGame.detail.screenshots[0] ?? null}
                      src={focusedGame.detail.micro_trailer}
                    />
                  ) : (
                    <img src={focusedGame.detail.screenshots[0]} />
                  )}
                </div>
              </>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      )}

      <div className="flex gap-9">
        <div className="mb-6 gap-2 flex flex-col flex-1/6 min-w-40 max-w-40">
          <h1 className="text-xl font-bold">
            <i className="fa fa-heart"></i> Favoritos
          </h1>
          <hr />
          {favorites.length > 0 ? (
            <FavoriteGameCardContainer>
              {favorites.map((game) => (
                <FavoriteGameCard
                  game={game}
                  favoriteToggle={favoriteToggle}
                  onClick={() => handleGameDetailModal(game)}
                />
              ))}
            </FavoriteGameCardContainer>
          ) : (
            <>
              <p>¡Agrega juegos a tu lista de favoritos!</p>
            </>
          )}
        </div>

        <div className="mb-6 gap-2 flex flex-col">
          <h1 className="text-xl font-bold">
            <i className="fa fa-gamepad"></i> Juegos encontrados
          </h1>
          <hr />
          <GameCardContainer>
            {games == null ? (
              <p>No se encontraron resultados...</p>
            ) : games.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={`${game.id}-sh`}
                  game={game}
                  favoriteToggle={favoriteToggle}
                  isFavorite={
                    favorites.find((x) => x.id == game.id) ? true : false
                  }
                  onClick={() => handleGameDetailModal(game)}
                />
              ))
            ) : (
              <Loader />
            )}
          </GameCardContainer>
        </div>
      </div>
    </>
  );
}

export default App;
