import { observer } from "mobx-react-lite";
import { Tag } from "components/elements";
import styles from "./TagList.module.scss";

interface Props {
  tags: string[];
  title?: string;
  placeholder?: string;
  isEditable?: boolean;
  onDoubleClick?: () => void;
  tagDelHandler?: (tagValue: string) => void;
}

const TagList: React.FunctionComponent<Props> = ({
  tags,
  title,
  placeholder,
  isEditable,
  onDoubleClick,
  tagDelHandler,
}) => {
  return (
    <ul
      title={tags.length ? title : ""}
      className={styles.tagList}
      onDoubleClick={isEditable && onDoubleClick ? onDoubleClick : () => null}
    >
      {tags.length ? (
        tags.map((tag, index) => (
          <Tag
            tagValue={tag}
            key={index}
            isDeletable={tagDelHandler && isEditable}
            deleteTag={isEditable && tagDelHandler ? tagDelHandler : () => null}
          />
        ))
      ) : (
        <li className={styles.listPlaceholder}>{placeholder}</li>
      )}
    </ul>
  );
};

export default observer(TagList);
