import axios from "axios"
export const ApiKey = import.meta.env.VITE_GAMES_API_KEY;
export const ApiURL = "https://api.gamebrain.co/v1";
export const ApiFetchConfig = {
    headers: {
        "X-Api-Key": ApiKey
    }
}
export async function fetchManyGames({
    query = "",
    limit = 10,
    filters = [],
    sort = "",
} = {}) {
    query = query.trim()
    let queryParams = "?" + new URLSearchParams({
        query,
        limit,
        filters: JSON.stringify(filters),
        sort
    }).toString()

    let response = await axios.get(`${ApiURL}/games${queryParams}`, ApiFetchConfig)
    return response.data.results?.length == 0 ? null : response.data.results
}

export async function fetchGameDetail(id) {
    let response = await axios.get(`${ApiURL}/games/${id}`, ApiFetchConfig).catch(e => null)
    return response.data
}

export function imagePlaceholderURL(text, size="600x400") {
    return `https://placeholdit.com/${size}/dddddd/999999?text=${encodeURIComponent(text)}`
}