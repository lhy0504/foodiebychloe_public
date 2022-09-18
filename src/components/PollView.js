import React, { useEffect } from 'react';
import {  TextInput ,Animated,View} from 'react-native';
import { HStack, IconButton, VStack, Text,Box } from 'native-base';
import { getDishPollByRestaurant, pollDish, getDishPollByUser, } from '../utils/FirebaseUtil';

import { Feather, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function P(props) {

    const [choices, setChoices] = React.useState([{ id: 'New', choice: '+ 新菜式...', votes: '' }])
    const [showNewDishInput, setShowNewDishinput] = React.useState(false)
    const [newDishInput, setNewDishInput] = React.useState('')
    const [totalVotes, setTotalVotes] = React.useState(0)

    const [myVote, setMyVote] = React.useState(null)
    useEffect(() => {
        getChoices()
    }, [])

    const getChoices = async () => {
        var c = await getDishPollByRestaurant(props.id)
        var out = []
        var totalCount = 0
        for (var i in c) {
            totalCount += c[i]
            out.push({ id: i, choice: i, votes: c[i] })
        }
       
        out.sort((a,b)=>a.votes<b.votes)
        out.push({ id: 'New', choice: '+ 新菜式...', votes: '' })

        setChoices(out)
        setTotalVotes(totalCount)

        /* get my vote */
        var my = await getDishPollByUser(props.id)
        setMyVote(my)


    }
    const onSelect = async (selectedChoice) => {
        if (selectedChoice == '+ 新菜式...') {
            setShowNewDishinput(true)
        } else {
            await pollDish(props.id, selectedChoice,myVote)
            getChoices()
        }
    }


    const submitNewDish = async () => {
        await pollDish(props.id, newDishInput,myVote)
        getChoices()
    }

    const DishItemView = (props) => {
        console.log( (parseFloat(props.vote)/totalVotes*100).toString()+'%')
        return (
            <TouchableOpacity onPress={() => onSelect(props.name)} key={props.name}>
                <HStack  borderRadius={8} borderWidth={1}
                    borderColor={myVote == props.name ? '#ff9636' : '#ccc'}
                    m={1} overflow='hidden'>
                    
                    <Animated.View style={{
                        position: 'absolute',
                        height:'100%',width: (parseFloat(props.vote)/totalVotes*100).toString()+'%',
                        backgroundColor:myVote == props.name ? '#ffe0c4' : '#ddd'
                    }}></Animated.View>
                    <Text p={2}  flex={1}
                        color={myVote == props.name ? '#ff9636' : '#000'}
                        fontWeight={myVote == props.name ? 'bold' : 'normal'}
                    >{props.name}</Text>
                    <Text p={2} > {props.vote}</Text>
                </HStack>
            </TouchableOpacity>)
    }

    return (
        <VStack p={5}>
            {choices.map(item =>
                <DishItemView totalVotes={totalVotes} name={item.choice} vote={item.votes} />
            )}

            {showNewDishInput && <HStack>
                <TextInput value={newDishInput} style={{ marginLeft: 30 }}
                    flex={1} placeholder='新菜式...' defaultValue={''} onChangeText={setNewDishInput} />
                <IconButton onPress={submitNewDish} icon={<Feather name="send" size={24} />} />
            </HStack>}
        </VStack>
    )
}