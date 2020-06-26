import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ParentSize } from '@vx/responsive';

import DBService from '../services/DBService.js';
import WorkArea from './WorkArea.js';

export default class Project extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedProject: {}
        };
    }

    componentDidUpdate() {
        const id = parseInt(this.props.projectId);
        DBService.projects.get(id, project => {
            this.setState({ selectedProject: project });
        }).catch(error => {
            console.error(error.stack || error);
        });
    }

    render() {
        if (this.state.selectedProject)
            return(
                <div className="flex flex-col h-full text-gray-900">
                    <div className="p-6 flex items-center justify-between shadow bg-gray-100">
                        <div className="">
                            <h1 className="text-xl font-bold">{this.state.selectedProject.title}</h1>
                            <span className="text-gray-700">{this.state.selectedProject.description}</span>
                        </div>
                        <div className="">
                            <button className="px-3 py-1 rounded-md text-indigo-500 border border-indigo-500 hover:bg-indigo-300 hover:text-gray-100">
                                <FontAwesomeIcon className="mr-2" icon="pencil-alt" />
                                Edit
                            </button>
                        </div>
                    </div>
                    { /* Working area where nodes are found */ }
                    <div className="h-full">
                        <ParentSize>
                            {
                                ({width, height}) => (
                                    <WorkArea width={width} height={height} />
                                )
                            }
                        </ParentSize>
                    </div>
                </div>
            );

        return(
            <div className="p-6">
                <h1 className="text-xl font-bold">
                    Please select a project first.
                </h1>
            </div>
        );
    }
}