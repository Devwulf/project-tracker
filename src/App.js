import React from 'react';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouteMatch, useParams, Switch, Route } from 'react-router-dom';

import SidebarNav from './components/SidebarNav.js';

library.add(fas);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [
        { id: 1, title: "Adventure Game", description: "Creating a new, fun adventure game!" },
        { id: 2, title: "Funny Project", description: "This is so funny!" },
        { id: 3, title: "Funny Project", description: "This is so funny!" },
        { id: 4, title: "Funny Project", description: "This is so funny!" },
        { id: 5, title: "Funny Project", description: "This is so funny!" },
        { id: 6, title: "Funny Project", description: "This is so funny!" },
        { id: 7, title: "Funny Project", description: "This is so funny!" },
        { id: 8, title: "Funny Project", description: "This is so funny!" },
        { id: 9, title: "Funny Project", description: "This is so funny!" },
        { id: 10, title: "Funny Project", description: "This is so funny!" },
        { id: 11, title: "Funny Project", description: "This is so funny!" },
        { id: 12, title: "Funny Project", description: "This is so funny!" },
        { id: 13, title: "Funny Project", description: "This is so funny!" },
        { id: 14, title: "Funny Project", description: "This is so funny!" },
        { id: 15, title: "Funny Project", description: "This is so funny!" },
        { id: 16, title: "Funny Project", description: "This is so funny!" },
        { id: 17, title: "Funny Project", description: "This is so funny!" },
        { id: 18, title: "Funny Project", description: "This is so funny!" },
        { id: 19, title: "Funny Project", description: "This is so funny!" },
        { id: 20, title: "Funny Project", description: "This is so funny!" },
        { id: 21, title: "Funny Project", description: "This is so funny!" },
        { id: 22, title: "Funny Project 2", description: "This is so funny!" }
      ]
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        <SidebarNav projects={this.state.projects} />
        <article className="flex-grow h-screen bg-gray-200">
          <Switch>
            <Route path="/project/:projectId">
              <Project projects={this.state.projects} />
            </Route>
            <Route path="/">
              <div className="p-6">
                <h1 className="text-xl font-bold">
                  Please select a project first.
                </h1>
              </div>
            </Route>
          </Switch>
        </article>
      </div>
    );
  }
}

function Project(props) {
  let { projectId } = useParams();
  const project = props.projects.filter(prj => prj.id === parseInt(projectId));

  if (project.length <= 0)
    return(
      <div className="p-6">
        <h1 className="text-xl font-bold">
          Please select a project first.
        </h1>
      </div>
    );

  return(
    <div className="flex flex-col h-full text-gray-900">
      <div className="p-6 flex items-center justify-between shadow bg-gray-100">
        <div className="">
          <h1 className="text-xl font-bold">{project[0].title}</h1>
          <span className="text-gray-700">{project[0].description}</span>
        </div>
        <div className="">
          <button className="px-3 py-1 rounded-md text-indigo-500 border border-indigo-500 hover:bg-indigo-300 hover:text-gray-100">
            <FontAwesomeIcon className="mr-2" icon="pencil-alt" />
            Edit
          </button>
        </div>
      </div>
      { /* Working area where nodes are found */ }
      <div className="bg-gray-900">

      </div>
    </div>
  );
}
