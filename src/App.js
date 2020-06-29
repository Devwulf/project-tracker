import React from 'react';
import './assets/App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useParams, Switch, Route } from 'react-router-dom';

import SidebarNav from './components/SidebarNav.js';
import DBService from './services/DBService.js';
import Project from './components/Project';

library.add(fas);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };

    this.refreshProjects = this.refreshProjects.bind(this);
    this.handleAddProject = this.handleAddProject.bind(this);
  }

  componentDidMount() {
    this.refreshProjects();
  }

  refreshProjects() {
    DBService.projects.toArray().then(projects => {
      this.setState({ projects: projects });
    });
  }

  handleAddProject(title, description) {
    DBService.addProject(title, description)
             .then(id => {
                this.refreshProjects();
             });
  }

  render() {
    return (
      <div className="flex flex-col lg:flex-row">
        <SidebarNav projects={this.state.projects} />
        <article>
          <Switch>
            <Route path="/project/:projectId">
              <ParamsProvider>
                {
                  ({ projectId }) => {
                    return <Project projectId={projectId} />
                  }
                }
              </ParamsProvider>
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

function ParamsProvider({ children }) {
  let { projectId } = useParams();
  return children({ projectId });
}
