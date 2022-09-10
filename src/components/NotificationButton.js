import React from 'react';

import {
    IconButton
  
} from "native-base";
import { Ionicons } from '@expo/vector-icons';

import * as Noti from '../utils/SaveNotifications'

import * as Notifications from 'expo-notifications';

export default class LocationButton extends React.Component {


    /* 
    Require Props:
        Navigation
        

    */
    constructor(props) {
        super(props)
        this.state = {
            newnoti: false
        }
    }

    componentDidMount() {
        this.checkNoti()
        Notifications.addNotificationReceivedListener(notification => {
            this.setState({ newnoti: true })
        });
    }

    async checkNoti() {
        var a = await Noti.hasNewNotifications()
        this.setState({ newnoti: a })

    }

    render() {



        return (
            
                    <IconButton
                        onPress={() => {
                            this.props.navigation.push('NotificationsStack')
                            this.setState({ newnoti: false })
                        }
                        }
                        mx='10px' icon={
                            <Ionicons
                                name={this.state.newnoti ? "notifications" : "notifications-outline"}
                                size={24}
                                color={this.state.newnoti ? "#ff9636" : "black"} />
                        } />
               
        );
    }
}