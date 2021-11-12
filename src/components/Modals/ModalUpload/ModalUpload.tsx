import styles from "./styles.module.scss";
import store from "../../../MST/store";

const ModalUpload = () => {
  const { uploadImage } = store.imagesStoreSettings;

  const handleImageUpload = (e: any) => {
    console.log("Change");
    e.preventDefault();
    const formData = new FormData();
    if (e.target.files.length) {
      formData.append("image", e.target.files[0]);
      uploadImage(formData);
    }
  };

  return (
    <div className={styles.modalUploadWrapper}>
      <div className={styles.modalUploadText}>Drag'n'drop your images here</div>
      <input
        type="file"
        name="uploadingFile"
        className={styles.modalUploadArea}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ModalUpload;
