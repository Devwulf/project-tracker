import React from 'react';
import '../assets/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ParentSize } from '@vx/responsive';

import DBService from '../services/DBService.js';
import WorkArea from './WorkArea.js';
import Modal from './Modal';
import ProjectForm from './ProjectForm';

export default class Project extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedProject:  { id: 0, title: "", description: "" },
            topHidden: false,
            openProjectModal: null
        };

        this.handleHideTop = this.handleHideTop.bind(this);
        this.handleOnProjectUpdate = this.handleOnProjectUpdate.bind(this);
        this.handleOnProjectDelete = this.handleOnProjectDelete.bind(this);
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

    handleOnProjectUpdate(title, description) {
        if (!title || !description)
            return false;

        DBService.projects.update(this.state.selectedProject.id, {title: title, description: description}).then(() => {
            this.props.refreshProjects();
        }).catch(error => {
            console.error(error.stack || error);
        });

        return true;
    }

    handleOnProjectDelete() {
        DBService.projects.delete(this.state.selectedProject.id).then(() => {
            this.props.refreshProjects();
        }).catch(error => {
            console.error(error.stack || error);
        });
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
                                <div className="flex flex-col sm:flex-row ml-2">
                                    <button className="mb-2 sm:mr-2 sm:mb-0 px-3 py-1 rounded-md whitespace-no-wrap text-indigo-500 border select-none border-indigo-500 hover:bg-indigo-500 hover:text-gray-100"
                                            onClick={this.state.openProjectModal}>
                                        <FontAwesomeIcon className="mr-2" icon="pencil-alt" />
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 rounded-md whitespace-no-wrap text-red-500 border select-none border-red-500 hover:bg-red-500 hover:text-gray-100"
                                            onClick={this.handleOnProjectDelete}>
                                        <FontAwesomeIcon className="mr-2" icon="times" />
                                        Delete
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
                    {/* Modals below */}
                    <Modal title="Edit Project"
                            openModal={callable => {
                                if (!this.state.openProjectModal)
                                    this.setState({openProjectModal: callable});
                            }}>
                        {({closeModal}) => (
                        <ProjectForm title={this.state.selectedProject.title}
                                        description={this.state.selectedProject.description}
                                        handleOnProjectUpdate={this.handleOnProjectUpdate}
                                        handleCloseModal={closeModal} />
                        )}
                    </Modal>
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