import React from 'react';
import {
    TouchableOpacity
} from 'react-native';
import {
    HStack, Text, 
} from "native-base";
import { Feather,  } from '@expo/vector-icons';


export default class LocationButton extends React.Component {


    /* 
    Require Props:
        Navigation
        Location
        place_id = ''

    */
    constructor(props) {
        super(props)
    }

    onPress = () => {
        this.props.navigation.navigate('LocationProfileStack',
            {
                location: this.props.location,
                place_id:this.props.place_id
        })

    }

    render() {
        if (!this.props.hasOwnProperty('location') ) return <></>
        if (this.props.location == '') return <></>
        
        return  (
            <TouchableOpacity onPress={this.onPress} >
                <HStack alignItems='center' >
                    <Feather name="map-pin" size={16} color='#FF9636' />
                    <Text ml={1} fontWeight='bold' color='#FF9636' numberOfLines={1}>{this.props.location}</Text>
                </HStack>
            </TouchableOpacity>
        )
    }
}