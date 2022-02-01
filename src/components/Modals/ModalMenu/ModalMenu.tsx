import { NavLink } from "react-router-dom";
import styles from "./styles.module.scss";

const ModalMenu = () => {
  return (
    <div className={styles.modalMenu}>
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
    </div>
  );
};

export default ModalMenu;
