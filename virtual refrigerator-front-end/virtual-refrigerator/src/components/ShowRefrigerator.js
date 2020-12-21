import React from "react";
//import backendAPI from '../Utils/backendAPI' 

export default class ShowRefrigerator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id
        }
    }
    componentDidMount(){
      
    }

    render(){
        console.log(this.state.id);
        return(<div>HELLO WORLD</div>);
    }
}