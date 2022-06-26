import React, { useState, useEffect } from 'react';
import {
    View, TouchableWithoutFeedback, Image, TouchableHighlight, TouchableOpacity
} from 'react-native';
import {
    HStack, Text, Box,
    VStack, Avatar
} from "native-base";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import {
    getUser, 
    getUserBookmarked
} from '../utils/FirebaseUtil'

/* 
prosp: place_id
*/


export default function Post(props) {
    const [users, setUsers] = useState(null)
    const [names, setNames] = useState(null)
    const [propics, setPropics] = useState(null)
    const [numpeople, setNumpeople] = useState(0)

    useEffect(() => {
        async function getData() {

            var userlist = await getUserBookmarked(props.place_id)
            var myFd = (await getUser(undefined,false)).following

            // find all fd Bookmarked
            var fdBookmarked = userlist.filter(value =>
                myFd.includes(value)
            );
           


            // only need max 2 propics and names
            var propics = []
            var names = []
            for (var i in fdBookmarked) {
                if (i == 2) break
                var u = await (getUser(fdBookmarked[i],false))
                names[i] = u.name
                propics[i] = u.propic
            }
            setNames(names)
            setPropics(propics)
            setUsers(fdBookmarked);
            setNumpeople(userlist.length )
        }
        getData()
    }, [])

    return (
         numpeople > 0 &&
      

            <HStack alignItems='center' py={2}>
                <Ionicons name='bookmarks-outline' style={{marginRight:8}} size={20} />
                {
                    propics.map(pic => <Avatar mr={2} size={5} source={{ uri: pic }} />)
                }
                {names.length > 0 &&
                    <Text fontSize='sm'><Text fontWeight={'bold'}>{names.join(', ')}</Text>{" 和另外"}
                    </Text>
                }
                <Text fontSize='sm'>{`${numpeople}人已收藏`}</Text>



            </HStack>

       

    )
}
