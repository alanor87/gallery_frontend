import { Tag } from "../elements";
import styles from "./TagList.module.scss";

interface Props {
  tags: string[];
  title?: string;
  placeholder?: string;
  addOptionOn?: boolean;
  isTagDeletable?: boolean;
  onDoubleClick?: () => void;
  tagDelHandler?: (tagValue: string) => void;
}

const TagList: React.FunctionComponent<Props> = ({
  tags,
  title,
  placeholder,
  isTagDeletable = false,
  onDoubleClick,
  tagDelHandler,
}) => {
  return (
    <ul
      title={tags.length ? title : ""}
      className={styles.tagList}
      onDoubleClick={onDoubleClick}
    >
      {tags.length ? (
        tags.map((tag, index) => (
          <Tag
            tagValue={tag}
            key={index}
            isDeletable={isTagDeletable}
            deleteTag={tagDelHandler}
          />
        ))
      ) : (
        <li className={styles.listPlaceholder}>{placeholder}</li>
      )}
    </ul>
  );
};

export default TagList;
