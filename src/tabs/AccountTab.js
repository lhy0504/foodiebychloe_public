import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Share, TextInput, Button, TouchableOpacity, ImageBackground, Alert, Linking } from 'react-native';
import {
    Text, Spinner, IconButton, Avatar,
    VStack, NativeBaseProvider, Box, HStack, ScrollView, FlatList
} from "native-base";
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { getAllRestaurants, getMyUid, getRestaurantsMap, getUser, getUsersByName } from '../utils/FirebaseUtil'
import NotificationButton from '../components/NotificationButton'



var { width, height } = Dimensions.get('window')


export default function Maptab({ navigation, route }) {

    const [user, setUsers] = useState(null)
    const [IDSearch, setIDSearch] = useState('')
    const [nameSearch, setNameSearch] = useState('')

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

        navigation.push('LocationPreviewStack', { showBookmarks: true, title: `我的收藏` })
    }
    const browseCalendar = () => {

        navigation.push('GalleryTab')
    }
    const browseSocial = () => {

        navigation.push('SocialTab')
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
    const onNameSearch = async () => {
        var searchUsers = await getUsersByName(nameSearch)


        navigation.push('UserSearchPreviewStack', {
            users: searchUsers
        })


    }
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: '在foodieByChloe加我為朋友！\n名字: ' + user.name,

            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {

        }
    };
    return (
        <NativeBaseProvider>
            <ImageBackground
                source={require("./../../assets/Rice.png")}
                style={{flex:1}}
            >
                <ScrollView
                    flex={1}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustsScrollIndicatorInsets
                >
                    <HStack mx={6} mt={4} justifyContent='space-between' alignItems='center' key={1}>
                        <Text fontSize={24} fontWeight='bold'  >帳號</Text>
                        <NotificationButton navigation={navigation} />
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
                    <TouchableOpacity activeOpacity={.8} key={'cal'}
                        onPress={browseCalendar}>
                        <HStack flex={1} mx={6} overflow='hidden'
                            borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                            style={styles.boxshadow}
                        >
                            <Feather name='calendar' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                            <Text fontSize='md' fontWeight='bold' >月曆</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} key={'social'}
                        onPress={browseSocial}>
                        <HStack flex={1} mx={6} overflow='hidden'
                            borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                            style={styles.boxshadow}
                        >
                            <Feather name='users' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                            <Text fontSize='md' fontWeight='bold' >和朋友的foodieScore</Text>
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



                    <TouchableOpacity activeOpacity={.8} key={6}
                        disabled>
                        <HStack flex={1} mx={6} borderTopRightRadius={15} borderTopLeftRadius={15} overflow='hidden' mt={5}
                            borderColor='#d9d9d9' borderWidth={1} alignItems='center' py={2}
                            style={styles.boxshadow}
                        >
                            <Feather name='user-plus' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                            <TextInput placeholder='以名稱追蹤朋友'
                                onChangeText={setNameSearch}
                                value={nameSearch}
                                style={{ flex: 1 }} />
                            <IconButton style={{ width: 50 }} onPress={onNameSearch}
                                icon={<Ionicons name="search" size={24} color="black" />} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} key={7}
                        onPress={onShare}>
                        <HStack flex={1} mx={6} overflow='hidden'
                            borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                            style={styles.boxshadow}
                        >
                            <Feather name='share-2' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                            <Text fontSize='md' fontWeight='bold' >在外部分享</Text>
                        </HStack>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.8} key={8}
                        onPress={editProfile}>
                        <HStack flex={1} mx={6} overflow='hidden' borderBottomRightRadius={15} borderBottomLeftRadius={15} mb={5}
                            borderColor='#d9d9d9' borderWidth={1} borderTopWidth={0} alignItems='center' py={2.5}
                            style={styles.boxshadow}
                        >
                            <Feather name='user' size={24} style={{ margin: 5, marginHorizontal: 15, marginLeft: 25 }} />
                            <Text fontSize='md' fontWeight='bold' >編輯個人檔案</Text>
                        </HStack>
                    </TouchableOpacity>
                    <Text mt={9} style={{ alignSelf: 'center', fontFamily: 'sans-serif-light', color: 'black', marginBottom: 18 }}
                    >ғᴏᴏᴅɪᴇ ʙʏ ᴄʜʟᴏᴇ🍺</Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/foodiebychloe/')}>
                        <HStack alignItems='center' justifyContent={'center'}>
                            <Feather name='instagram' style={{ marginRight: 8 }} size={20} />
                        </HStack>
                    </TouchableOpacity>

                    <View style={{ height: 80 }} key={98} />
                </ScrollView>
            </ImageBackground>
        </NativeBaseProvider>
    );
}


const styles = StyleSheet.create({

    boxshadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 8,
        backgroundColor: '#fff',
        overflow: 'visible',
    }
});