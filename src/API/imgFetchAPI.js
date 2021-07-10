import { imgFetchOptions } from './imgFetchOptions';



export default function fetchImages() {                      // query was hardcoded due to strict technical task demands.
    const { BASE_URL, API_KEY } = imgFetchOptions;
    const requestURL = `${BASE_URL}?key=${API_KEY}&q=cats&image_type=all&per_page=100`;
    return fetch(requestURL).then(responce => responce.json());
}