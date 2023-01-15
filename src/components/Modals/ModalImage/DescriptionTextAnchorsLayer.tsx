import { DescriptionAnchorType, ImageDescriptionType } from "MST/imagesStoreSettings";
import React, { useState } from "react";

import styles from "./ModalImage.module.scss";

type AnchorProps = {
  anchor: DescriptionAnchorType;
  isMarked: boolean;
  onClickHandler: (e: React.MouseEvent) => void;
};

type DescriptionProps = {
  imageDescription: ImageDescriptionType;
  showAnchorImgFrame: (id: string) => void;
  hideAnchorImgFrame: () => void;
};

const TextAnchorMark: React.FC<AnchorProps> = ({ anchor, isMarked, onClickHandler }) => {

  return (
    <mark
      id={anchor._id}
      key={anchor._id}
      onClick={onClickHandler}
      style={
        isMarked
          ? {
              backgroundColor: "var(--color-accent)",
              color: "var(--main-text-color)",
            }
          : {}
      }
    >
      {anchor.anchorText}
    </mark>
  );
};

/** Component that parses description text to HTML,
 * using the anchors information, turning the anchored parts
 *  of text to <mark> JSX tags for interaction and stylization purposes.
 */

export const DescriptionTextAnchorsLayer: React.FC<DescriptionProps> = ({
  imageDescription,
  showAnchorImgFrame,
  hideAnchorImgFrame
}) => {
  
  const [currentAnchorId, setCurrentAnchorId] = useState('');

  const onClickHandler = (e: React.MouseEvent) => {
    console.log('state, surrent clicked : ', currentAnchorId, e.currentTarget.id)
    if (currentAnchorId === e.currentTarget.id) {
      setCurrentAnchorId('');
      hideAnchorImgFrame();
      return;
    }
    setCurrentAnchorId(e.currentTarget.id);
    showAnchorImgFrame(e.currentTarget.id);
  }

  if (!imageDescription) return null;
  if (!imageDescription.anchors?.length)
    return null;
  
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
      // Bracing the anchor word, that starts at the 0 position in the string, with <mark> JSX.
      // then adding the rest of the string, deprived of anchorText.length symbols in the start.
      const stringWithTagedAnchor = [
        <TextAnchorMark
          anchor={anchor}
          isMarked={anchor._id === currentAnchorId}
          key={anchor._id}
          onClickHandler={onClickHandler}
        />,
        stringStartFromAnchor.slice(anchor.anchorText.length),
      ];
      return stringWithTagedAnchor;
    }
  );

  // Concatenating beginning of the description with the modified anchored string/JSX parts.
  const parsedDescription = [
    descriptionStart,
    ...choppedDescriptionTextArray.flat(),
  ];

  return <div className={styles.descriptionHighlight}>{parsedDescription}</div>;
};
