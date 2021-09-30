import SideMenuThumb from "./SideMenuThumb";
import { ImageType } from "../../MST/imagesStoreSettings";
import styles from "./SideMenu.module.scss";

interface Props {
  galleryMenuImages: ImageType[];
  isOpen: boolean;
}

const SideMenu: React.FC<Props> = ({ galleryMenuImages, isOpen }) => {
  const menuClassList = isOpen
    ? `${styles.galleryMenu} ${styles.isOpen}`
    : styles.galleryMenu;

  return (
    <section className={menuClassList}>
      {galleryMenuImages.map((image, idx) => {
        return <SideMenuThumb image={image} key={image.id} />;
      })}
    </section>
  );
};

export default SideMenu;
