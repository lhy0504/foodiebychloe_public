import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserBookmarked, unsetUserBookmarked } from './FirebaseUtil';

export async function getBookmarks() {
  try {
    const bookmarksString = await AsyncStorage.getItem('@foodiebychloe:bookmarks');
    if (bookmarksString !== null) {
      return JSON.parse(bookmarksString);
    } else {
      // no bookmarks stored
      return []
    }
  } catch (error) {
    // Error retrieving data
    console.log(error)
  }
  return []
}

export async function addBookmark(location, place_id) {

  var existingBookmarks = []
  existingBookmarks = await getBookmarks()
  existingBookmarks.push({ location: location, place_id: place_id })

  try {
    const jsonValue = JSON.stringify(existingBookmarks)
    await AsyncStorage.setItem('@foodiebychloe:bookmarks', jsonValue)
  } catch (e) {
    console.log(e)
  }
  setUserBookmarked(place_id)
}
export async function isBookmarked( place_id) {
  try {
    const bookmarksString = await AsyncStorage.getItem('@foodiebychloe:bookmarks');
    if (bookmarksString !== null) {
      var bookmarks = JSON.parse(bookmarksString);

      for (var i of bookmarks) {
        if (place_id == i.place_id)
          return true
      }
      return false

    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
export async function removeBookmark( place_id) {
/* 
location is deprecated; just pass in anything.
*/
  var existingBookmarks = []
  existingBookmarks = await getBookmarks()

  var index = -1
  for (var i in existingBookmarks) {

    if ( place_id == existingBookmarks[i].place_id) {
      index = i
      break
    }
  }

  if (index > -1) {
    existingBookmarks.splice(index, 1);
  }  
  try {
    const jsonValue = JSON.stringify(existingBookmarks)
    await AsyncStorage.setItem('@foodiebychloe:bookmarks', jsonValue)
  } catch (e) {
    console.log(e)
  }
  unsetUserBookmarked(place_id)
}