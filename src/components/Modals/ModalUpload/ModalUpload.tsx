import { useState } from "react";
import { Button } from "../../elements";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalUpload = () => {
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [formData, setFormData] = useState(new FormData());
  const { uploadImage } = store.imagesStoreSettings;
  const { uploadModalToggle } = store.modalWindowsSettings;

  const handleImagesAdd = (e: any) => {
    console.log("Event : ", e);
    e.preventDefault();
    e.stopPropagation();
    const files = e.type === "drop" ? e.dataTransfer.files : e.target.files;
    if (files.length && files.length < 6 && previewImages.length < 5) {
      for (let i = 0; i < files.length; i += 1) {
        const singleImage = files[i];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          setPreviewImages((prevImages) => [
            ...prevImages,
            { key: singleImage.name, fileSource: event!.target!.result },
          ]);
        };
        reader.readAsDataURL(singleImage);
        formData.append("images", singleImage);
      }
    }
  };

  const clearUploadModal = () => {
    setFormData(new FormData());
    setPreviewImages([]);
  };

  const handleImagesUpload = async () => {
    await uploadImage(formData);
    uploadModalToggle();
    clearUploadModal();
  };

  return (
    <div className={styles.modalUploadWrapper}>
      {previewImages.length < 1 && (
        <div className={styles.modalUploadPlaceholder}>
          Drag'n'drop your images here
        </div>
      )}
      {previewImages.length > 0 && (
        <ul className={styles.modalUploadImagesPreviewWrapper}>
          {previewImages.map(({ key, fileSource }) => (
            <li key={key}>
              <img
                src={fileSource}
                alt="uploading item"
                className={styles.modalUploadImagesPreview}
              />
            </li>
          ))}
        </ul>
      )}
      <input
        multiple
        type="file"
        title=""
        name="uploadingFile"
        accept="image/*"
        className={styles.modalUploadArea}
        onChange={handleImagesAdd}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleImagesAdd}
      />
      <div className={styles.modalButtonWrapper}>
        <Button
          type="button"
          text="Upload"
          disabled={!previewImages.length}
          className={styles.modalUploadButton}
          onClick={handleImagesUpload}
        />
        <Button
          type="button"
          text="Clear"
          disabled={!previewImages.length}
          className={styles.modalUploadButton}
          onClick={clearUploadModal}
        />
      </div>
    </div>
  );
};

export default ModalUpload;
