import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image, TextInput, Button, TouchableHighlight, ImageBackground, Alert } from 'react-native';
import {
    Text, Spinner, IconButton, Avatar,
    VStack, NativeBaseProvider, Box, HStack, ScrollView, FlatList
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getAllRestaurants, getMyUid, getRestaurantsMap, getUser } from '../utils/FirebaseUtil'
import { TouchableOpacity } from 'react-native-gesture-handler';



var { width, height } = Dimensions.get('window')


export default function Maptab({ navigation, route }) {

    const [user, setUsers] = useState(null)
    const [IDSearch, setIDSearch] = useState('')

    async function getData() {
        var dat = await getUser()
        setUsers(dat)
    }
    React.useEffect(() => {
        getData()
    }, [])


    const openUserProfile = (id) => {
        navigation.push('UserProfileStack', {
            userid: id
        })
    }
    const browseBookmark = async () => {
        var u = await getUser(undefined, true) // will delay
        setUsers(u)
        navigation.push('LocationPreviewStack', { locationIDs: u.bookmarks, title: `${user.name}的收藏` })
    }
    const browseFriends = async () => {
        var u = await getUser(undefined, true) // will delay
        setUsers(u)
        navigation.push('UserPreviewStack', { user: u })
    }
    const editProfile = () => {
        navigation.push('UserEditStack')
    }
    const onIDSearch = async () => {
        var searchUser = await getUser(IDSearch, true)

        if (searchUser == undefined) {
            Alert.alert('找不到用戶', '不存在此ID\n(請檢查大小階式空白)')
        } else {
            navigation.push('UserProfileStack', {
                userid: IDSearch
            })
        }
    }
    return (
        <NativeBaseProvider>
            <ScrollView
                flex={1}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustsScrollIndicatorInsets
            >
                <HStack mx={6} mt={4} justifyContent='space-between' alignItems='center' key={1}>
                    <Text fontSize={24} fontWeight='bold'  >帳號</Text>
                    <Text fontSize={12} color='coolGray.400'  >{'ID: ' + getMyUid()}</Text>
                    {/*   <IconButton style={{ width: 50 }} onPress={openMapStack}
                        icon={<Ionicons name="search" size={24} color="black" />} /> */}
                </HStack>

                {/* Usertile */}
                {user && <TouchableOpacity activeOpacity={.8} key={2}
                    onPress={() => openUserProfile(user.uid)}>
                    <HStack flex={1} mx={6} borderTopRightRadius={15} borderTopLeftRadius={15} overflow='hidden' mt={5}
                        borderColor='#d9d9d9' borderWidth={1} alignItems='center' py={5}
                        style={styles.boxshadow}
                    >
                        <Avatar mx='5' size={45} source={{ uri: user.propic, }} />

                        <VStack >
                            <Text fontSize='md' fontWeight='bold' >{user.name}</Text>
                            <Text color='coolGray.500'>{user.friends.length + user.requests.length + ' 追蹤者'}</Text>
                            <Text color='coolGray.500'>{user.post.length + ' 帖子'}</Text>
                        </VStack>

                    </HStack>
                </TouchableOpacity>}

                <TouchableOpacity activeOpacity={.8} key={3}
                    onPress={browseBookmark}>
                    <HStack flex={1} mx={6} overflow='hidden'
                        borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                        style={styles.boxshadow}
                    >
                        <Feather name='bookmark' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                        <Text fontSize='md' fontWeight='bold' >收藏</Text>
                    </HStack>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={.8} key={4}
                    onPress={browseFriends}>
                    <HStack flex={1} mx={6} overflow='hidden' borderBottomRightRadius={15} borderBottomLeftRadius={15} mb={5}
                        borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                        style={styles.boxshadow}
                    >
                        <Feather name='user' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                        <Text fontSize='md' fontWeight='bold' >朋友</Text>
                    </HStack>
                </TouchableOpacity>

                {/* Settings */}
                <HStack mx={6} my={4} justifyContent='space-between' alignItems='center' key={5}>
                    <Text fontSize={24} fontWeight='bold'  >設定</Text>
                </HStack>


                <TouchableOpacity activeOpacity={.8}
                disabled>
                    <HStack flex={1} mx={6} borderTopRightRadius={15} borderTopLeftRadius={15} overflow='hidden' mt={5}
                        borderColor='#d9d9d9' borderWidth={1} alignItems='center' py={2}
                        style={styles.boxshadow}
                    >
                        <Feather name='user-plus' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                        <TextInput placeholder='以ID追蹤朋友'
                            onChangeText={setIDSearch}
                            value={IDSearch}
                            style={{ flex: 1 }} />
                        <IconButton style={{ width: 50 }} onPress={onIDSearch}
                            icon={<Ionicons name="search" size={24} color="black" />} />

                    </HStack>
                </TouchableOpacity>


                <TouchableOpacity activeOpacity={.8} key={7}
                    onPress={editProfile}>
                    <HStack flex={1} mx={6} overflow='hidden' borderBottomRightRadius={15} borderBottomLeftRadius={15} mb={5}
                        borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                        style={styles.boxshadow}
                    >
                        <Feather name='user' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                        <Text fontSize='md' fontWeight='bold' >編輯個人檔案</Text>
                    </HStack>
                </TouchableOpacity>

                <Box h={50} key={8} />
            </ScrollView>
        </NativeBaseProvider>
    );
}


const styles = StyleSheet.create({

    boxshadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 8,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
        backgroundColor: '#fff'
    }
});