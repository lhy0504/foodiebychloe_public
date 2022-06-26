import React from 'react';
import { View, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import {
    FlatList, HStack, Text, Spinner,
    VStack,
} from "native-base";
import { getUserPostsMonthly, getMyUid, getUser } from '../utils/FirebaseUtil'




var { width, height } = Dimensions.get('window')
const startMonthIndex = 12

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export class InfiniteMonthView extends React.Component {
    /* 
    Pass param:
    navigation
    uid
    */
    state = {
        user: null
    }

    async getUserData() {
        var u = await getUser(this.props.uid, false)
        this.setState({ ...this.state, user: u })
    }

    componentDidMount() {
        this.getUserData()
    }

    _renderPage = (info) => {
        if (this.state.user == null) return <></>


        var date = new Date();
        var d = new Date(date.getFullYear(), date.getMonth(), 1);
        d.setMonth(d.getMonth() + info.index - startMonthIndex);

        var isFriend = this.state.user.friends.includes(getMyUid()) || this.state.user.uid == getMyUid()

        return (
            <MonthView
                date={d}
                monthidx={info.index}
                navigation={this.props.navigation}
                uid={this.props.uid}
                isFriend={isFriend}
                allowAdd={this.props.allowAdd} />
        )
    }
    render() {

        var monthIndexList = []
        for (var i = 1; i < startMonthIndex * 2; i++) {
            monthIndexList[i] = i
        }

        return (
            <>
                {this.state.user &&
                      <ImageBackground
                      source={require("./../../assets/gallery_bg.png")}
                      style={{ width: width, height: height }}
                  >
                    <FlatList
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        ref={el => this.list = el}

                        data={monthIndexList}
                        initialScrollIndex={startMonthIndex}
                        keyExtractor={(item, index) => index}

                        getItemLayout={(data, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        windowSize={3}
                        maxToRenderPerBatch={3}
                        initialNumToRender={1}
                        renderItem={this._renderPage}
                        />
                    </ImageBackground>
                    }
            </>
        )
    }
    onLayout() {
        this.list.scrollToIndex({ index: startMonthIndex })
    }
}

class MonthView extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        date: this.props.date,
        data: [],
        loaded: false
    }

    async getData(date) {
        var dat = await getUserPostsMonthly(this.props.date.getFullYear(), this.props.date.getMonth() + 1, this.props.uid)
        this.setState({
            ...this.state,
            data: dat,
            loaded: true
        })
    }

    componentDidMount() {
        this.getData(this.state.date)
    }

    daysInThisMonth(now) {
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }
    shouldComponentUpdate() {
        return !this.state.loaded
    }

    placeholderDayComponent = () => {
        return <View style={{ flex: 1, padding: 2 }}>
        </View>
    }

    emptyDayComponent = (day) => {
        return <TouchableOpacity
            style={{ flex: 1, padding: 2 }}
            onPress={() => this.viewPost(day)}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#d9d7cf', opacity:0.75 }}>
                    <Text style={{
                        backgroundColor: this.isToday(day) ? '#FF9636' : '#6F6F71',
                        textAlign: 'center',
                        color: '#d5d3ca'
                    }}>{day}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    viewPost = (day, posts=[]) => {
       
        // give date in case posts is empty
        var date = this.state.date
        date.setDate(day)
        this.props.navigation.push('DayPostsModal', {
            posts: posts,
            date: date.toLocaleDateString('en-US'),
            allowAdd: this.props.allowAdd
        })
    }

    day = new Date()
    isThisYear = this.props.date.getFullYear() == this.day.getFullYear()
    isThisMonth = this.props.date.getMonth() == this.day.getMonth()
    isToday = (day) => {
        if (!this.isThisYear) return false
        if (!this.isThisMonth) return false
        return day == this.day.getDate()
    }

    render() {

        var thisdate = this.props.date
        var weekList = [[]]
        var weekIdx = 0
        for (var i = 1; i <= this.daysInThisMonth(this.state.date); i++) {
            thisdate.setDate(i)
            if (thisdate.getDay() == 0 && i != 1) {
                weekIdx++;
                weekList[weekIdx] = [i]
            } else {
                weekList[weekIdx].push(i)
            }
        }
        var currSearchId = 0

        thisdate.setDate(1)
        var placeholderBefore = thisdate.getDay()
        thisdate.setDate(this.daysInThisMonth(this.state.date))
        var placeholderAfter = 6 - thisdate.getDay()

        return (
            <View>
                {/*  Header Bar  */}
                <HStack alignItems='center' justifyContent='space-between'
                    style={{ height: 80 }}
                >
                    <VStack>
                        <HStack>
                            <Text ml={5} fontSize={30} style={{ fontFamily: 'sans-serif-light', color: '#EEECE3' }}>
                                {months[this.props.date.getMonth()]}
                            </Text>
                            {!this.state.loaded && <Spinner />}
                        </HStack>

                        {!this.isThisYear &&
                            <Text ml={5} fontSize={10} style={{ fontFamily: 'sans-serif-light', color: '#EEECE3' }}>{this.props.date.getFullYear()}</Text>}
                    </VStack>


                </HStack>
                {
                    weekList.map((week, weekindex) => {
                        return <View
                            style={{
                                width: width,
                                height: height / (weekList.length + 1.5),
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            { //put empty box before 1st
                                (weekindex == 0) &&
                                [...Array(placeholderBefore)].map(this.placeholderDayComponent)
                            }
                            {
                                week.map((day) => {
                                   
                                    if (this.state.data.length > 0) {

                                        while (currSearchId < this.state.data.length) {
                                            if (this.state.data[currSearchId].dateObj.getDate() == day) {
                                                //check post visible to user
                                                if ((this.state.data[currSearchId].publicOrFriends == 'friends' && !this.props.isFriend)
                                                ) {
                                                    currSearchId++
                                                    continue
                                                } 

                                                var id = currSearchId
                                                currSearchId++

                                                /* 
                                                Get all post on the day
                                                */  
                                                 let posts=[]
                                                for (let i = id; i < this.state.data.length; i++) {
                                                    if (this.state.data[i].dateObj.getDate() == day) {
                                                        posts.push(this.state.data[i])
                                                    } else if (this.state.data[i].dateObj.getDate() > day) {
                                                        break
                                                    }
                                                } 
                                                return (
                                                    <TouchableOpacity
                                                        style={{ flex: 3, padding: 2 }}
                                                        onPress={() => this.viewPost(day, posts)}>
                                                        <ImageBackground
                                                            resizeMode='cover'
                                                            source={{ uri: this.state.data[id].image[0] }}
                                                            style={{ flex: 1, height: '100%' }}
                                                        />
                                                    </TouchableOpacity>
                                                )

                                            } else if (this.state.data[currSearchId].dateObj.getDate() < day) {
                                                currSearchId++
                                            } else {
                                                break
                                            }

                                        }
                                        return this.emptyDayComponent(day)
                                    } else {
                                        return this.emptyDayComponent(day)
                                    }

                                })
                            }
                            { //put empty box after
                                (weekindex == weekList.length - 1) &&
                                [...Array(placeholderAfter)].map(this.placeholderDayComponent)
                            }

                        </View>

                    })
                }

            </View>)
    }
}
