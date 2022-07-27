import React, { useState, useEffect } from 'react';
import {
    View, Image, TouchableHighlight
} from 'react-native';
import {
    HStack, Text,
    VStack
} from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import {
    getUser, getMyUid
} from '../utils/FirebaseUtil'
import LocationButton from '../components/LocationButton'
import StarRating from 'react-native-star-rating';


export default function Post(props) {

    var post = props.post
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function getData() {
            /* Check block */
            var me = await getUser(undefined, false)
            if (me.block.includes(post.userid)) return
            /* check block end */

            var u = await getUser(post.userid, false)
            setUser(u);
        }
        getData()
    }, [])

    return (
        user &&
        (post.publicOrFriends == 'friends' && user.friends.includes(getMyUid())
            || post.userid == getMyUid()
            || post.publicOrFriends == 'public'
        )
        && <TouchableHighlight activeOpacity={1} underlayColor="#e6e6e6"
            onPress={() => props.navigation.push('StoryStack', { post: post, currImg: 0 })} >
            <VStack mx={5} py={3} borderBottomWidth={1} borderBottomColor='coolGray.300'>
                
                <HStack justifyContent='space-between' alignItems='center' mb={1}>
                {post.overalltitle != '' ?
                    <Text fontSize={'lg'} fontWeight={'bold'}
                        flexWrap='wrap' flex={1}
                    >{post.overalltitle}</Text>
                    :
                    <View />
                }

                    {post.overallyummy != 0 && <StarRating
                        fullStarColor='#ff9636'
                        rating={post.overallyummy}
                        starSize={18}
                    />
                    }

                </HStack>

                {post.overalldescription != '' && <Text numberOfLines={3} >{post.overalldescription}</Text>}
                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }} >
                    {post.image.map(
                        img => (<View style={{ flexBasis: '33%', padding: 2 }}>
                            <Image source={{ uri: img }} style={{ height: 100, width: '100%', }} />
                        </View>
                        )
                    )}
                </View>

                <HStack justifyContent={'space-between'} alignItems='center'>
                    <HStack alignItems='center' mt={1} pl={1}>
                        {post.likes.length != 0 &&
                            <Text fontSize='xs' color='coolGray.500' mr={2}>
                                <AntDesign name={"like2"} size={12} color='#888' />
                                {" " + post.likes.length}</Text>}
                        {post.comment.length != 0 &&
                            <Text fontSize='xs' color='coolGray.500' >
                                <Ionicons name={"chatbox-outline"} size={12} color='#888' />
                                {" " + post.comment.length}</Text>}
                    </HStack>
                    <HStack justifyContent={'flex-end'} alignItems='center'>
                        <Text fontSize='xs' color='coolGray.500' textAlign='center'>{user.name}</Text>
                        <Text color='coolGray.500' fontSize='xs' textAlign='center'>{"  "}{post.date}  {post.time}</Text>
                    </HStack>
                </HStack>
            </VStack>
        </TouchableHighlight>

    )
}
