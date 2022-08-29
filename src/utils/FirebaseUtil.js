import { v4 as uuidv4 } from 'uuid';
import firebase from './FirebaseInit'
import { registerForPushNotificationsAsync, sendPushNotification } from './PushNotifications'
import { Image } from 'react-native';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';/* 
Cache using AsyncStorage
*/
import AsyncStorage from '@react-native-async-storage/async-storage';

/* 

T*/

const Testing = false
const testUID = 'gladysfoodie.fdchloe@gmail.com'

export function TestingPurpose() {
  if (!Testing) return

  /* 
  Register
  */
  if (false) {
    firebase.firestore()
      .collection("users").doc(testUID).set({
        name: "𝐆𝐥𝐚𝐝𝐲𝐬'𝐬 𝐅𝐨𝐨𝐝𝐢𝐞🍰",
        email: testUID,
        uid: testUID,
        propic: 'https://scontent-hkt1-1.cdninstagram.com/v/t51.2885-19/246863303_373878977752955_2164896707255147869_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-hkt1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=TlRGrI5RrQEAX_FZMFz&tn=zwr5qf92Y7xsCaUq&edm=APU89FABAAAA&ccb=7-5&oh=00_AT8pEgmGO82XThdmECuSp826lEh7CpPXtz7k0mqMTIgHzw&oe=62DF1A0F&_nc_sid=86f79a',
        status: '給予大家最真實的評價‼️',


        joined: new Date().toLocaleDateString(),
        foodieScore: 20,
        following: [],
        friends: [],
        scorehistory: [],
        feed: [],
        post: [],
        requests: [],
        pushtoken: '',
        followerCount: 9,
        block: [],
        bookmarks: []

      })
  }
  /* 
  Post
  */
  if (true) {
    var post = {
      userid: testUID,
      price: [0, 0, 0, 0, 0],
      place_id: '',
      date: new Date().toLocaleDateString('en-US'),
      with: '',
      tag: '',
      likes: [],
      hashtag: '',
      comment: [],

      image: ['https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/294077957_168079459059384_338375874651609466_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=100&_nc_ohc=B3l9Wp4e4YYAX_E9dK6&tn=zwr5qf92Y7xsCaUq&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4NDc0MjAwMTIwMTIxNTM2Mg%3D%3D.2-ccb7-5&oh=00_AT9WekmoJ97UWp6wx8cESOJPZ_skRFDw381StzWjmObRew&oe=62DF5647&_nc_sid=30a2ef', 'https://scontent-hkt1-1.cdninstagram.com/v/t51.2885-15/293730990_781342786627657_591414257285132910_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=5G4F9gEONSIAX-V2z-M&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4NDc0MjAwMTA1ODQwNDYzNw%3D%3D.2-ccb7-5&oh=00_AT9ckfsN6QSQhc6qpj7D2mpmbxGPfTPSVEgZ2Z1lIxSGmQ&oe=62DF6E34&_nc_sid=30a2ef', 'https://scontent-hkt1-1.cdninstagram.com/v/t51.2885-15/293825808_1375806596248151_7135881749554395747_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=Ych1lLz2jGYAX_EqofD&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4NDc0MjAwMTA2NzAwNDcwOQ%3D%3D.2-ccb7-5&oh=00_AT-31tlw2O5-E_qcqCsJFOjiAiYp8bSRJ9jdPM6QOWQblQ&oe=62DF74E6&_nc_sid=30a2ef', 'https://scontent-hkt1-1.cdninstagram.com/v/t51.2885-15/293730990_781342786627657_591414257285132910_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=5G4F9gEONSIAX-V2z-M&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4NDc0MjAwMTA1ODQwNDYzNw%3D%3D.2-ccb7-5&oh=00_AT9ckfsN6QSQhc6qpj7D2mpmbxGPfTPSVEgZ2Z1lIxSGmQ&oe=62DF6E34&_nc_sid=30a2ef', 'https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/293864315_1372838293547802_2383309017863982347_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=106&_nc_ohc=Gm21f4Y4vygAX-jD3pp&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4NDc0MjAwMTA2NjgyODE4MQ%3D%3D.2-ccb7-5&oh=00_AT9A_XqnAOrLNscxATjS_jyUP_aip_VazeQaG2zAu0__vQ&oe=62DF4F5C&_nc_sid=30a2ef', 'https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/294196108_789785298862952_6777630241642020740_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=108&_nc_ohc=Q29xjCvU6FUAX-k0Ed0&tn=zwr5qf92Y7xsCaUq&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4NDc0MjAwMTA2Njg4Nzg4MA%3D%3D.2-ccb7-5&oh=00_AT83HURcz7kS23xNbNv7-wFjlUm0WBxhFMdq6-qXDO0JZQ&oe=62DEE6C7&_nc_sid=30a2ef'],
      yummystar: [3, 4, 5, 3, 3, 3],
      title: ['南海下午茶套餐🌊 $228/2pp', '芝士薯蓉炸餅🥔:', '迷你三文治🥪:', '煙熏三文魚和忌廉芝士一口多士🧀:', '迷你黑安格斯牛肉漢堡🍔:', '迷你辣薄餅🍕:'],
      description: ['👇🏻特色鹹點🥐\n\
水牛芝士及番茄迷你串🍅:\n\
成個感覺好清新好開胃，仲有少少香料味幾特別', '雖然中間慕拉士但係食到有芝士嘅鹹香味，薯蓉揸得香脆可口👍🏻', '勁勁勁好味😝三文治已經烘好，外皮香脆，入面有生菜、蕃茄、煙肉🤤', '你話佢似多事我又唔覺得好似但係就覺得佢好好味，上面有魚子醬鋪面用咗煙三文魚包住有香草忌廉芝士，令芝士更上一層樓🫶🏻', '雖然佢係迷你但係漢堡嘅份量都唔使，好多汁好Juice一啖咬落去咇晒啲汁出嚟🤣', '第一次見到Pizza上面嘅配料係放咗午餐肉😆一份有四件，份量我覺得都算幾多😋'],
      overallprice: 2,
      overallyummy: 4,
      overallenv: 5,
      location: "	Social Bar & Grill (西灣河)	",
      overalltitle: "	《又 飽 又 抵 食 嘅 下 午 茶》	",
      overalldescription: "	佢可能係我食過最平嘅八婆塔😏除翻開百幾蚊，加加埋埋仲有9️⃣款野食😝屬於新開嘅餐廳來講人流唔算話非常之多🆕，啱晒大家可以靜靜地享用下午茶時間🫖兩個人傾吓計食吓嘢坐吓真係幾舒服㗎🫶🏻	",
      address: "	西灣河太康街45號地舖	",




    }
    uploadPost(post, 'public')
  }
}

