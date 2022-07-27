import React from 'react';
import {
    TouchableHighlight
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
        this.props.navigation.push('LocationProfileStack',
            {
                location: this.props.location,
                place_id:this.props.place_id
        })

    }

    render() {
        if (!this.props.hasOwnProperty('location') ) return <></>
        if (this.props.location == '') return <></>
        
        return  (
            <TouchableHighlight activeOpacity={1}underlayColor="#e6e6e6" onPress={this.onPress} >
                <HStack alignItems='center' my={.5}>
                    <Feather name="map-pin" size={16} color='#FF9636' />
                    <Text ml={1} fontWeight='bold' color='#FF9636' numberOfLines={1}>{this.props.location}</Text>
                </HStack>
            </TouchableHighlight>
        )
    }
}
