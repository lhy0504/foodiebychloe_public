import React, { useState, useEffect } from 'react';
import { View, RefreshControl, Alert, Dimensions, ImageBackground, } from 'react-native';
import {
    FlatList, HStack, IconButton, Text,  Box,
    VStack, NativeBaseProvider, Avatar
} from "native-base";
import Image from '../components/Image';

import { Feather, Entypo, Ionicons } from '@expo/vector-icons';
import { getUserPosts, getUser, followUser, getMyUid, blockUser, unblockUser, getFoodieScore } from '../utils/FirebaseUtil'
import Post from '../components/Post'
import { InfiniteMonthView } from '../components/InfiniteMonthView'
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
import ConfettiCannon from 'react-native-confetti-cannon';

/* props: userid */
var { width, height } = Dimensions.get('window')

function Feed(props) {
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    async function getData() {
        setRefreshing(true);
        var dat = await getUserPosts(props.userid, true)
        setData(dat)

        setRefreshing(false);
    }

    useEffect(() => {
        getData()
    }, [])

    return (

        <VStack backgroundColor='white' >
            <FlatList
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={1000}
                initialNumToRender={5}
           
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getData}
                    />
                }
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={({ item, index }) => (

                    <Post postid={item.id} index={index} navigation={props.navigation} explode={props.explode}/>
                )}
                ListHeaderComponent={
                    <Header userid={props.userid} navigation={props.navigation} />

                }
            />
        </VStack>




    );
}
function Header(props) {
    const [user, setUser] = useState({ friends: [], requests: [], following: [] })
    const [myself, setMyself] = useState({ friends: [], requests: [], following: [] })
    const [score, setScore] = useState(0)

    async function getData() {
        var u = await getUser(props.userid, true)
        setUser(u)
        var u = await getUser(getMyUid())
        setMyself(u)

        var fdScore = await getFoodieScore()
        if (fdScore.hasOwnProperty(props.userid)) setScore(fdScore[props.userid])
    }

    useEffect(() => {
        getData()
    }, [])

    const browseBookmark = () => {
        props.navigation.push('LocationPreviewStack', { locationIDs: user.bookmarks, title: `${user.name}的收藏` })
    }
    const browseFriends = () => {
        props.navigation.push('UserPreviewStack', { user: user })

    }
    const browseSocial = () => {
        props.navigation.navigate('SocialTab')

    }
    return <VStack >
        <ImageBackground
            source={require("./../../assets/gallery_bg.png")}
            style={{ width: width }}>
            <VStack>
                <HStack pt={3} px={6} justifyContent='space-between' alignItems={'center'}>
                    <Avatar size={16} source={{ uri: user.propic, }} />

                    <TouchableOpacity onPress={browseFriends}>
                        <HStack justifyContent={'flex-end'} >
                            <VStack mr={6}
                                alignItems='center' justifyContent='flex-end'>
                                <Text color='white'>粉絲</Text>
                                <Text color='white' fontWeight='bold' fontSize='xl'>{user.friends.length + user.requests.length}</Text>
                            </VStack>
                            <VStack
                                alignItems='center' justifyContent='flex-end'>
                                <Text color='white'>他追蹤中</Text>
                                <Text color='white' fontWeight='bold' fontSize='xl'>{user.following.length}</Text>
                            </VStack>
                        </HStack>

                    </TouchableOpacity>
                </HStack>
                <HStack justifyContent={'space-between'} mx={6} my={2} alignItems='center'>
                    <Text fontWeight={'bold'} fontSize={16} color='white'>{user.name}</Text>
                    {
                        props.userid != getMyUid() && (user.friends.includes(getMyUid())
                            ?

                            <View style={{
                                borderColor: "#d1d5db", borderRadius: 5,
                                borderWidth: 1, padding: 5,

                            }}>
                                <Text textAlign='center' fontSize='sm' color='white'
                                    width='100'>朋友</Text>
                            </View>

                            :
                            (user.requests.includes(getMyUid())
                                ?

                                <View style={{
                                    borderColor: "#d1d5db", borderRadius: 5,
                                    borderWidth: 1, padding: 5,

                                }}><TouchableOpacity>
                                        <Text textAlign='center' fontSize='sm' color='white'
                                            width='100'>追蹤中</Text></TouchableOpacity>
                                </View>

                                :
                                (myself.requests.includes(props.userid)
                                    ?
                                    <View style={{
                                        borderColor: "#d1d5db", borderRadius: 5,
                                        borderWidth: 1, padding: 5,

                                    }}>
                                        <TouchableOpacity onPress={async () => { await followUser(props.userid); getData(); }}>
                                            <Text textAlign='center' fontSize='sm' color='white'
                                                width='100'>接受追蹤請求</Text></TouchableOpacity>
                                    </View>

                                    :
                                    <View style={{
                                        borderColor: "#d1d5db", borderRadius: 5,
                                        borderWidth: 1, padding: 5,

                                    }}>
                                        <TouchableOpacity onPress={async () => { await followUser(props.userid); getData(); }}>
                                            <Text textAlign='center' fontSize='sm' color='white'
                                                width='100'>要求追蹤</Text></TouchableOpacity>
                                    </View>
                                )
                            ))
                    }
                </HStack>
                {user.status && <Text mx={6} mb={2} fontSize={16} color='white'>{user.status}</Text>}
            </VStack>
        </ImageBackground>

        <HStack justifyContent={'center'} alignItems={'flex-end'}>
            {user.hasOwnProperty('bookmarks') && <TouchableHighlight style={{ flex: 1 }}
                activeOpacity={1} underlayColor="#e6e6e6" onPress={browseBookmark}>
                <VStack alignItems={'center'} py={4} px={4}>
                    <Feather name={'bookmark'} size={35} color='#555' />
                    <Text color='#555' fontSize={'xs'}>  {`他的收藏 (${user.bookmarks.length || 0})`} </Text>
                </VStack>

            </TouchableHighlight>}
            {props.userid != getMyUid() && <TouchableHighlight style={{ flex: 1 }}
                activeOpacity={1} underlayColor="#e6e6e6" onPress={browseSocial}>
                <VStack alignItems={'center'} py={4} px={4}>
                    <Text fontSize={24}>{score}</Text>
                    <Text color='#555' fontSize={'xs'}>  {`foodieScore`} </Text>
                </VStack>

            </TouchableHighlight>}
        </HStack>
    </VStack>
}
export default class GalleryTab extends React.Component {
    constructor(props) {
        super(props)
        this.explosion = React.createRef()
    }
    state = {
        viewStyle: 'large',
        user: null
    }
    explode=()=>{
        this.explosion.current.start()
    }
    async getData() {
        /* Check block */
        var me = await getUser(undefined, true)
        if (me.block.includes(this.props.route.params.userid)) {
            Alert.alert(
                '已封鎖用戶', '解除封鎖?',
                [
                    {
                        text: "解除封鎖", onPress: () => {
                            unblockUser(this.props.route.params.userid)
                            Alert.alert("已解除封鎖")
                        }
                    },
                    {
                        text: "返回",
                        onPress: () => { this.props.navigation.goBack() },
                        style: "cancel",
                    },
                ],

            );
        }
        /* check block end */

        console.log(this.props.route.params)
        var u = await getUser(this.props.route.params.userid, true)
        this.setState({ ...this.state, user: u })
    }

