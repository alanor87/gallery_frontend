import styles from "./styles.module.scss";
import store from "../../../MST/store";

const ModalUpload = () => {
  const { uploadImage } = store.imagesStoreSettings;

  const handleImageUpload = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    console.log("e.target.files : ", e.target.files);
    if (e.target.files.length) {
      for (let i = 0; i < e.target.files.length; i += 1) {
        formData.append("images", e.target.files[i]);
      }
      uploadImage(formData);
    }
  };

  return (
    <div className={styles.modalUploadWrapper}>
      <div className={styles.modalUploadText}>Drag'n'drop your images here</div>
      <input
        multiple
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
