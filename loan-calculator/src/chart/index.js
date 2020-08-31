import React, { Component } from 'react';
import draw from './vis';

export default class BarChart extends Component {

    componentDidMount() {
        draw(this.props);
    }

    componentDidUpdate(preProps) {
        draw(this.props);
    }

    render() {
        return (
            <div className='vis-barchart' />
        )
    }
}
