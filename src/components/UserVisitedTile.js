import React, { useState, useEffect } from 'react';

import {
    HStack, Text, Box,
    VStack, Avatar, IconButton
} from "native-base";
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import {
    getUser, getMyUid, unlikePost, likePost
    , getPostById,
    getUserVisited
} from '../utils/FirebaseUtil'
import { TouchableOpacity,  } from 'react-native-gesture-handler';

/* 
prosp: place_id, location (name), navigation
*/


export default function Post(props) {
    const [users, setUsers] = useState(null)
    const [names, setNames] = useState(null)
    const [propics, setPropics] = useState(null)

    useEffect(() => {
        async function getData() {

            var userlist = await getUserVisited(props.place_id)
            var myFd = (await getUser(undefined, false)).following

            // find all fd visited
            var fdVisited = userlist.filter(value =>
                myFd.includes(value)
            );
            setUsers(fdVisited);


            // only need max 2 propics and names
            var propics = []
            var names = []
            for (var i in fdVisited) {
                if (i == 2) break
                var u = await (getUser(fdVisited[i], false))
                names[i] = u.name
                propics[i] = u.propic
            }
            setNames(names)
            setPropics(propics)

        }
        getData()
    }, [])

    return (
        propics && propics.length > 0 &&
        <TouchableOpacity onPress={() => props.navigation.push('LocationProfileFriendPostStack',
            {   location:props.location,
                place_id: props.place_id, friendlist: users
            })} >

            <HStack alignItems='center' justifyContent={'space-between'} py={3}>
                <HStack alignItems='center' >
                    {
                        propics.map(pic => <Avatar mr={2} size={5} source={{ uri: pic }} />)
                    }
                    <Text fontWeight={'bold'} fontSize='sm'>
                        {names.join(', ')}
                    </Text>
                    <Text fontSize='sm'>{"到訪過"}</Text>
                </HStack>

              <Feather name="chevron-right" size={20} color="black" />

            </HStack>

        </TouchableOpacity>

    )
}
