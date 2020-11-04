import React, { Component } from 'react';
import handleChartType from './vis';

export default class BarChart extends Component {

    componentDidMount() {
        handleChartType(this.props);
    }

    componentDidUpdate(preProps) {
        handleChartType(this.props);
    }

    render() {
        return (
            <div className={`vis-barchart class-${this.props.data.key}`} />
        )
    }
}
