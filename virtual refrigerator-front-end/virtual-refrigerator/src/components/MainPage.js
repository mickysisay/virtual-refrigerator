import React from "react";
import backendAPI from '../Utils/backendAPI' 
import RefrigeratorCard from './RefrigeratorCard';
import {Grid} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.css'

export default class MainPage extends React.Component{

    constructor (props){
        super(props);
        this.state = {
            refrigerators :[]
        }
    }
    saveAllRefrigerators =async ()=>{
    const response =await backendAPI.getAllRefrigetors();
    const refrigerators = response.message;
    if(response.statusCode === 200){
    this.setState({
        refrigerators : refrigerators
    });
    
    }
    }
    clickRefrigeratorHandle = (id)=>{
        this.props.history.push("/refrigerator/"+id);
    }
    componentDidMount(){
        this.saveAllRefrigerators();
       //console.log( await backendAPI.checkToken());
    }

    render(){
        const allRefrigerators = [];
        console.log(this.state.refrigerators);
        for(let i=0;i<this.state.refrigerators.length ; i++){
        
        allRefrigerators.push(
            <Grid item key={this.state.refrigerators[i]["id"]}
           
             >
        <RefrigeratorCard 
        handleClick = {this.clickRefrigeratorHandle} 
        updateRef = {this.saveAllRefrigerators}   refrigerator = {this.state.refrigerators[i]} />
        </Grid>
        );
        }

        return(
            <div>
            
                <Grid
                    container
                    direction="row"
                    justify="center"
                    spacing={32}
                    className='mt-5'
                    >
                    {allRefrigerators}
                </Grid>
            </div>
        );
    }
} 