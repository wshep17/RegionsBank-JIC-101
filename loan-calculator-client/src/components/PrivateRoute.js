import React from 'react'
import { Redirect, Route } from "react-router-dom";
import { ContextAPI } from './Context.js'

function PrivateRoute({ component: Component }, { ...rest }) {
    return(
    <ContextAPI.Consumer>
        {({isAdmin}) => {
            return  <Route {...rest} render = {(props) => isAdmin ? (<Component {...props}/>) : (<Redirect to ='/login' />)} />
        }}
    </ContextAPI.Consumer>
    )
}

export default PrivateRoute