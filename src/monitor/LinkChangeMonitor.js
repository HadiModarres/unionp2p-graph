import React from 'react';
import './Monitor.css';
import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';


class LinkChangeMonitor extends React.Component{
    render() {
        return (
            <div>
            <div className={"my-5"} >
                <h3 className={"navbar-brand mb-4"}>Proximity Link Change Monitor</h3>
                <XYPlot
                    width={1100}
                    height={600}>
                    <HorizontalGridLines />
                    <LineSeries
                        data={this.props.data}/>
                    <XAxis />
                    <YAxis />
                </XYPlot>
            </div>

            </div>
        );
    }
}

export default LinkChangeMonitor;
