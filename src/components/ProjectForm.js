import React from 'react';

export default class ProjectForm extends React.Component {
    constructor(props) {
        super(props);

        const {title, description} = props;
        this.state = {
            title: title || "",
            description: description || "",
            titleProp: title || "",
            descriptionProp: description || ""
        };

        this.handleOnTitleChange = this.handleOnTitleChange.bind(this);
        this.handleOnDescriptionChange = this.handleOnDescriptionChange.bind(this);
        this.resetInput = this.resetInput.bind(this);
    }

    componentDidUpdate() {
        const {title, description} = this.props;
        if (this.state.titleProp === title &&
            this.state.descriptionProp === description)
            return;
            
        let projectTitle = "";
        let projectDescription = "";
        if (title)
            projectTitle = title;

        if (description)
            projectDescription = description;

        this.setState({title: projectTitle, description: projectDescription, titleProp: projectTitle, descriptionProp: projectDescription});
    }

    handleOnTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleOnDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    resetInput() {
        this.setState({title: "", description: ""});
    }

    render() {
        return(
            <form className="text-gray-800" action="">
                <label htmlFor="projectTitle">
                    <p className="mb-2">Title</p>
                    <input id="projectTitle" className="px-2 py-1 mb-4 w-full rounded shadow-inner bg-gray-300 text-gray-700 outline-none focus:shadow-outline focus:bg-blue-100" 
                        type="text"
                        value={this.state.title}
                        onChange={this.handleOnTitleChange} />
                </label>
                <label htmlFor="projectDescription">
                    <p className="mb-2">Description</p>
                    <input id="projectTitle" className="px-2 py-1 mb-4 w-full rounded shadow-inner bg-gray-300 text-gray-700 outline-none focus:shadow-outline focus:bg-blue-100" 
                        type="text"
                        value={this.state.description}
                        onChange={this.handleOnDescriptionChange} />
                </label>
                <div className="mt-4 flex flex-col justify-center sm:justify-start sm:flex-row-reverse">
                    <input className="px-4 py-2 mb-2 sm:mb-0 rounded-md bg-indigo-500 text-gray-100 hover:bg-indigo-400 cursor-pointer" 
                        type="button" 
                        value={`${this.props.handleOnProjectCreate ? 'Create' : 'Edit'} Project`}
                        onClick={() => {
                            if (this.props.handleOnProjectCreate) {
                                if (this.props.handleOnProjectCreate(this.state.title, this.state.description)) {
                                    this.resetInput();
                                    this.props.handleCloseModal();
                                }
                            } else if (this.props.handleOnProjectUpdate) {
                                if (this.props.handleOnProjectUpdate(this.state.title, this.state.description)) {
                                    this.resetInput();
                                    this.props.handleCloseModal();
                                }
                            }
                        }} />
                    <input className="px-4 py-2 sm:mr-2 rounded-md bg-gray-300 text-indigo-500 hover:bg-gray-400 cursor-pointer" 
                           type="button" 
                           value="Cancel" 
                           onClick={this.props.handleCloseModal} />
                </div>
            </form>
        );
    }
}