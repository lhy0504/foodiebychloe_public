import React from 'react';
import { TouchableHighlight } from 'react-native-gesture-handler';

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
        hideTags = false

    Optional: color (for tag color)

    */
    constructor(props) {
        super(props)
        this.state = null
    }

    async getData() {
        var l = await getLocation(this.props.location, this.props.place_id, false)
        var desc = ''


        if (l.hasOwnProperty('tag') && l.tag.length > 0) {
            desc += l.tag.join(' / ')
        }
        if (l.hasOwnProperty('price')) {
            desc += " / $" + l.price
        }
        if (l.hasOwnProperty('average')) {
            desc += " (" + (l.average).toFixed(1) + ")"
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
    var fontSize = this.props.hasOwnProperty('fontSize') ? this.props.fontSize : 'md'

    return (
        <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e650" onPress={this.onPress} >
            <HStack alignItems='center' my={.5}>

                <VStack>
                    <HStack alignItems={'center'}>
                        {this.props.hasOwnProperty('hideTags') &&
                            <Feather name="map-pin" size={16} color='#FF9636' style={{ marginRight: 4 }} />}
                        <Text fontWeight='bold' color='#FF9636' numberOfLines={1} fontSize={fontSize}>
                            {this.props.location.trim()}
                        </Text>
                    </HStack>
                    {this.state && !this.props.hasOwnProperty('hideTags') &&
                        <Text fontSize={fontSize}
                            color={
                                this.props.hasOwnProperty('color') ?
                                    this.props.color
                                    :
                                    'black'
                            }>{this.state.description}</Text>}
                </VStack>
            </HStack>
        </TouchableHighlight>
    )
}
}
