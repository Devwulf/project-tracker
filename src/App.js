import React from 'react';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SidebarNav from './components/SidebarNav.js';

library.add(fas);

function App() {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <SidebarNav />
      <article className="flex-grow bg-gray-100">
        <div className="p-6 text-gray-900">
          <h1 className="text-2xl font-bold">Project Title here</h1>
        </div>
      </article>
    </div>
  );
}

export default App;
