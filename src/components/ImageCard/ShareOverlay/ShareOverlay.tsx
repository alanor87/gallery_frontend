import { useState } from "react";
import store from "../../../MST/store";
import { Checkbox, Button, Input } from "../../elements";
import styles from "./ShareOverlay.module.scss";

interface Props {
  _id: string;
  isPublic: boolean;
  openedTo: string[];
  onCloseShareOverlay: () => void;
}

const ShareOverlay: React.FunctionComponent<Props> = ({
  _id,
  isPublic,
  openedTo,
  onCloseShareOverlay,
}) => {
  const [isPublicState, setisPublicState] = useState(isPublic);
  const [openedToList, selOpenedToList] = useState(openedTo);
  const { editImageInfo } = store.imagesStoreSettings;
  console.log("isPublic : ", isPublic);

  const handlePublicState = () => {
    setisPublicState(!isPublicState);
  };

  return (
    <div className={`imageCardOverlay ${styles.shareOverlay}`}>
      <p className={`imageCardOverlay-title ${styles.shareOverlayTitle}`}>
        Image share options
      </p>
      <div className={styles.option}>
        <label>
          Make the image public.
          <Checkbox
            isChecked={isPublicState}
            onChange={handlePublicState}
            className={styles.shareOverlayCheckbox}
          />
        </label>
      </div>
      <div className={styles.option}>
        <p>Is opened to users : </p>
      </div>
      <div className="imageCardOverlay-buttonWrapper">
        <Button type="button" text="Accept" />
        <Button type="button" text="Cancel" onClick={onCloseShareOverlay} />
      </div>
    </div>
  );
};

export default ShareOverlay;
