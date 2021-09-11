import SideMenuThumb from "./SideMenuThumb";
import styles from "./SideMenu.module.scss";

function SideMenu({ galleryMenuImages, isOpen }) {
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
}

export default SideMenu;
