import React from "react";


export default class MainPage extends React.Component{

    render(){
        console.log(localStorage.getItem("token"));
        return(
            <div>
                <h3>Welcome</h3>
            </div>
        );
    }
} 