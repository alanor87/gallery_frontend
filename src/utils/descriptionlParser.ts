import { ImageDescriptionType } from "types/images";

/** Function that parses description text to HTML,
 * using the anchors information, turning the anchored parts
 *  of text to spans for interaction and stylization purposes.
 */
const descriptionParser = (imageDescription: ImageDescriptionType) => {
    console.log(imageDescription)
  if (!imageDescription.anchors?.length) return imageDescription.text;

  // Sorting anchors by their starting position in the description text.
  const sortedAnchorsArray = [...imageDescription.anchors].sort((anchor1, anchor2) => { return anchor1.anchorTextStartPos - anchor2.anchorTextStartPos})

  const descriptionStart = imageDescription.text.slice(
    0,
    sortedAnchorsArray[0].anchorTextStartPos
  );

  console.log('descriptionStart : ', descriptionStart)

  const choppedDescriptionTextArray = sortedAnchorsArray.map(
    (anchor, index) => {
      let stringStartFromAnchor;
      if (index === sortedAnchorsArray.length - 1) {
        stringStartFromAnchor = imageDescription.text.slice(
          anchor.anchorTextStartPos
        );
      } else {
        stringStartFromAnchor = imageDescription.text.slice(
            anchor.anchorTextStartPos, imageDescription.anchors[index + 1].anchorTextStartPos
          );
      }

      const stringWithTagedAnchor = stringStartFromAnchor.replace(
        anchor.anchorText,
        `<mark>${anchor.anchorText}</mark>`
      );
      return stringWithTagedAnchor;
    }
  );

  console.log('choppedDescriptionTextArray : ', choppedDescriptionTextArray)
  const parsedDescription = descriptionStart + choppedDescriptionTextArray.join("");

  return parsedDescription;
};

export { descriptionParser };
