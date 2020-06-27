import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';

export default class SidebarNav extends React.Component {
    constructor(props) {
        super(props);
        this.navMenu = React.createRef();
        this.state = {
            isNavMenuOpen: false
        };

        this.toggleNavMenu = this.toggleNavMenu.bind(this);
    }

    toggleNavMenu() {
        if (this.state.isNavMenuOpen) {
            // Close the nav menu
            this.navMenu.current.classList.add('hidden');
            this.setState(state => ({
                isNavMenuOpen: !state.isNavMenuOpen
            }));
        }
        else {
            // Open the nav menu
            this.navMenu.current.classList.remove('hidden');
            this.setState(state => ({
                isNavMenuOpen: !state.isNavMenuOpen
            }));
        }
    }

    render() {
        return (
            <nav className="w-full lg:w-3/12 xl:w-1/5">
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
                        <button onClick={this.toggleNavMenu} className="flex items-center py-2 px-3 text-indigo-500 rounded border border-indigo-500 hover:bg-indigo-300">
                            <FontAwesomeIcon icon="bars" />
                        </button>
                    </div>
                </div>

                { /* Nav Items */ }
                <div className="hidden lg:hidden relative z-20" ref={this.navMenu}>
                    <div className="absolute w-full px-4 pb-4 bg-gray-800">
                        {
                            this.props.projects.map((element, i) => {
                                return (
                                    <Link key={i} onClick={this.toggleNavMenu} to={"/project/" + element.id} className="block mb-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:bg-gray-900 text-gray-100">
                                        <FontAwesomeIcon className="mr-4 text-lg text-gray-600" icon="folder" />
                                        {element.title}
                                    </Link>
                                );
                            })
                        }
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
                                    this.props.projects.map((element, i) => {
                                        return (
                                            <Link key={i} to={"/project/" + element.id} className="block mb-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:bg-gray-900 text-gray-100">
                                                <FontAwesomeIcon className="mr-4 text-lg text-gray-600" icon="folder" />
                                                {element.title}
                                            </Link>
                                        );
                                    })
                                }
                            </Scrollbar>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}