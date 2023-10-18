import React, { useEffect, useState } from "react";
import PT from "prop-types";

const initialFormValues = { title: "Fancy Title", text: "Fancy Text", topic: "Fancy Topic" };

export default function ArticleForm(props) {
  const { setCurrentArticleId, currentArticleId, articles, postArticle, updateArticle } = props;
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here
 useEffect(() => {
    if (currentArticleId && articles.length > 0) {
      const currentArticle = articles.find(
        (item) => item.article_id === currentArticleId
      );
      if (currentArticle) {
        setValues(currentArticle);
      }
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticleId, articles]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    console.log(evt);

    if (currentArticleId) {
      let articleData = {
        article_id: currentArticleId,
        article: values,
      };

      updateArticle(articleData)
        .then(() => {
          setValues(initialFormValues);
        })
        .catch((error) => {
          console.error("Error updating article:", error);
        });
    } else {
      postArticle(values)
        .then(() => {
          console.log("Article posted successfully");
          setValues(initialFormValues);
        })
        .catch((error) => {
          console.error("Error posting article:", error);
        });
    }
  };

 
  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    if (values.text && values.title && values.topic) {
      return false;
    } else {
      return true;
    }
  };
  const canceled = (evt) => {
    evt.preventDefault();
    setCurrentArticleId();
    setValues(initialFormValues);
  };


  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          Submit
        </button>
    
        <button onClick={(e) => canceled(e)}>Cancel edit</button>
      </div>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
