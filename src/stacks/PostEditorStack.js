import React, { useState } from 'react';
import {
    Dimensions, View, Image, TextInput, StyleSheet, TouchableOpacity
    , ScrollView, Alert
} from 'react-native';
import {
    HStack, IconButton, Box,
    Text,
    Button, NativeBaseProvider
} from 'native-base';
import StarRating from 'react-native-star-rating';
import { Feather } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import Dots from 'react-native-dots-pagination';
import DateTimePicker from '@react-native-community/datetimepicker';
import Autocomplete from 'react-native-autocomplete-input'
import { getAuth } from 'firebase/auth';
import { uploadPost } from '../utils/FirebaseUtil'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height

export default function ImageEditorStack({ navigation, route }) {

    const [page, setPage] = useState(0)
    const [post, setPost] = useState(initState())

    function initState() {
        if (route.params.reeditindex !== undefined) {
            var obj = JSON.parse(JSON.stringify(route.params.post))
            obj.image[route.params.reeditindex] = route.params.images[route.params.reeditindex]

            //
            if (Array.isArray(obj.with)) {
                obj.with = obj.with.join(', ')
            }
            if (Array.isArray(obj.hashtag)) {
                obj.hashtag = obj.hashtag.join(' ')
            }
            return obj
        } else {

            // If edit, also apply to DayPostModal.js and StoryStack
            return {
                userid: getAuth().currentUser.email,
                image: route.params.images,
                yummystar: Array(route.params.images.length).fill(0),

                title: Array(route.params.images.length).fill(''),
                description: Array(route.params.images.length).fill(''),
                price: Array(route.params.images.length).fill(0),
                date: new Date().toLocaleDateString('en-US'),
                location: '',
                place_id: '',
                with: '',
                tag: '',
                likes: [],
                hashtag: '',
                comment: [],
                overallprice: 0,
                overallyummy: 0,
                overallenv: 0,
                overalltitle: '',
                overalldescription: ''
            }
        }
    }
    const [dateopen, setDateopen] = useState(false)
    const [locationSuggestion, setLocationSuggestion] = useState([])
    const [hidelocationSuggestion, setHideLocationSuggestion] = useState(true)
    function setYummyStar(index, value) {
        var update = post.yummystar
        update[index] = value
        setPost({ ...post, yummystar: update })
    }

    function setPrice(index, value) {
        var update = (post.price)
        update[index] = parseFloat(value)
        setPost({ ...post, price: update })
    }
    function setTitle(index, value) {
        var update = post.title
        update[index] = value
        setPost({ ...post, title: update })
    }
    function setDescription(index, value) {
        var update = post.description
        update[index] = value
        setPost({ ...post, description: update })
    }

    const pager = React.useRef()


    /* Re-editing, deleting and adding images */
    function reedit() {
        Image.getSize(post.image[page - 1], (w, h) => {
            navigation.navigate('ImageEditorStack', {
                uri: post.image[page - 1],
                post: post,
                reeditindex: page - 1,
                width: w,
                height: h,
                goBacktoPostEditoronBack: true
            })
        })

    }
    function retakepic() {

        navigation.navigate('AddMediaStack', {
            uri: post.image[page - 1],
            post: post,
            reeditindex: page - 1,
        })

    }
    function addPage() {
        navigation.navigate('AddMediaStack', {
            uri: post.image[page - 1],
            post: post,
            reeditindex: post.image.length,
        })
    }
    function delPage(index = page - 1) {
        var yummystar = post.yummystar; // make a separate copy of the array
        var title = post.title; // make a separate copy of the array
        var description = post.description; // make a separate copy of the array
        var price = post.price; // make a separate copy of the array
        var image = post.image; // make a separate copy of the array

        yummystar.splice(index, 1);
        title.splice(index, 1);
        description.splice(index, 1);
        price.splice(index, 1);
        route.params.images.splice(index, 1);

        setPost({
            ...post,
            yummystar: yummystar,
            title: title,
            description: description,
            price: price,
            image: route.params.images.map(a => ({ ...a })) //deep clone
        });
    }
    async function submitPost() {

        //isupdate?
        if (post.publicOrFriends) {
            navigation.replace('LoadingStack2')
            await uploadPost(post, post.publicOrFriends)
            navigation.replace("MainScreen", { screen: "GalleryTab" })
            return
        }
        Alert.alert(
            "發佈貼文",
            "請設定貼文的私隱度 :",
            [
                {
                    text: "取消",
                    onPress: () => { },
                    style: "destructive",
                },
                {
                    text: "公開", onPress: async () => {
                        navigation.replace('LoadingStack2')
                        console.log(1)
                        await uploadPost(post, 'public')
                        console.log(2)
                        navigation.replace("MainScreen", { screen: "GalleryTab" })
                    }
                },
                {
                    text: "僅朋友", onPress: async () => {
                        navigation.replace('LoadingStack2')
                        await uploadPost(post, 'friends')
                        navigation.replace("MainScreen", { screen: "GalleryTab" })
                    }
                }
            ],

        );

    }
    return (
        <NativeBaseProvider>

            {/*  Header Bar  */}
            <View style={{
                height: 45,
                zIndex: 6
                , elevation: 6
            }}>
                <HStack alignItems='center' justifyContent='space-between'
                    borderBottomWidth='1px' borderBottomColor='coolGray.300'
                    backgroundColor='white' px={3}
                >
                    <IconButton
                        onPress={addPage}
                        icon={<Feather name="plus-square" size={24} color="black" />} />
                    <Text fontSize='lg' textAlign='center'>撰寫貼文</Text>
                    <IconButton
                        onPress={submitPost}
                        icon={<Feather name="send" size={24} color="black" />} />
                </HStack>
            </View>



            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
                {/* Pagination */}

                <Box height={30} pt={3} backgroundColor='#ff9636'>
                    <Dots paddingVertical={13}
                        passiveColor='#dddddd' length={route.params.images.length + 2} active={page} />
                </Box>

                <Box height={height - 75} backgroundColor='#ff9636'>
                    <PagerView style={{ flex: 1, margin: 20, padding: 50 }} pageMargin={5}
                        initialPage={route.params.reeditindex === undefined ? 0 : route.params.reeditindex + 1}
                        onPageSelected={e => setPage(e.nativeEvent.position)}
                        ref={pager}>

                        {/* Cover PAge */}
                        <View key={999}
                            style={{
                                backgroundColor: 'white',
                                padding: 20,
                                // justifyContent: 'center',
                                height: 400,
                                borderRadius: 20
                            }}
                        >

                            <HStack alignItems='center' >
                                <Feather name="map-pin" size={16} color='#FF9636' />

                                <View style={{ width: width - 80 }}>
                                    <View style={styles.autocompleteContainer}>
                                        <Autocomplete
                                            onBlur={() => setHideLocationSuggestion(true)}
                                            inputContainerStyle={{ borderWidth: 0 }}
                                            hideResults={hidelocationSuggestion}
                                            placeholder="地點"
                                            data={locationSuggestion}
                                            value={post.location}
                                            onChangeText={(text) => {
                                                setPost({
                                                    ...post,
                                                    location: text,
                                                    place_id: '',
                                                    address: ''
                                                })
                                                fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBParPaZC61CNm5ouh-4vt9aloKsmTVCCQ&components=country%3Ahk&types=restaurant|cafe|bar|bakery|meal_takeaway&language=zh-HK&input=' + text)
                                                    .then((response) => response.json())
                                                    .then((responseJson) => {
                                                        setLocationSuggestion(responseJson.predictions)
                                                        setHideLocationSuggestion(false)
                                                    })
                                            }}
                                            flatListProps={{
                                                keyboardShouldPersistTaps: 'handled',
                                                keyExtractor: (_, idx) => idx,
                                                style: {
                                                    borderWidth: 1,
                                                    borderTopWidth: 0,
                                                    borderColor: '#A2A2A2',
                                                    backgroundColor: 'white'
                                                },
                                                renderItem: ({ item }) =>
                                                    <TouchableOpacity onPress={() => {
                                                        setPost({
                                                            ...post,
                                                            location: item.structured_formatting.main_text,
                                                            place_id: item.place_id,
                                                            address: item.structured_formatting.secondary_text
                                                        })
                                                        setHideLocationSuggestion(true)
                                                    }}
                                                        style={{
                                                            paddingLeft: 5,
                                                            paddingTop: 3,
                                                            paddingBottom: 3,
                                                            borderTopWidth: 1,
                                                            borderColor: '#A2A2A2',
                                                            backgroundColor: 'white'
                                                        }}>
                                                        <Text fontWeight='bold'>{item.structured_formatting.main_text}</Text>
                                                        <Text>{item.structured_formatting.secondary_text}</Text>
                                                    </TouchableOpacity>
                                            }}
                                        />

                                    </View>
                                    <View>
                                        <Text> </Text>{/* Dont delete this placeholder */}
                                    </View>
                                </View>
                            </HStack>
                            <TouchableOpacity style={{ justifyContent: 'center', marginTop: 17, marginBottom: 15 }}
                                onPress={() => setDateopen(true)}>
                                <Text color='coolGray.400'>
                                    <Feather name="calendar" size={16} color="#ff9636" />
                                    {" "}{typeof (post.date) == 'string' ? post.date : post.date.toLocaleDateString('en-US')}
                                </Text>

                            </TouchableOpacity>

                            {dateopen && <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(post.date)}
                                onChange={(event, selectedDate) => {
                                    setDateopen(false)
                                    const currentDate = selectedDate || date;
                                    setPost({ ...post, date: currentDate.toLocaleDateString('en-US') });
                                }}
                            />}
                            <TextInput
                                placeholder="標題"
                                style={{ fontWeight: 'bold' }}
                                defaultValue={post.overalltitle}
                                onChangeText={text => setPost({ ...post, overalltitle: text })}
                            />
                            <TextInput
                                placeholder="介紹" multiline={true}
                                defaultValue={post.overalldescription}
                                onChangeText={text => setPost({ ...post, overalldescription: text })}
                            />
                            <HStack alignItems='center' mt={4}>
                                <Feather name="users" size={16} color='#FF9636' />
                                <TextInput
                                    placeholder="和誰在一起..."
                                    defaultValue={post.with}
                                    multiline={true}
                                    onChangeText={text => setPost({ ...post, with: text })}
                                    style={{ marginLeft: 3 }}
                                />
                            </HStack>
                            <HStack alignItems='center' mt={4} >
                                <Feather name="tag" size={16} color='#FF9636' />
                                <TextInput
                                    placeholder="#tags"
                                    defaultValue={post.tag}
                                    multiline={true}
                                    onChangeText={text => setPost({ ...post, tag: text })}
                                    style={{ color: "#458eff", fontWeight: 'bold', marginLeft: 3 }}
                                />
                            </HStack>

                            <Text mt={4} fontSize='lg' fontWeight='bold'>餐廳整體的...</Text>
                            <HStack mt={4} justifyContent='space-between' alignItems='center'>
                                <Text fontWeight='bold' color='coolGray.500'>🛎️ 味道</Text>
                                <StarRating
                                    fullStarColor='#ff9636'
                                    rating={post.overallyummy}
                                    selectedStar={(rating) => setPost({ ...post, overallyummy: rating })}
                                />
                            </HStack>
                            <HStack mt={4} justifyContent='space-between' alignItems='center'>
                                <Text fontWeight='bold' color='coolGray.500'>🤑 價錢</Text>
                                <StarRating
                                    fullStarColor='#ff9636'
                                    rating={post.overallprice}
                                    selectedStar={(rating) => setPost({ ...post, overallprice: rating })}
                                />
                            </HStack>
                            <HStack mt={4} mb={8} justifyContent='space-between' alignItems='center'>
                                <Text fontWeight='bold' color='coolGray.500'>🕯️ 環境</Text>
                                <StarRating
                                    fullStarColor='#ff9636'
                                    rating={post.overallenv}
                                    selectedStar={(rating) => setPost({ ...post, overallenv: rating })}
                                />
                            </HStack>
                        </View>


                        {/*  Canvas */}
                        {
                            route.params.images.map((item, index) => (
                                <View key={index}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 20,
                                        // justifyContent: 'center',
                                        borderRadius: 20
                                    }}>

                                    {/* Edit buttons */}
                                    <View style={styles.container}>
                                        <TouchableOpacity style={styles.buttonStyle}
                                            onPress={() => delPage()}>
                                            <Feather name="x" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.container2}>
                                        <TouchableOpacity style={styles.buttonStyle2}
                                            onPress={() => reedit()}>
                                            <Feather name="edit-2" size={17} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.container3}>
                                        <TouchableOpacity style={styles.buttonStyle2}
                                            onPress={retakepic}>
                                            <Feather name="image" size={17} color="black" />
                                        </TouchableOpacity>
                                    </View>


                                    {/* Image */}
                                    <Image resizeMode='contain'
                                        style={{ width: null, height: 200 }}
                                        source={{ uri: item }} />
                                    <HStack mt={5} justifyContent='space-between' alignItems='center'>
                                        <Text fontWeight='bold' color='coolGray.500'>🛎️ 美味指數</Text>
                                        <StarRating
                                            style={{ width: 200 }}
                                            fullStarColor='#ff9636'
                                            rating={post.yummystar[index]}
                                            selectedStar={(rating) => setYummyStar(index, rating)}
                                        />
                                    </HStack>

                                    <TextInput
                                        placeholder="標題"
                                        style={{ fontWeight: 'bold' }}
                                        defaultValue={post.title[index]}
                                        onChangeText={text => setTitle(index, text)}
                                    />
                                    <TextInput
                                        placeholder="$$"
                                        keyboardType="numeric"
                                        defaultValue={post.price[index]}
                                        onChangeText={text => setPrice(index, text)}
                                    />
                                    <TextInput
                                        placeholder="說明..."
                                        defaultValue={post.description[index]}
                                        multiline={true}
                                        onChangeText={text => setDescription(index, text)}
                                    />

                                </View>
                            ))
                        }
                        <View key={88}
                            style={{
                                backgroundColor: 'white',
                                padding: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20
                            }}>
                            <IconButton
                                onPress={addPage}
                                icon={<Feather name="plus-square" size={24} color="black" />} />
                        </View>

                    </PagerView>
                </Box>




            </ScrollView>
        </NativeBaseProvider>
    );
}


/* Styles for floating button */
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 15,
        top: 15,
        justifyContent: 'center',
        alignItems: 'center', zIndex: 9, elevation: 9
    },
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#E13C17',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container2: {
        position: 'absolute',
        right: 15,
        top: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9, elevation: 9
    },
    buttonStyle2: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container3: {
        position: 'absolute',
        right: 15,
        top: 105,
        justifyContent: 'center',
        alignItems: 'center', zIndex: 9, elevation: 9
    },
    autocompleteContainer: {

        left: 0,
        position: 'absolute',
        right: 0,
        top: -9,
        zIndex: 1,


    }
});