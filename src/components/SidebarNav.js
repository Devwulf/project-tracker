import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';

import DBService from '../services/DBService';
import Modal from './Modal';
import ProjectForm from './ProjectForm';

export default class SidebarNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isNavMenuOpen: false,
            openProjectModal: null
        };

        this.openNavMenu = this.openNavMenu.bind(this);
        this.closeNavMenu = this.closeNavMenu.bind(this);
        this.toggleNavMenu = this.toggleNavMenu.bind(this);
        this.handleOnProjectCreate = this.handleOnProjectCreate.bind(this);
    }

    openNavMenu() {
        this.setState({isNavMenuOpen: true});
    }

    closeNavMenu() {
        this.setState({isNavMenuOpen: false});
    }

    toggleNavMenu() {
        if (this.state.isNavMenuOpen)
            this.closeNavMenu();
        else
            this.openNavMenu();
    }

    handleOnProjectCreate(title, description) {
        // TODO: Show feedback for invalid input
        if (!title || !description)
            return false;

        DBService.addProject(title, description).then(() => {
            this.props.refreshProjects();
        }).catch(error => {
            console.error(error.stack || error);
        });

        return true;
    }

    render() {
        return (
            <nav className="nav">
                {/* 
                * Plan is to have a top navigation for md and below
                * screen sizes, but have sidebar for lg and above
                * 
                * Ignore animations for now
                */}

                { /* Top navbar */ }
                <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800">
                    { /* Logo */ }
                    <div className="">
                        <FontAwesomeIcon className="mr-4 text-2xl text-indigo-500" icon="project-diagram" />
                        <Link to="/" className="text-xl text-gray-100 font-semibold">Project Tracker</Link>
                    </div>

                    { /* Hamburger for sidebar items */ }
                    <div className="block">
                        <button className="flex items-center py-2 px-3 text-indigo-500 rounded border border-indigo-500 hover:bg-indigo-300"
                                onClick={this.toggleNavMenu} >
                            <FontAwesomeIcon icon="bars" />
                        </button>
                    </div>
                </div>

                { /* Nav Items */ }
                <div className={`${this.state.isNavMenuOpen ? '' : 'hidden'} lg:hidden relative z-20`}>
                    <div className="absolute w-full px-4 pb-4 bg-gray-800">
                        {
                            this.props.projects.map((element, i) => (
                                <Link key={i} onClick={this.closeNavMenu} to={"/project/" + element.id} className="block mb-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:bg-gray-900 text-gray-100">
                                    <FontAwesomeIcon className="mr-4 text-lg text-gray-600" icon="folder" />
                                    {element.title}
                                </Link>
                            ))
                        }
                            <div className="w-full mb-1 px-4 py-2 rounded-md border-gray-600 border-dashed border-2 cursor-pointer hover:bg-gray-900 focus:bg-gray-900 text-gray-500"
                                    onClick={() => {
                                        this.state.openProjectModal();
                                        this.closeNavMenu();
                                    }}>
                                <FontAwesomeIcon className="mr-4 text-lg text-gray-600" icon="plus" />
                                <span className="font-medium">Add Project</span>
                            </div>
                    </div>
                </div>

                { /* Sidebar */ }
                <div className="hidden lg:flex">
                    <div className="flex-grow h-screen bg-gray-800 relative">
                        { /* Logo */ }
                        <div className="p-4 h-16">
                            <FontAwesomeIcon className="mr-4 text-2xl text-indigo-500" icon="project-diagram" />
                            <Link to="/" className="text-xl text-gray-100 font-semibold">Project Tracker</Link>
                        </div>

                        { /* Sidebar Items */ }
                        <div className="p-2 fixed top-16 bottom-0 my-auto lg:w-3/12 xl:w-1/5">
                            { /* TODO: Place the dashboard item here */ }
                            <Scrollbar noScrollX>
                                {
                                    this.props.projects.map((element, i) => (
                                        <Link key={i} to={"/project/" + element.id} className="block mb-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:bg-gray-900 text-gray-100">
                                            <FontAwesomeIcon className="mr-4 text-lg text-gray-600" icon="folder" />
                                            {element.title}
                                        </Link>
                                    ))
                                }
                                
                                <div className="w-full mb-1 px-4 py-2 rounded-md border-gray-600 border-dashed border-2 cursor-pointer hover:bg-gray-900 focus:bg-gray-900 text-gray-500"
                                        onClick={this.state.openProjectModal}>
                                    <FontAwesomeIcon className="mr-4 text-lg text-gray-600" icon="plus" />
                                    <span className="font-medium">Add Project</span>
                                </div>
                            </Scrollbar>
                        </div>
                    </div>
                </div>

                {/* Modals here */}
                <Modal title="Create New Project"
                        openModal={callable => {
                            if (!this.state.openProjectModal)
                                this.setState({openProjectModal: callable});
                        }}>
                    {({closeModal}) => (
                    <ProjectForm title=""
                                    description=""
                                    handleOnProjectCreate={this.handleOnProjectCreate}
                                    handleCloseModal={closeModal} />
                    )}
                </Modal>
            </nav>
        );
    }
}