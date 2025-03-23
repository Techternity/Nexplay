// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Optional: To suppress React Router v7_startTransition warning
// import { unstable_HistoryRouter } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <unstable_HistoryRouter history={history} future={{ v7_startTransition: true }}>
//       <App />
//     </unstable_HistoryRouter>
//   </React.StrictMode>,
// );