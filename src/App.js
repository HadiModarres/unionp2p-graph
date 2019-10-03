import React from 'react';
import logo from './logo.svg';
import './App.css';
// var Graph = require('react-graph-vis');
import Graph from 'react-graph-vis';
import Stats from './stats/Stats';
import LinkChangeMonitor from "./monitor/LinkChangeMonitor";
import NodeTable from "./node table/NodeTable";

const fs = require('fs');

let ns = [];
let es = [];
for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 15; y++) {
        ns.push({
            id: y * 15 + x,
            label: `Node ${x * y}`,
            x: Math.floor(1000 * Math.random()),
            y: Math.floor(1000 * Math.random())
        })
        for (let j = 0; j < 5; j++) {
            //     es.push({from: i, to: (Math.floor(Math.random() * 300))});
            let source = Math.floor(Math.random() * (15 * 15));
            es.push({from: source, to: Math.floor(Math.random() * (15 * 15))})
        }
    }
}


var graph = {
    // nodes: [
    //     {id: 1, label: 'Node 1'},
    //     {id: 2, label: 'Node 2'},
    //     {id: 3, label: 'Node 3'},
    //     {id: 4, label: 'Node 4'},
    //     {id: 5, label: 'Node 5'}
    // ],
    nodes: ns,
    edges: es
    // edges: [
    //     {from: 1, to: 2,length: 700,smooth:true},
    //     {from: 1, to: 3},
    //     {from: 2, to: 4},
    //     {from: 2, to: 5},
    //     {from: 1, to: 5},
    //     {from: 1, to: 4},
    // ]
};

var options = {
    layout: {
        // randomSeed: Math.random(),
        improvedLayout: true
        // hierarchical:true
    },
    edges: {
        color: {highlight: 'red'},
        width: 1,
        selectionWidth: 3
    },
    interaction:{
      navigationButtons:true
    },
    height:"700px",
    autoResize: true,
    physics: false
};

var events = {
    select: function (event) {
        var {nodes, edges} = event;

    }
}


class App extends React.Component {
    constructor() {
        super(null);
        this.state = {graph: graph, options: options, events: events, link_changes:[],nodes:[],
            lastSearch:{}, export: undefined, liveData: true};
        this.onClick = this.onClick.bind(this);
        this.updateNodes = this.updateNodes.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.physicsButtonClicked = this.physicsButtonClicked.bind(this);
        this.import = this.import.bind(this);
        this.export = this.export.bind(this);
        this.liveDataButtonClicked = this.liveDataButtonClicked.bind(this);
        // this.timerID= undefined;
    }

    import(ev){
        let files = ev.target.files;
        let fileReader = new FileReader();
        fileReader.onload = (ev) => {
            let st = JSON.parse(ev.target.result);
            st.liveData = false;
            // clearTimeout(this.timerID);
            this.setState(st);
        };
        fileReader.readAsText(files[0]);
    }
    export() {
        let toExport = Object.assign({}, this.state);
        delete toExport.liveData;
        let st = JSON.stringify(toExport);
        var data = new Blob([st], {type: 'text/plain'});
        this.setState({export:window.URL.createObjectURL(data)});
    };

    colorForNode(name, lastSearch) {

        console.info(lastSearch);
        if (lastSearch.length===0) {
            return '#8888bb';
        }
        for (let n of lastSearch.stats) {
            if (n.name === name){
                if (n.action === 'start') {
                    return '#ffff23';
                }
                if (n.action === 'revisit') {
                    return '#000023';
                }
                if (n.action === 'relay') {
                    return '#ffaa22';
                }
                if (n.action === 'respond') {
                    return '#34ff23';
                }
                if (n.action === 'discard') {
                    return '#ff0000';
                }
            }


        }
        return '#8888bb';
    }

