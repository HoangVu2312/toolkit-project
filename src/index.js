import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';
import { fetchPosts } from './features/posts/postsSlice';

// react-router 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// load posts and user right when open app
store.dispatch(fetchUsers());
store.dispatch(fetchPosts());

// import store here so all components can have access to the store and reducers
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}> 
      <Router>
        <Routes> 
          <Route path='/*' element={ <App />}/>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
