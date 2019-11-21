import React, {Component} from 'react';

export default class Button extends Component {
    render() {
        const {isActive, handleOpen} = this.props;
        return (
            <button className="btn-main"
                    onClick={handleOpen}>
                {isActive ? 'Close' : 'Open'}
            </button>
        );
    }
}