    updateNodes(newNodes, lastSearch) {
        if (!this.state.liveData) {
            return;
        }
        // console.info("new nodes");
        console.info(newNodes);
        let nodes = [];
        let edges = [];
        for (let n of newNodes) {
            nodes.push({
                id: n.id,
                color: this.colorForNode(n.id, lastSearch),
                label: n.id,
                x: parseFloat(n.id.split(",")[0]) *(this.state.options.physics?10:10) ,
                y: parseFloat(n.id.split(",")[1]) * (this.state.options.physics?10:10)
            });
            let ns = n["neighbors"];
            console.info("here");
            console.info(ns);
            for (let e of ns) {
                console.info("e");
                console.info(e);
                edges.push({from: n.id, to: e});
            }
        }
        console.info(edges);
        let newGraph = {nodes, edges};
        this.setState({graph: newGraph, events: events,nodes:newNodes,lastSearch});
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        if (!this.state.liveData){
            setTimeout(this.fetchData, 300);
            return;
        }
        let self = this;
        fetch('http://localhost:3500/stats/get_node_stats')
            .then(function (response) {
                console.info(response);
                return response.json();
            })
            .then(function (nodes) {
                fetch('http://localhost:3500/stats/last_search')
                    .then(function (response) {
                        console.info(response);
                        return response.json();
                    })
                    .then(function (lastSearch) {
                        self.updateNodes(nodes, lastSearch);
                    });
            });

        fetch('http://localhost:3500/stats/link_changes').then((value => {
            value.json().then((value1 => {
                console.info(value1);
                value1 = value1.map((val, index) => {
                    if (index >= 2) {
                        return (value1[index - 2] + value1[index - 1] + value1[index]) / 3;
                    }else{
                        return val;
                    }
                });
                value1 = value1.map((val, index) => {
                    return {x: index, y: val};
                });
                this.setState({link_changes: value1});
            }));

        }), (reason => {

        }));

        setTimeout(this.fetchData, 4000);
    }

    onClick(event) {
        graph.nodes = graph.nodes.slice(30);
        let graph2 = {};
        Object.assign(graph2, graph);
        console.log(this.state.graph.nodes.length);
        this.setState({graph: graph2});
    }

    liveDataButtonClicked(){
       this.setState((prevState)=>{
           if (!prevState.liveData)
           this.fetchData();
           return {
               liveData: !prevState.liveData
           }
       });
    }

    physicsButtonClicked(){
        let newOps = {};
        Object.assign(newOps, this.state.options);
        newOps.physics = !newOps.physics;
        let newG = {};

        Object.assign(newG, this.state.graph);
        newG.nodes=[];
        this.setState({graph: newG,options: newOps});
        netw.fit();
    }
    render() {
        let physicsEnabled = this.state.options.physics? "On":"Off";
        let liveDataEnabled = this.state.liveData? "On":"Off";
        return <div className={"dash-container"}>
            <div className={"row"}>
                <div className={"col-sm-3 card-2"}>
                    <br/>
                    <input onChange={this.import} type="file"/>
                        <br/>
                        <br/>
                    <button className={"btn btn-info"} onClick={this.export}>Export</button>
                    {this.state.export && <a href={this.state.export} download>Download</a>}
                    <br/>
                    <br/>
                    <button className={"btn btn-secondary"} onClick={this.physicsButtonClicked}>Physics: {physicsEnabled}</button>
                    <br/>
                    <br/>
                    <button className={"btn btn-secondary"} onClick={this.liveDataButtonClicked}>Live Data: {liveDataEnabled}</button>
                    <Stats totalNodes={this.state.graph.nodes.length}></Stats>
                </div>
                <div className={"col-sm-8 card-2"}>
                    <Graph graph={this.state.graph} options={this.state.options} events={this.state.events}
                           getNetwork={network => {
                               netw = network;
                           }}/>
                </div>
            </div>
            <div className={"row justify-content-center card-2"}>
                <LinkChangeMonitor data={this.state.link_changes}></LinkChangeMonitor>
            </div>
            <div className={"row"}>
                <div className={"col-5 card-2"}>
                    <h3 className={"navbar-brand mb-4"}>Last Search Stats</h3>
                    <p><b>Query:</b> {this.state.lastSearch.query}</p>
                    <p><b>Search ID:</b> {this.state.lastSearch.id}</p>
                    {
                        this.state.lastSearch.stats &&
                        this.state.lastSearch.stats.map((value) => {
                            return (<p><span style={{"color":"#17a2b8","font-size":24+"px"}}>{value.action}</span> node: {value.name}  {value.target_name && "target node: "+value.target_name}</p>)
                        })
                    }
                </div>
                <div className={"col-6 card-2"}>
                    <NodeTable nodes={this.state.nodes}></NodeTable>
                </div>
            </div>
        </div>

            ;
    }

}

let netw = null;

export default App;
