import React, {Component} from 'react';
import Button from '../button/Button';
import './style.css';

export default class Toggle extends Component {
    constructor() {
        super();
        this.state = {
            isActive: false
        }
    }

    handleOpen = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    };

    render() {
        const {isActive} = this.state;
        let text = isActive ? <h1>Some text</h1> : null;

        return (
            <div className="wrap">
                <Button isActive={isActive} handleOpen={this.handleOpen}/>
                {text}
            </div>
        );
    }
}