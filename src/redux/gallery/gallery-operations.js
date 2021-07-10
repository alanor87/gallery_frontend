import axios from 'axios';
import { imgFetchOptions } from '../../API/imgFetchOptions'
import { fetchImagesSuccess, fetchImagesError } from './gallery-actions';

const { BASE_URL, API_KEY } = imgFetchOptions;

export const fetchImages = () => dispatch => {
    axios.get(`${BASE_URL}?key=${API_KEY}&q=cats&image_type=all&per_page=100`)
        .then(response => response.data.hits)
        .then(data => dispatch(fetchImagesSuccess(data)))
        .catch(error => dispatch(fetchImagesError(error)))
}


