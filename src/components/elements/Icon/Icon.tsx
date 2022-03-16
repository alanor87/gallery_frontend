import sprite from "../../../img/sprite.svg";

interface Props {
  iconName: string;
  className?: string;
  side?: number;
}

function Icon({ iconName, className, side = 20 }: Props) {
  return (
    <svg
      className={className}
      style={{ display: "block", width: side, height: side }}
    >
      <use href={sprite + "#" + iconName} />
    </svg>
  );
}

export default Icon;
