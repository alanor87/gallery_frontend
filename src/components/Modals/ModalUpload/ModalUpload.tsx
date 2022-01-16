import { useState } from "react";
import { popupNotice } from "utils/popupNotice";
import { Button, Spinner } from "../../elements";
import { ReactComponent as CloseIcon } from "../../../img/icon_close.svg";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalUpload = () => {
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImages } = store.imagesStoreSettings;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  const handleImagesAdd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // defining if we added file through dialogue window - or drag'ndrop
    try {
      const files = e.type === "drop" ? e.dataTransfer.files : e.target.files;
      if (files.length && files.length + previewImages.length < 6) {
        for (let i = 0; i < files.length; i += 1) {
          const singleImage = files[i];
          setPreviewImages((previousImages) => [
            ...previousImages,
            {
              previewImageName: singleImage.name,
              previewImageSource: URL.createObjectURL(singleImage),
            },
          ]);
          filesToUpload.push(singleImage);
        }
      }
    } catch (error) {
      popupNotice("Error while loading files from local drive.");
    }
  };

  const handleImageRemove = (removeImageName: string) => () => {
    setPreviewImages(
      previewImages.filter(
        (image) => image.previewImageName !== removeImageName
      )
    );
    setFilesToUpload(
      filesToUpload.filter((file) => file.name !== removeImageName)
    );
  };

  const clearUploadModal = () => {
    setFilesToUpload([]);
    setPreviewImages([]);
  };

  const handleImagesUpload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("images", file);
    });
    await uploadImages(formData);
    setModalComponentType("none");
    setModalOpen(false);
  };

  return (
    <div
      className={styles.modalUploadWrapper}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleImagesAdd}
    >
      {!previewImages.length && (
        <div className={styles.modalUploadPlaceholder}>
          <p>
            Drag'n'drop your images here, <br /> or click to open filepicker
            dialogue.
          </p>
          <p style={{ marginTop: "10px", fontSize: "16px" }}>
            5 images maximum.
          </p>
        </div>
      )}
      <input
        multiple
        type="file"
        title=""
        name="uploadingFile"
        accept="image/*"
        className={styles.modalUploadArea}
        onChange={handleImagesAdd}
      />
      {previewImages.length > 0 && (
        <ul className={styles.modalUploadImagesPreviewWrapper}>
          {previewImages.map(({ previewImageName, previewImageSource }) => (
            <li key={previewImageName}>
              <Button
                type="button"
                title="Delete from upload"
                className={styles.modalUploadImageDeleteButton}
                icon={CloseIcon}
                onClick={handleImageRemove(previewImageName)}
              />
              <img
                src={previewImageSource}
                alt="uploading item"
                className={styles.modalUploadImagesPreview}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => e.preventDefault()}
              />
            </li>
          ))}
        </ul>
      )}
      <div className={styles.modalButtonWrapper}>
        <Button
          type="button"
          text="Upload"
          disabled={!previewImages.length || isLoading}
          className={styles.modalUploadButton}
          onClick={handleImagesUpload}
        />
        <Button
          type="button"
          text="Clear"
          disabled={!previewImages.length || isLoading}
          className={styles.modalUploadButton}
          onClick={clearUploadModal}
        />
      </div>
      {isLoading && (
        <Spinner side={20} backdropClassName={styles.spinnerBackdrop} />
      )}
    </div>
  );
};

export default ModalUpload;
