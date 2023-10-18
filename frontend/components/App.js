import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const set = true

  const navigate = useNavigate();

  // const PrivateRoute = ({ element, isAuthenticated, redirectTo = '/', ...rest }) => {
  //   return isAuthenticated ? (
  //     <Route {...rest} element={element} />
  //   ) : (
  //     <Navigate to={redirectTo} replace />
  //   );
  // };

  const redirectToLogin = () => {
    navigate('/');
  }

  const redirectToArticles = () => {
    navigate('/articles');
  }

  const logout = () => {
  console.log('Logging Out....')
    // Remove token from local storage
    localStorage.removeItem('token');
  
    setMessage('Goodbye!');
    // Redirect to login
    redirectToLogin();
    setArticles([])
  }

  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl, { username, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        console.log(response.data.token)
        setMessage('Login Successful');
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => {
        setMessage('Login failed. Please check your credentials');
        setSpinnerOn(false);
        console.error(err)
      });
  }

  const getArticles = (set) => {
    setSpinnerOn(true);

    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        if(!set){
           setMessage(res.data.message);
        }
        setArticles(res.data.articles);
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    return axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        getArticles(set);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.error(err);
      });
  };
  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true);
    return axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        getArticles(set)
        setMessage(res.data.message);
        setCurrentArticleId(false);
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.error(err);
      });
};

const deleteArticle = (article_id) => {
  setSpinnerOn(true);

  return axiosWithAuth()
    .delete(`${articlesUrl}/${article_id}`)
    .then((res) => {
      getArticles(set);
      setMessage(res.data.message);
      setSpinnerOn(false);
    })
    .catch((err) => {
      console.error(err);
      setSpinnerOn(false);
    });
};



return (
  // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
  <>
    <Spinner on={spinnerOn} />
    <Message message={message} />
    <button id="logout" onClick={logout}>
      Logout from app
    </button>
    <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
      {" "}
      {/* <-- do not change this line */}
      <h1>Advanced Web Applications</h1>
      <nav>
        <NavLink id="loginScreen" to="/">
          Login
        </NavLink>
        <NavLink id="articlesScreen" to="/articles">
          Articles
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<LoginForm login={login} />} />
        <Route
          path="articles"
          element={
            <>
              <ArticleForm
                articles={articles}
                postArticle={postArticle}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                updateArticle={updateArticle}
              />
              <Articles
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
              />
            </>
          }
        />
      </Routes>
      <footer>Bloom Institute of Technology 2022</footer>
    </div>
  </>
);
}