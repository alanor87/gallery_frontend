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
  const { editImageInfo } = store.imagesStoreSettings;
  return (
    <div className="imageCardOverlay">
      <p className={`imageCardOverlay-title ${styles.shareOverlayTitle}`}>
        Image share options
      </p>
      <div className={styles.option}>
        <label>
          <Checkbox
            isChecked={isPublic}
            className={styles.shareOverlayCheckbox}
          />
        </label>
        Make the image public.
      </div>
      <div className="imageCardOverlay-buttonWrapper">
        <Button type="button" text="Accept" />
        <Button type="button" text="Cancel" onClick={onCloseShareOverlay} />
      </div>
    </div>
  );
};

export default ShareOverlay;
