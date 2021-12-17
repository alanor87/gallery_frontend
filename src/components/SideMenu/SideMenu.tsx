import { NavLink } from "react-router-dom";
import styles from "./SideMenu.module.scss";

interface Props {
  isOpen?: boolean;
}

const SideMenu: React.FC<Props> = ({ isOpen }) => {
  const menuClassList = isOpen
    ? `${styles.galleryMenu} ${styles.isOpen}`
    : styles.galleryMenu;

  return (
    <section className={menuClassList}>
      <ul className={styles.navLinksList}>
        <li>
          <NavLink to={"/userGallery"} className={styles.navLink} exact>
            Your gallery
          </NavLink>
        </li>
        <li>
          <NavLink to={"/sharedGallery"} className={styles.navLink} exact>
            Shared images
          </NavLink>
        </li>
        <li>
          <NavLink to={"/publicGallery"} className={styles.navLink} exact>
            Public images
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default SideMenu;