function getAuth() {
  return firebase.auth()
}
/* Getters */
export function getMyUid() {
  if (Testing) return testUID
  return getAuth().currentUser.uid
}

export async function checkIfNewUser(navigation) {
  /* 
  If new user:
  0 - get Expo PUSH notifications token
  1 - save user data to 'user'
  2 - 
  */
  console.log(getAuth().currentUser) 
  console.log('xxx')
  var userExist = (await firebase.firestore().collection('users').doc(
    getAuth().currentUser.uid
  ).get()).exists
  if (!userExist) {
    registerForPushNotificationsAsync().then(async (token) =>
      await firebase.firestore()
        .collection("users").doc(getAuth().currentUser.uid).set({
          name: getAuth().currentUser.displayName || getAuth().currentUser.email.split('@')[0],
          email: getAuth().currentUser.email,
          uid: getAuth().currentUser.uid,
          joined: new Date().toLocaleDateString(),
          propic: getAuth().currentUser.photoURL
            || 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/65/clinking-beer-mugs_1f37b.png',
          foodieScore: 20,
          following: [], 
          friends: [],
          scorehistory: [],
          feed: [],
          post: [],
          requests: [],
          pushtoken: token || 'error',
          followerCount: 0,
          block: [],
          bookmarks: [],
          status: '我在用FoodieByChloe尋找美食!'

        })
        .catch(e=>console.log(e))
    ).then(() => navigation.replace("MainScreen", { screen: "Home" }));


  }
}
export async function getUser(id = getMyUid(), refresh = false) {
  var doc
  let today = new Date().toLocaleDateString()

  if (refresh) {
    console.log('refresh', id)
    doc = (await firebase.firestore().collection('users').doc(id).get()).data()
    const jsonValue = JSON.stringify(doc)
    AsyncStorage.setItem('@foodiebychloe:usercache:' + id + today, jsonValue)
  } else {
    doc = await AsyncStorage.getItem('@foodiebychloe:usercache:' + id + today);
    if (doc !== null) {
      return JSON.parse(doc);
    } else {
      // not cached
      doc = (await firebase.firestore().collection('users').doc(id).get()).data()
      const jsonValue = JSON.stringify(doc)
      AsyncStorage.setItem('@foodiebychloe:usercache:' + id + today, jsonValue)
    }
  }
  return doc
}
export async function getLocation(location, place_id, refresh = true) {
  var result
  var doc_id = place_id

  if (place_id == '' || typeof (place_id) == 'undefined') doc_id = location

  result = (await firebase.firestore().collection('location').doc(doc_id).get()).data();
  result.id = doc_id;
  result.place_id = doc_id;

  return result;
}
export async function deleteUser() {
  
  console.log(getMyUid())

  await firebase.firestore().collection('users').doc(getMyUid()).delete()
  await firebase.auth().signOut()

  return 
}
export async function getPublicPosts() {

  //descending, limit 30
  var postList = [];
  var snapshot = await firebase.firestore()
    .collection('posts')
    .orderBy('postDate', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}

export async function getUserPostsMonthly(year, month, uid = getMyUid()) {

  //monthly, ascending
  var firstDay = new Date(year, month - 1, 1);
  var lastDay = new Date(year, month, 1);
  console.log(lastDay)

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('posts')
    .where('userid', '==', uid)
    .orderBy('date')
    .where("date", ">=", firstDay)
    .where("date", "<", lastDay)
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getUserPosts(uid) {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('posts')
    .where('userid', '==', uid)
    .orderBy('date', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getLocationPosts(location, place_id) {

  var postList = [];

  var snapshot;

  /*   location is deprecated
  
  if (place_id == '' || typeof (place_id) == 'undefined') {
    snapshot = await firebase.firestore()
      .collection('posts')
      .where('location', '==', location)
      .orderBy('date', 'desc')
      .get()

  } else { */

  snapshot = await firebase.firestore()
    .collection('posts')
    .where('place_id', '==', place_id)
    .orderBy('date', 'desc')
    .get()


  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getLocationFriendPost(place_id, friendlist) {
  var postList = [];
  var snapshot;
  snapshot = await firebase.firestore()
    .collection('posts')
    .where('place_id', '==', place_id)
    .where('userid', 'in', friendlist)
    .orderBy('date', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getPostById(id) {
  var snapshot = await firebase.firestore()
    .collection('posts')
    .doc(id)
    .get()
  return convertTimestampToDate({ ...snapshot.data(), id: id });

}

export async function getDishPollByRestaurant(id) {
  var snapshot = await firebase.firestore()
    .collection('dishPoll')
    .doc(id)
    .get()
  if (snapshot.exists) {
    return snapshot.data()
  } else {
    return {}
  }

}
export async function getDishPollByUser(restaurant) {
  var snapshot = await firebase.firestore()
    .collection('userPolled')
    .doc(getMyUid())
    .get()
  if (snapshot.exists) {
    return snapshot.data()[restaurant]
  } else {
    return 'not voted'
  }

}
function convertTimestampToDate(post) {
  post.dateObj = post.date.toDate()
  post.postDate = post.postDate.toDate().toLocaleDateString('en-US')
  post.date = post.date.toDate().toLocaleDateString('en-US')

  return post
}
export function parseDate(date) {
  //reformat date
  var parts = date.split('/');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  return new Date('20' + parts[2], parts[0] - 1, parts[1]);

}
/* Uploading */
export async function uploadPost(post, publicOrFriends) {

  post.publicOrFriends = publicOrFriends

  //split # and @
  post.with = post.with.replace(", ", ",").split(",")
  post.hashtag = post.hashtag.replace("#", "").split(" ")

  //reformat date
  var parts = post.date.split('/');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  if (parts[2].length == 2) parts[2] = '20' + parts[2]
  post.date = new Date(parts[2], parts[0] - 1, parts[1]);

  console.log(post)
  //upload img
  for (var i in post.image) {
    if (post.image[i] !== undefined) {
      var x = await uploadImage(post.image[i])
      post.image[i] = x
    }
  }

  // if no place_id, that means we will create a restaurant with place_id=location
  if (post.place_id == undefined || post.place_id == '') {
    post.place_id = post.location
  }

  if (post.id !== undefined) {
    /* Update existing */
    //post exists in server, do not overwrite. Combine instead

    var oldpost = await getPostById(post.id)
    var newpost = {
      ...post,
      comment: oldpost.comment,
      postDate: parseDate(oldpost.postDate)
    }

    firebase.firestore()
      .collection('posts').doc(post.id)
      .update(newpost)

  } else {
    post.postDate = new Date() //now

    firebase.firestore()
      .collection('posts')
      .add(post)
      .then((docRef) => {
        addPostToFeeds(docRef.id, publicOrFriends)
        setUserVisited(post.place_id)
        voteToLocation(post)
      })
      .catch(e => console.log('err', e))
      .finally(() => console.log('finally'))

  }

}
async function voteToLocation(post) {
  //
  /*
  vote to location.
  if 
     (0) no  place_id:   vote to doc with id = location name; create if inexist
     (1) has place_id:   vote to docuemnt with id = place_id; create if inexist
  */
  /*
  todo:check user has voted?
  */

  var yummytemplate = {
    star0: 0,
    star1: 0,
    star2: 0,
    star3: 0,
    star4: 0,
    star5: 0,
    total: 0,
    average: 0
  }

  var location = (await firebase.firestore().collection('location').doc(post.place_id).get())
  if (!location.exists) {
    firebase.firestore()
      .collection("location").doc(post.place_id).set({
        ...yummytemplate,
        name: post.location,
        address: post.address,
        ['star' + post.overallyummy]: 1,
        total: 1,
        average: post.overallyummy,
        pic: post.image[0]
      })
  } else {
    firebase.firestore()
      .collection("location").doc(post.place_id).update({
        ['star' + post.overallyummy]: firebase.firestore.FieldValue.increment(1),
        total: firebase.firestore.FieldValue.increment(1),
        average: (location.data().average * location.data().total + post.overallyummy) / parseFloat(location.data().total + 1)
      })
  }
}
async function setUserVisited(place_id) {
  var doc = firebase.firestore()
    .collection('userVisited')
    .doc(place_id)

  if (await (doc.get()).exists) {
    doc.update({
      "users": firebase.firestore.FieldValue.arrayUnion(getMyUid())
    });
  } else {
    doc.set({
      "users": [getMyUid()]
    })
  }
}
export async function getUserVisited(place_id) {
  var doc = await firebase.firestore()
    .collection('userVisited')
    .doc(place_id).get()
  if (doc.exists) {
    return doc.data().users
  } else {
    return []
  }
}

export async function setUserBookmarked(place_id) {
  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "bookmarks": firebase.firestore.FieldValue.arrayUnion(place_id)
    });

  /* for allowing to know who bookmarked a place in LocationView */
  var doc = firebase.firestore()
    .collection('userBookmarked')
    .doc(place_id)
  if (await (doc.get()).exists) {
    doc.update({
      "users": firebase.firestore.FieldValue.arrayUnion(getMyUid())
    });
  } else {
    doc.set({
      "users": [getMyUid()]
    })
  }
}
export async function unsetUserBookmarked(place_id) {
  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "bookmarks": firebase.firestore.FieldValue.arrayRemove(place_id)
    });
  // firebase will remove wrongly (?)
  var doc = await getUserBookmarked(place_id)
  if (doc.includes(getMyUid())) {
    firebase.firestore()
      .collection('userBookmarked')
      .doc(place_id)
      .update({
        "users": firebase.firestore.FieldValue.arrayRemove(getMyUid())
      });
  }
}
export async function getUserBookmarked(place_id) {
  var doc = await firebase.firestore()
    .collection('userBookmarked')
    .doc(place_id).get()
  if (doc.exists) {
    return doc.data().users
  } else {
    return []
  }
}

async function addPostToFeeds(id, publicOrFriends) {
  /* 
                public: add id to public/postIDs/ids[]
                                                                        push to Friends & Requested
                friends: push to Freinds
  */
  var myUser = await getUser()
  var timestamp = new Date()

  if (publicOrFriends == 'public') {
    firebase.firestore()
      .collection('public')
      .doc('postIDs')
      .update({
        "ids": firebase.firestore.FieldValue.arrayUnion({
          id: id, timestamp: timestamp
        })
      });

    for (var u in myUser.requests) {
      await firebase.firestore()
        .collection('users')
        .doc(myUser.requests[u])
        .update({
          "feed": firebase.firestore.FieldValue.arrayUnion({
            id: id, timestamp: timestamp
          })
        });
    }
  }
  /* Friends */
  for (var u in myUser.friends) {
    await firebase.firestore()
      .collection('users')
      .doc(myUser.friends[u])
      .update({
        "feed": firebase.firestore.FieldValue.arrayUnion({
          id: id, timestamp: timestamp
        })
      });
  }
  /* myself */

  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "post": firebase.firestore.FieldValue.arrayUnion({
        id: id, timestamp: timestamp
      }),
      "feed": firebase.firestore.FieldValue.arrayUnion({
        id: id, timestamp: timestamp
      })
    });

}

export async function uploadImage(imageUri) {
  //resize first
  const getSize = () => new Promise(
    (resolve, reject) => {
      Image.getSize(imageUri, (width, height) => { resolve({ width, height }) });
    }
  )
  const { width, height } = await getSize()
  if (width > 1000 || height > 2000) {
    const manipResult = await manipulateAsync(
      imageUri,
      [{ resize: { width: 1000 } }],
      { format: SaveFormat.JPEG }
    );
    imageUri = manipResult.uri
  }


  const fileExtension = imageUri.split('.').pop();
  var uuid = uuidv4();
  const fileName = `${uuid}.${fileExtension}`;

  const response = await fetch(imageUri);
  const blob = await response.blob();
  var ref = firebase.storage().ref(`posts/images/${fileName}`);
  await ref.put(blob)
  var url = await ref.getDownloadURL()
  return url

}

/* Like */
export async function likePost(post, authorid) {
  firebase.firestore()
    .collection('posts')
    .doc(post)
    .update({
      "likes": firebase.firestore.FieldValue.arrayUnion(getMyUid())
    });
  /* 
  Then we push notification
  */
  console.log("like", authorid, getMyUid())

  if (authorid != getMyUid()) {
    var author = await getUser(authorid)
    var myself = await getUser()
    sendPushNotification(author.pushtoken,
      `${myself.name} 讚好了你的帖文！`,
      '',
      {
        screen: 'StoryStack',
        postid: post,
        openedFromStory: false,

        uid: myself.uid,
        name: myself.name,
        propic: myself.propic
      })
  }

}
export async function unlikePost(post) {
  firebase.firestore()
    .collection('posts')
    .doc(post)
    .update({
      "likes": firebase.firestore.FieldValue.arrayRemove(getMyUid())
    });
}
/* Comment */
export async function commentPost(post, message, authorid) {
  await firebase.firestore()
    .collection('posts')
    .doc(post)
    .update({
      "comment": firebase.firestore.FieldValue.arrayUnion({
        userid: getMyUid(), comment: message, date: new Date()
      })
    });
  /* 
  Then we push notification
  */
  console.log("Comment", authorid, getMyUid())
  if (authorid != getMyUid()) {
    var author = await getUser(authorid)
    var myself = await getUser()
    sendPushNotification(author.pushtoken,
      `${myself.name} 回應了你的帖文！`,
      '',
      {
        screen: 'StoryStack',
        postid: post,
        openedFromStory: false,

        uid: myself.uid,
        name: myself.name,
        propic: myself.propic
      })
  }
}
/* Del post */
export async function deletePost(post) {
  await firebase.firestore()
    .collection('posts')
    .doc(post)
    .delete()
}

/* Follow */
export async function followUser(id) {
  /*
  accepting
   if my request has it, put it in friends of both
    */
  var me = await getUser()
  if (me.requests.includes(id)) {
    await firebase.firestore()
      .collection('users')
      .doc(id)
      .update({
        "requests": firebase.firestore.FieldValue.arrayRemove(getMyUid()),
        "friends": firebase.firestore.FieldValue.arrayUnion(getMyUid())
      })
    await firebase.firestore()
      .collection('users')
      .doc(getMyUid())
      .update({
        "requests": firebase.firestore.FieldValue.arrayRemove(id),
        "friends": firebase.firestore.FieldValue.arrayUnion(id)
      })
    return
  }
  /* 
  requesting
  */
  await firebase.firestore()
    .collection('users')
    .doc(id)
    .update({
      "requests": firebase.firestore.FieldValue.arrayUnion(getMyUid()),
      "followerCount": firebase.firestore.FieldValue.increment(1)
    });
  //put in follwing no matter what
  await firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "following": firebase.firestore.FieldValue.arrayUnion(id)
    });

  var author = await getUser(id)
  sendPushNotification(author.pushtoken,
    `${me.name} 要求追蹤您！`,
    '追蹤他來成為朋友，就能查看彼此的帖子',
    {
      screen: 'UserProfileStack',
      userid: me.uid,

      uid: me.uid,
      name: me.name,
      propic: me.propic
    })
  return
}

