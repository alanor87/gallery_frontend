import { useState } from "react";
import store from "../../../MST/store";
import { Button, Spinner } from "../../elements";

interface Props {
  _id: string;
  onCloseDeleteOverlay: () => void;
}

const DeleteOverlay: React.FunctionComponent<Props> = ({
  _id,
  onCloseDeleteOverlay,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteImages, selectedListChange, clearSelectedList } =
    store.imagesStoreSettings;

  const deleteImageHandler = async () => {
    setIsLoading(true);
    selectedListChange(_id);
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
      {isLoading && <Spinner side={20} />}
    </div>
  );
};

export default DeleteOverlay;
