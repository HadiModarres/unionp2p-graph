import React from 'react';
import './Monitor.css';
import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';


class LinkChangeMonitor extends React.Component{
    render() {
        return (
            <div>
                <XYPlot
                    width={100}
                    height={100}>
                    <HorizontalGridLines />
                    <LineSeries
                        data={this.props.data}/>
                    <XAxis />
                    <YAxis />
                </XYPlot>
            </div>
        );
    }
}

export default LinkChangeMonitor;
