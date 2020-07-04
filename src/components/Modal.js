import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    
    componentDidMount() {
        this.props.openModal(this.handleOpenModal);
    }

    handleOpenModal() {
        this.setState({isModalOpen: true});
    }

    handleCloseModal() {
        this.setState({isModalOpen: false});
    }

    render() {
        const {children} = this.props;
        const closeModal = this.handleCloseModal;
        return(
            <div className={`${this.state.isModalOpen ? 'flex' : 'hidden'} absolute-full items-center justify-center z-30`}>
                <div className="absolute-full opacity-50 bg-gray-900 cursor-pointer"
                     onClick={this.handleCloseModal}></div>
                <div className="p-4 sm:p-8 w-2/3 lg:w-1/2 bg-gray-100 z-40 rounded shadow-lg">
                    <div className="mb-4 flex items-center justify-between text-gray-800">
                        <span className="text-lg font-medium">
                            {this.props.title}
                        </span>
                        <FontAwesomeIcon className="text-lg sm:text-xl cursor-pointer" 
                                         icon="times"
                                         onClick={this.handleCloseModal} />
                    </div>
                    <div>
                        {children({ closeModal })}
                    </div>
                </div>
            </div>
        );
    }
}