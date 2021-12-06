import store from "../../../MST/store";
import { Button } from "../../elements";

interface Props {
  _id: string;
  imageHostingId: string;
  onCloseDeleteOverlay: () => void;
}

const DeleteOverlay: React.FunctionComponent<Props> = ({
  _id,
  imageHostingId,
  onCloseDeleteOverlay,
}) => {
  const { deleteImages, selectedListChange, clearSelectedList } =
    store.imagesStoreSettings;

  const deleteImageHandler = async () => {
    selectedListChange(_id, imageHostingId);
    await deleteImages();
    clearSelectedList();
  };

  const closeDeleteOverlayHandler = () => {
    onCloseDeleteOverlay();
  };

  return (
    <div className="imageCardOverlay">
      <p className="imageCardOverlay-title">
        Sure you want to delete this item?
      </p>
      <div className="imageCardOverlay-buttonWrapper">
        <Button type="button" text="Delete" onClick={deleteImageHandler} />
        <Button
          type="button"
          text="Cancel"
          onClick={closeDeleteOverlayHandler}
        />
      </div>
    </div>
  );
};

export default DeleteOverlay;
