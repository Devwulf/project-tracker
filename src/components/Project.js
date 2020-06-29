import React from 'react';
import '../assets/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ParentSize } from '@vx/responsive';

import DBService from '../services/DBService.js';
import WorkArea from './WorkArea.js';

export default class Project extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedProject: { id: 0 },
            topHidden: false
        };

        this.handleHideTop = this.handleHideTop.bind(this);
    }

    // NOTE: Never ever use this.setState inside a componentDidUpdate()
    // unless you can check if the update is necessary or not
    componentDidUpdate() {
        const id = parseInt(this.props.projectId);
        if (this.state.selectedProject.id !== id) {
            DBService.projects.get(id, project => {
                this.setState({selectedProject: project});
            }).catch(error => {
                console.error(error.stack || error);
            });
        }
    }

    handleHideTop() {
        this.setState(state => ({
            topHidden: !state.topHidden
        }));
    }

    render() {
        if (this.state.selectedProject)
            return(
                <div className="main">
                    <div className="relative">
                        <div className="absolute w-full z-10">
                            <div  className={`${this.state.topHidden ? "hidden" : "flex"}  px-4 py-2 sm:p-6 items-center justify-between shadow bg-gray-100`}>
                                <div className="">
                                    <h1 className="text-xl font-bold">{this.state.selectedProject.title}</h1>
                                    <span className="text-gray-700">{this.state.selectedProject.description}</span>
                                </div>
                                <div className="">
                                    <button className="px-3 py-1 rounded-md text-indigo-500 border select-none border-indigo-500 hover:bg-indigo-500 hover:text-gray-100">
                                        <FontAwesomeIcon className="mr-2" icon="pencil-alt" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <button className="hide-proj px-2 pb-1 lg:px-3 lg:py-2 absolute rounded-b-full bg-gray-400 text-gray-900 hover:bg-gray-900 hover:text-gray-400" onClick={this.handleHideTop}>
                                    <FontAwesomeIcon className="sm:text-base lg:text-xl" icon={this.state.topHidden ? 'chevron-down' : 'chevron-up'} />
                                </button>
                            </div>
                        </div>
                    </div>
                    { /* Working area where nodes are found */ }
                    <ParentSize>
                        {
                            ({width, height}) => (
                                <WorkArea projectId={this.props.projectId} width={width} height={height} />
                            )
                        }
                    </ParentSize>
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