/* Ｐｏｌｌ */
export async function pollDish(id, dish, myOldVotedDish) {

  /* 1. update restaurant poll */
  var snapshot = await firebase.firestore()
    .collection('dishPoll')
    .doc(id)
    .get()
  if (snapshot.exists) {
    var updateObj = myOldVotedDish != 'not voted' && myOldVotedDish != undefined ?
      {
        [dish]: firebase.firestore.FieldValue.increment(1),
        [myOldVotedDish]: firebase.firestore.FieldValue.increment(-1)
      } :
      {
        [dish]: firebase.firestore.FieldValue.increment(1)
      }
    await firebase.firestore()
      .collection('dishPoll')
      .doc(id)
      .update(updateObj);
  } else {
    await firebase.firestore()
      .collection('dishPoll')
      .doc(id)
      .set({
        [dish]: 1
      });
  }
  /* 2. update userPolled */
  var snapshot = await firebase.firestore()
    .collection('userPolled')
    .doc(getMyUid())
    .get()
  if (snapshot.exists) {
    await firebase.firestore()
      .collection('userPolled')
      .doc(getMyUid())
      .update({
        [id]: dish
      });
  } else {
    await firebase.firestore()
      .collection('userPolled')
      .doc(getMyUid())
      .set({
        [id]: dish
      });
  }


}

