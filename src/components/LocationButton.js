import React from 'react';
import {
    TouchableHighlight
} from 'react-native';
import {
    HStack, Text, VStack,
} from "native-base";
import { Feather, } from '@expo/vector-icons';
import { getLocation } from '../utils/FirebaseUtil';

export default class LocationButton extends React.Component {


    /* 
    Require Props:
        Navigation
        Location
        place_id = ''

    */
    constructor(props) {
        super(props)
        this.state = null
    }
    
    async getData () {
        var l = await getLocation(this.props.location, this.props.place_id, false)
        var desc = ''


        if (l.hasOwnProperty('tag') && l.tag.length > 0) {
            desc += l.tag.join(' / ')
        }
        if (l.hasOwnProperty('price')) {
            desc += " / $" + l.price
        }
        if (desc != '') {
            this.setState({ description: desc })
        }
    }
    componentDidMount() {
        this.getData()
    }
    onPress = () => {
        this.props.navigation.push('LocationProfileStack',
            {
                location: this.props.location,
                place_id: this.props.place_id
            })

    }

    render() {
        if (!this.props.hasOwnProperty('location')) return <></>
        if (this.props.location == '') return <></>

        return (
            <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6" onPress={this.onPress} >
                <HStack alignItems='center' my={.5}>
                   
                    <VStack>
                        <Text  fontWeight='bold' color='#FF9636' numberOfLines={1}>{this.props.location.trim()}</Text>
                        {this.state &&  <Text >{this.state.description}</Text>}
                    </VStack>
                </HStack>
            </TouchableHighlight>
        )
    }
}
