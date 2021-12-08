import { useState } from "react";
import store from "../../../MST/store";
import TagEditor from "../../TagEditor";
import { Checkbox, Button, Tag } from "../../elements";
import { ReactComponent as EditIcon } from "../../../img/icon_edit.svg";
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
  const [openedToList, setOpenedToList] = useState(openedTo);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const { editImagesInfo } = store.imagesStoreSettings;
  const { checkIfUserExistsByName } = store.userSettings;

  const openToOverlayOpenHandler = () => {
    setOpenedToOverlayIsOpen(true);
  };
  const openToOverlayCloseHandler = () => {
    setOpenedToOverlayIsOpen(false);
  };

  const publicStateChangeHandler = () => {
    setisPublicState(!isPublicState);
  };

  const userDelHandler = (userToDelete: string) => {
    const newTags = openedToList.filter((user) => user !== userToDelete);
    setOpenedToList(newTags);
  };
  const userAddHandler = async (name: string) => {
    const userDoesExist = await checkIfUserExistsByName(name);
    if (userDoesExist && !openedToList.includes(name))
      setOpenedToList([...openedToList, name]);
  };

  const acceptChangesHandler = () => {
    editImagesInfo([
      { _id, imageInfo: { isPublic: isPublicState, openedTo: openedToList } },
    ]);
    onCloseShareOverlay();
  };

  return !openedToOverlayIsOpen ? (
    <div className={`imageCardOverlay ${styles.shareOverlay}`}>
      <p className={`imageCardOverlay-title ${styles.shareOverlayTitle}`}>
        Image share options
      </p>
      <div className={styles.option}>
        <label>
          Make the image public.
          <Checkbox
            isChecked={isPublicState}
            onChange={publicStateChangeHandler}
            className={styles.shareOverlayCheckbox}
          />
        </label>
      </div>
      <div className={styles.option}>
        <p className={styles.openedTo}>Is opened to users : </p>
        {openedToList.map((entry, index) => (
          <Tag key={index} tagValue={entry} />
        ))}
        <Button
          className={styles.addUserBtn}
          text="Edit"
          title="Edit list of users with acces to this image"
          icon={EditIcon}
          onClick={openToOverlayOpenHandler}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Button type="button" text="Accept" onClick={acceptChangesHandler} />
        <Button type="button" text="Cancel" onClick={onCloseShareOverlay} />
      </div>
    </div>
  ) : (
    <TagEditor
      tags={openedToList}
      closeHandle={openToOverlayCloseHandler}
      onTagDelete={userDelHandler}
      onAddTags={userAddHandler}
      isLoading={false}
    />
  );
};

export default ShareOverlay;
