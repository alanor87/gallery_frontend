import styles from "./SideMenu.module.scss";

interface Props {
  isOpen?: boolean;
}

const SideMenu: React.FC<Props> = ({ isOpen }) => {
  const menuClassList = isOpen
    ? `${styles.galleryMenu} ${styles.isOpen}`
    : styles.galleryMenu;

  return <section className={menuClassList}></section>;
};

export default SideMenu;
