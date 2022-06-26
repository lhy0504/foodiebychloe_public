import React from "react";
import {
    TouchableOpacity, Image,
    View,
} from 'react-native';
import {
    HStack, Text, VStack, FlatList
} from "native-base";
import LocationButton from '../components/LocationButton'
import StarRating from 'react-native-star-rating';


export default class PostPreview extends React.Component {


    /* 
    Require Props:
        Navigation
        posts

    */
    constructor(props) {
        super(props)
    }


    renderPost = ({ item: post }) => {

        // todo: Show username / location

        return (
            <TouchableOpacity onPress={() => this.props.navigation.push('StoryStack', { post: post, currImg: 0 })} >
                <VStack mx={5} py={3} borderBottomWidth={1} borderBottomColor='coolGray.300'>
                    <HStack justifyContent='space-between' alignItems='center' mb={1}>
                        <LocationButton disabled
                            location={post.location}
                            place_id={post.place_id}
                            navigation={this.props.navigation} />
                        
                        {post.overallyummy != 0 && <StarRating
                            fullStarColor='#ff9636'
                            rating={post.overallyummy}
                            starSize={20}
                        />}

                    </HStack>
                    {post.overalltitle != '' && <Text fontWeight={'bold'} numberOfLines={1}>{post.overalltitle}</Text>}
                    {post.overalldescription != '' && <Text numberOfLines={3} >{post.overalldescription}</Text>}
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }} >
                        {post.image.map(
                            img => (<View style={{ flexBasis: '33%', padding: 2 }}>
                                <Image source={{ uri: img }} style={{ height: 100, width: '100%', }} />
                            </View>
                            )
                        )}
                    </View>
                </VStack>
            </TouchableOpacity>
        )
    }

    render() {

        return (
            <FlatList
                style={{ flex: 1 }}
                data={this.props.posts}
                renderItem={this.renderPost}
            />
        )

    }
}