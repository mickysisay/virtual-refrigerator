import React from "react";
import backendAPI from '../Utils/backendAPI'
import RefrigeratorCard from './RefrigeratorCard';
import { Grid } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.css'
import AddRefrigeratorModal from './AddRefrigeratorModal'


export default class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refrigerators: [],
            done: false
        }
    }
    saveAllRefrigerators = async () => {
        const response = await backendAPI.getAllRefrigetors();
        const refrigerators = response.message;
        if (response.statusCode === 200) {
            this.setState({
                refrigerators: refrigerators,
                done: this.state.done ? false : true
            });


        }
    }
    clickRefrigeratorHandle = (id) => {
        this.props.history.push("/refrigerator/" + id);
    }
    componentDidMount() {
        this.saveAllRefrigerators();
    }



    render() {



        return (
            <div>

                <Grid
                    container
                    direction="row"
                    justify="center"
                    spacing={32}
                    className='mt-5'
                >
                    {this.state.refrigerators.map((e) => {
                        return (<Grid item key={e["id"]}

                        >
                            <RefrigeratorCard
                                handleClick={this.clickRefrigeratorHandle}
                                updateRef={this.saveAllRefrigerators} refrigerator={e} />
                        </Grid>)
                    })}
                    <Grid item>
                       <AddRefrigeratorModal updateRef={this.saveAllRefrigerators} />
                    </Grid>
                </Grid>
                
            </div>
        );
    }
} 