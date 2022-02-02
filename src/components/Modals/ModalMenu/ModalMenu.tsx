import { NavLink } from "react-router-dom";
import { Button } from "components/elements";
import { ModalWindowProps } from "types/modal";
import styles from "./styles.module.scss";

const ModalMenu: React.FC<ModalWindowProps> = ({ modalCloseHandle }) => {
  return (
    <div className={styles.modalMenu}>
      <Button
        type="button"
        title="Close tag editor"
        className={styles.modalImageCloseBtn}
        icon="icon_close"
        onClick={modalCloseHandle}
      />
      <ul className={styles.navLinksList}>
        <li>
          <NavLink to={"/userGallery"} className="navLink" exact>
            Your gallery
          </NavLink>
        </li>
        <li>
          <NavLink to={"/sharedGallery"} className="navLink" exact>
            Shared images
          </NavLink>
        </li>
        <li>
          <NavLink to={"/publicGallery"} className="navLink" exact>
            Public images
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default ModalMenu;