    componentDidMount() {
        this.getData()
    }

    changeViewStyle() {
        this.setState({
            ...this.state,
            viewStyle: this.state.viewStyle == 'large' ? 'small' : 'large'
        });
    }

    block = () => {
        Alert.alert(
            '封鎖用戶?', '你將不會再看到他的帖子',
            [
                {
                    text: "封鎖", onPress: () => {
                        blockUser(this.props.route.params.userid)
                        Alert.alert("已封鎖")
                    }
                },
                {
                    text: "取消",
                    onPress: () => { },
                    style: "cancel",
                },
            ],

        );
    }

    render() {
        return (
            <NativeBaseProvider>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/*  Header Bar  */}
                    <View style={{
                        height: 50
                    }}>
                        <HStack alignItems='center' justifyContent='space-between'
                            borderBottomWidth={2} borderBottomColor='#ff9636'
                            backgroundColor='white' height='50px' px={2}
                        >
                            <HStack alignItems={'center'}>
                                <IconButton onPress={() => this.props.navigation.goBack()}
                                    icon={<Ionicons name="ios-chevron-back" size={24} color="black" />} />
                                {this.state.user &&
                                    <>
                                        <Image source={{ uri: this.state.user.propic }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                                        <Text fontWeight='bold' color='black' fontSize='sm'>  {this.state.user.name}</Text>
                                    </>
                                }
                            </HStack>
                            <HStack>
                                <IconButton onPress={this.changeViewStyle.bind(this)} mr={2}
                                    icon={this.state.viewStyle == 'small' ?
                                        <Ionicons name="list" size={24} color="black" />
                                        : <Ionicons name="calendar" size={24} color="black" />} />
                                {this.props.route.params.userid != getMyUid() &&
                                    <IconButton onPress={this.block}
                                        icon={<Entypo name="block" size={24} color="black" />} />
                                }
                            </HStack>
                        </HStack>
                    </View>

                    {
                        this.state.viewStyle == 'large' ?
                            <Feed navigation={this.props.navigation}
                                userid={this.props.route.params.userid}
                                viewStyle={this.state.viewStyle} 
                                explode={this.explode}/>
                            :
                            <View style={{
                                flex: 1,
                                backgroundColor: '#3f3f40'
                            }}>
                                <InfiniteMonthView
                                    navigation={this.props.navigation}
                                    uid={this.props.route.params.userid}
                                />
                            </View>
                    }

                </View>
                <ConfettiCannon
                    count={80} fallSpeed={2000}
                    origin={{ x: -20, y: 0 }}
                    autoStart={false}
                    fadeOut
                    ref={this.explosion}
                />
            </NativeBaseProvider>
        );
    }
}

