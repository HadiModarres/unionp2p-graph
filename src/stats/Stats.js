import React from 'react';
import './Stats.css';

class Stats extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return (<div className={'stats-container'}>
            <div>Total Nodes: {this.props.totalNodes}</div>
        </div>);
    }
}

export default Stats;
