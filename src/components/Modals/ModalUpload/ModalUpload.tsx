import { useState } from "react";
import { Button } from "../../elements";
import { ReactComponent as CloseIcon } from "../../../img/icon_close.svg";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalUpload = () => {
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const { uploadImages } = store.imagesStoreSettings;
  const { setUploadModalOpen } = store.modalWindowsSettings;

  const handleImagesAdd = (e: any) => {
    console.log("handleImagesAdd");
    e.preventDefault();
    e.stopPropagation();
    // defining if we added file through dialogue window - or drag'ndrop
    const files = e.type === "drop" ? e.dataTransfer.files : e.target.files;
    if (files.length && files.length < 6 && previewImages.length < 5) {
      for (let i = 0; i < files.length; i += 1) {
        const singleImage = files[i];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          setPreviewImages((previousImages) => [
            ...previousImages,
            {
              previewImageName: singleImage.name,
              previewImaageSource: event!.target!.result,
            },
          ]);
        };
        reader.readAsDataURL(singleImage);
        filesToUpload.push(singleImage);
      }
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
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("images", file);
    });
    setUploadModalOpen(false);
    await uploadImages(formData);
    clearUploadModal();
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
          {previewImages.map(({ previewImageName, previewImaageSource }) => (
            <li key={previewImageName}>
              <Button
                type="button"
                title="Delete from upload"
                className={styles.modalUploadImageDeleteButton}
                icon={CloseIcon}
                onClick={handleImageRemove(previewImageName)}
              />
              <img
                src={previewImaageSource}
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
