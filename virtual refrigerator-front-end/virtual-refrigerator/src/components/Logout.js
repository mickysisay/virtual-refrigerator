import React from 'react';

import { Redirect } from 'react-router-dom'
import { LogOut } from '../Utils/AuthenticatedRoute'


export class Logout extends React.Component {



    render() {
        this.props.updateLoggedIn();
        LogOut()

        return (
            <Redirect path="/login" />
        );
    }
}