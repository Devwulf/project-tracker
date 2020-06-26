import React from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NewProjectForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: ""
        };

        this.handleTitleChanged = this.handleTitleChanged.bind(this);
        this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChanged(event) {
        this.setState({
            title: event.target.value
        });
    }

    handleDescriptionChanged(event) {
        this.setState({
            description: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.title, this.state.description);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="titleField">
                    Title
                    <input id="titleField" type="text" value={this.state.title} onChange={this.handleTitleChanged} />
                </label>
                <label htmlFor="descriptionField">
                    Description
                    <input id="descriptionField" type="text" value={this.state.description} onChange={this.handleDescriptionChanged} />
                </label>
                <button className="" type="submit">
                    <FontAwesomeIcon icon="plus" />
                    Create Project
                </button>
            </form>
        )
    }
}

NewProjectForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default NewProjectForm;