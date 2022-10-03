import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getFromCache(id) {
  try {
    const bookmarksString = await AsyncStorage.getItem('@foodiebychloe:'+id);
    if (bookmarksString !== null) {
      return JSON.parse(bookmarksString);
    } else {
      // no bookmarks stored
      return null
    }
  } catch (error) {
    // Error retrieving data
    console.log(error)
  }
  return null
}

export async function saveToCache(id, item) {

  
  try {
    const jsonValue = JSON.stringify(item)
    await AsyncStorage.setItem('@foodiebychloe:'+id, jsonValue)
  } catch (e) {
    console.log(e)
  }
}