export async function getAllUsers() {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('users')
    .orderBy('followerCount', 'desc')
    .limit(10)
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push(singlePost);
  });
  return (postList);
}
export async function getAllRestaurants(limit = 10) {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('location')
    .orderBy('average', 'desc')
    .limit(limit)
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    singlePost.place_id = doc.id;
    postList.push(singlePost);
  });
  return (postList);
}
export async function getRestaurantsMap(searchName = '', searchAddress = '', searchDishes = [],
  searchPrice = [], searchStar = 0) {

  var postList = [];

  var query = firebase.firestore()
    .collection('location')

 /*  if (searchName != '') {
    query = query.where('name', '>=', searchName)
      .where('name', '<=', searchName + '\uf8ff') 
  } else if (searchAddress != '') {
     query = query.where('address', '>=', searchAddress)
      .where('address', '<=', searchAddress + '\uf8ff') 
  } else */ if (searchDishes.length > 0) {
    query = query.where('tag', 'array-contains-any', searchDishes)
  } else if (searchPrice.length > 0) {
    query = query.where('price', 'array-contains-any', searchPrice)
  } else if (searchStar > 0) {
    query = query.where('average', '>=', searchStar)
  }


  var snapshot = await query.get() //orderby ensures have LAT 

  snapshot.forEach((doc) => {
    const singlePost = doc.data();

    /* then Re-filter ALL */
    if (!singlePost.hasOwnProperty('lat')) return
    if (!singlePost.name.includes(searchName)) return
    if (!singlePost.address.includes(searchAddress)) return
    if (searchDishes.length > 0 && !singlePost.tag.some(ai => searchDishes.includes(ai))) return
    if (searchPrice.length > 0 && !singlePost.tag.some(ai => searchPrice.includes(ai))) return
    if (singlePost.average < searchStar) return

    singlePost.id = doc.id;
    singlePost.place_id = doc.id;
    postList.push(singlePost);
  });

  // sort 
  postList.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));

  return (postList);
}
export function UIbeautifyDateString(datestring) {

  //exceptions
  if (typeof datestring != 'string') return datestring

  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  var arr = datestring.split('/')

  if (arr.length != 3) return datestring

  return arr[1] + ' ' + months[parseInt(arr[0]) + 1] + ' 20' + arr[2]
}
/* Block */
export async function blockUser(uid) {
  firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "block": firebase.firestore.FieldValue.arrayUnion(uid)
    });
}
export async function unblockUser(uid) {
  firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "block": firebase.firestore.FieldValue.arrayRemove(uid)
    });
}

/* Update user 
  Only update necessary fields to avoid overwritting other fields
 
*/
export async function updateUser(user) {
  firebase.firestore()
    .collection('users')
    .doc(getMyUid())
    .update({
      "status": user.status,
      'name': user.name,
      'propic': user.propic
    });
}