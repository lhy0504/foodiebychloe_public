import React from "react";
import {
    TouchableOpacity, Image,
    View,
} from 'react-native';
import {
    HStack, Text, VStack, FlatList
} from "native-base";
import PostPreviewItem from '../components/PostPreviewItem'



export default class PostPreview extends React.Component {


    /* 
    Require Props:
        Navigation
        posts
        (showLocation)

    */
    constructor(props) {
        super(props)
    }


    renderPost = ({ item: post }) => {

        // todo: Show username / location

        return (<PostPreviewItem
            post={post}
            navigation={this.props.navigation}
            showLocation={this.props.showLocation}
        />
        )
    }

    render() {

        return (
            <FlatList
                ListHeaderComponent={this.props.headerComponent}
                style={{ flex: 1 }}
                data={this.props.posts}
                renderItem={this.renderPost}
            />
        )

    }
}