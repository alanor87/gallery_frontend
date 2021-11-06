import styles from "./styles.module.scss";
import store from "../../../MST/store";

const ModalUpload = () => {
  const { uploadImage } = store.imagesStoreSettings;

  const handleImageUpload = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    uploadImage(formData);
  };
  return (
    <div className={styles.modalUploadWrapper}>
      <div className={styles.modalUploadText}>Drag'n'drop your images here</div>
      <input
        type="file"
        name="uploadingFile"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ModalUpload;
