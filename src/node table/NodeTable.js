import React from 'react';
import './NodeTable.css';

class NodeTable extends React.Component{
   constructor(props){
      super(props);
   }
   render() {
      return (
          <table className={"table"}>
             <tr>
                <th>
                   Node
                </th>
                <th>
                   Shuffles
                </th>
                <th>
                   Shuffle Timeouts
                </th>
                <th>
                   Shuffle Errors
                </th>
                <th>
                   Encounter Interval
                </th>
             </tr>
             {
                this.props.nodes.map((value) => {
                   return (
                       <tr>
                          <td>
                             {value.id}
                          </td>
                          <td>
                             {value.shuffles}
                          </td>
                          <td>
                             {value.timeouts}
                          </td>
                          <td>
                             {value.errors}
                          </td>
                          <td>
                             {value.enc_interval}
                          </td>
                       </tr>
                   )
                })
             }
          </table>
      );
   }
}

export default NodeTable;
