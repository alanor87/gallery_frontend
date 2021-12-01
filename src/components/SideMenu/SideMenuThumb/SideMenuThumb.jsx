import { useState } from "react";
import styles from "./SideMenuThumb.module.scss";

const SideMenuThumb = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles.thumbContainer}>
      <button className={styles.menuCatButton} onClick={toggleOpen}>
        Block 1
      </button>
      <div
        className={styles.menuItemWrap}
        style={isOpen ? { height: 150 } : { height: 0 }}
      >
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <img src={image.previewURL} className={styles.thumb} alt="pic" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenuThumb;
