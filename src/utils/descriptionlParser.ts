import { ImageDescriptionType } from "types/images";

/** Function that parses description text to HTML,
 * using the anchors information, turning the anchored parts
 *  of text to <mark> tags for interaction and stylization purposes.
 */
const descriptionParser = (imageDescription: ImageDescriptionType) => {
  if (!imageDescription.anchors?.length) return imageDescription.text;

  // Sorting anchors by their starting position in the description text.
  const sortedAnchorsArray = [...imageDescription.anchors].sort(
    (anchor1, anchor2) => {
      return anchor1.anchorTextStartPos - anchor2.anchorTextStartPos;
    }
  );

  // Getting part of description that preceeds the first anchor.
  const descriptionStart = imageDescription.text.slice(
    0,
    sortedAnchorsArray[0].anchorTextStartPos
  );

  // Creating and array of strings, each one of which starts with the anchor inside <mark> tag,
  // and ends right before start of the next anchor.
  const choppedDescriptionTextArray = sortedAnchorsArray.map(
    (anchor, index) => {
      let stringStartFromAnchor;
      if (index === sortedAnchorsArray.length - 1) {
        // If this is the last anchor - grabbing string to the end of description.
        stringStartFromAnchor = imageDescription.text.slice(
          anchor.anchorTextStartPos
        );
      } else {
        // Grabbing string from anchor start to the next anchor start.
        stringStartFromAnchor = imageDescription.text.slice(
          anchor.anchorTextStartPos,
          sortedAnchorsArray[index + 1].anchorTextStartPos
        );
      }
      // Replacing the anchorText with itself, braced in <mark> tag. The .replace() method
      // replaces only the first occurence - so there is no risk in case of duplicate occurences.
      const stringWithTagedAnchor = stringStartFromAnchor.replace(
        anchor.anchorText,
        `<mark>${anchor.anchorText}</mark>`
      );
      return stringWithTagedAnchor;
    }
  );

  // Concatenating beginning of the description with the modified anchored string parts.
  const parsedDescription =
    descriptionStart + choppedDescriptionTextArray.join("");

  return parsedDescription;
};

export { descriptionParser };
