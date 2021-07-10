
export const getImgArray = state => state.images;

export const sortAndFilterImages = state => {
    const { sortMethod, filter, images } = state;
    if (!images.length) return state.images;
    const filteredImages = images.filter(image => image.tags.includes(filter));
    const sortedImages = [...filteredImages];
    switch (sortMethod) {
        case 'mostLiked':
            return sortedImages.sort((currImage, nextImage) => Number(nextImage.likes) - Number(currImage.likes));
        case 'mostCommented':
            return sortedImages.sort((currImage, nextImage) => Number(nextImage.comments) - Number(currImage.comments));
        case 'leastLiked':
            return sortedImages.sort((currImage, nextImage) => Number(currImage.likes) - Number(nextImage.likes));
        case 'leastCommented':
            return sortedImages.sort((currImage, nextImage) => Number(currImage.comments) - Number(nextImage.comments));
        default: return sortedImages;
    }
}
