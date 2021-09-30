import { useState, memo } from "react";
import { NavLink } from "react-router-dom";
import { Tag } from "../elements";
import store from "../../MST/store";
import TagEditor from "../TagEditor";
import { ImageType } from "../../MST/imagesStoreSettings";
import styles from "./ImageCard.module.scss";

interface Props {
  image: ImageType;
}

const ImageCard: React.FC<Props> = ({ image }) => {
  console.log("Render"); // just for debugging -  to be sure memoization works)

  const { id, imageURL, imageInfo } = image;
  const { tags, likes } = imageInfo;

  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
  const [tagsAreLoading, setTagsAreLoading] = useState(false);

  const onTagEditOpen = () => setTagEditorOpen(true);
  const onTagEditClose = () => setTagEditorOpen(false);

  const tagDelHandler = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    tagsUpdate(newTags);
  };

  const tagAddHandler = (tagToAdd: string) => {
    tagsUpdate([...tags, tagToAdd]);
  };

  const tagsUpdate = async (newTags: string[]) => {
    setTagsAreLoading(true);
    await store.imagesStoreSettings.editTags(id, newTags);
    setTagsAreLoading(false);
  };

  return (
    <div className={styles.cardWrap}>
      {tagEditorIsOpen && (
        <TagEditor
          tags={tags}
          closeHandle={onTagEditClose}
          onTagDelete={tagDelHandler}
          onAddTag={tagAddHandler}
          isLoading={tagsAreLoading}
        />
      )}
      <NavLink to={`/image/${id}`}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={imageURL} alt="pic" />
        </div>
      </NavLink>
      {!tagEditorIsOpen && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            {!tagsAreLoading ? (
              <>
                {" "}
                <ul
                  title="Double click to edit"
                  className={styles.tagList}
                  onDoubleClick={onTagEditOpen}
                >
                  {tags.map((tag, index) => (
                    <Tag
                      tagValue={tag}
                      key={index}
                      edit={true}
                      deleteTag={tagDelHandler}
                    />
                  ))}
                </ul>
                <div className={styles.addInfo}>
                  <span>Likes: {likes}</span>
                </div>{" "}
              </>
            ) : (
              <p>is Loading</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function areEqual(prevImg: any, nextImg: any) {
  const prevTags = JSON.stringify(prevImg.imageInfo.tags);
  const nextTags = JSON.stringify(nextImg.imageInfo.tags);
  // memoization comparison function. If the tag list is the same -
  return prevTags === nextTags; // the image card is not rendered again.
}

export default memo(ImageCard, areEqual); // memization of image card.