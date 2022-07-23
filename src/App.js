import './App.css';
import React, {useState, useEffect} from 'react'
import Graph from "./Components/Graph";
import Graph1 from "./Components/Graph1";
import Graph2 from "./Components/Graph2";
import Graph3 from "./Components/Graph3";
import Graph4 from "./Components/Graph4";
import Graph5 from "./Components/Graph5";
import Graph6 from "./Components/Graph6";


const App = () => {
  const [data, setData] = useState([]);
    useEffect(() => {
      let data = [];
      let response;
      fetch(
          "http://127.0.0.1:8080/api/data/"
        )
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          setData(result);
          console.log(result)
        });
      },[])
return [<Graph data = {data}/>, <Graph1 data = {data}/>,<Graph2 data = {data}/>, <Graph3 data = {data}/>,<Graph4 data = {data}/>,<Graph5 data = {data}/>, <Graph6 data = {data}/>  ];
}
export default App;