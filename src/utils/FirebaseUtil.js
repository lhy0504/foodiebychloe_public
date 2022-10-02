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
        name: "已刪除用戶",
        email: testUID,
        uid: testUID,
        propic: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/facebook/65/clinking-beer-mugs_1f37b.png',
        status: '',


        joined: new Date().toLocaleDateString(),
        foodieScore: 20,
        following: [],
        friends: [],
        scorehistory: [],
        feed: [],
        post: [],
        requests: [],
        pushtoken: '',
        followerCount: 0,
        block: [],
        bookmarks: []

      })
  }
  /* 
  Post
  */
  if (false) {
    var post = {
      userid: testUID,
      price: [0, 0, 0, 0, 0],
      date: new Date().toLocaleDateString('en-US'),
      with: [],
      tag: '',
      likes: [],
      hashtag: '',
      comment: [],
      theme: "Rice",
      layout: true,




      image: ['https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/307409554_778236933518730_6389744094334805890_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=106&_nc_ohc=flGMMeqOfjoAX8VZcKK&tn=6lKGob4RTc_b6DfL&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MjkzMTAzNTAzMTg0NzkwODkzMw%3D%3D.2-ccb7-5&oh=00_AT_7tKEEGpPrmhxR9dXT50v2Lr60yydwHuF3j7o3k5Tpew&oe=63348F23&_nc_sid=30a2ef', 'https://scontent-hkt1-1.cdninstagram.com/v/t51.2885-15/307548535_156911603617341_7927267163115279694_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=-ED7PmLdtmEAX_lp504&tn=6lKGob4RTc_b6DfL&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MjkzMTAzNTAzMTQ3ODgzOTYwOA%3D%3D.2-ccb7-5&oh=00_AT_KlB0JvCA1_FP-j61_iGOXh0flfivBS4JFMkAjrAN1rg&oe=6334E21B&_nc_sid=30a2ef', 'https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/307735819_754543272317083_2948222041737263751_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=107&_nc_ohc=cwpXEmuLeF4AX86pFOM&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MjkzMTAzNTAzMTQ3ODk4NzU1Mg%3D%3D.2-ccb7-5&oh=00_AT85079OQIVCImFbz_PCQ7qE9-Ay2QgVIDJGV3lxbkTXOw&oe=6335A9CA&_nc_sid=30a2ef', 'https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/307805389_598690965133160_6858458876901700006_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=108&_nc_ohc=0zs6grWuZEkAX8Evb9F&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MjkzMTAzNTAzMTg4MTQ5NzUxMg%3D%3D.2-ccb7-5&oh=00_AT9mORKYaN_j1omQQ4e1y0bh9M6juFvJ0KxPCXrNS4GO1Q&oe=6335DE6A&_nc_sid=30a2ef'],
      yummystar: [4, 5, 5, 4],
      title: ['香煎北海道帶子🐚 $108', '白酒牛油汁煮蜆🧈 $118', '芝士蟹肉長通粉🦀 $168', 'Mojito🥂 $138'],
      description: ['帶子下面有個綠色嘅醬汁，係枝豆蓉，幾特別，帶子煎到金黃色，充滿油香🤤帶子口感鮮嫩又鎖到好多汁😆唔會好鞋口😝上面配埋金山豆豉醬，香香甜甜', '有兩大舊焗蒜蓉包，超級香脆🥳蜆肉肥美，最緊要冇沙，入口後有甜甜嘅白酒香加埋牛油之後有一個非常好嘅化學作用，總之呢個唔執就好好😝追住嚟食‼️而且上面嘅洋蔥炒到好香😋個汁我仲拎匙羹飲🤭', '蟹👈🏻呢隻中文字係令我抗拒不了的，所以喺餐牌上面見到就一定要叫🙌🏻點知咁鬼正🤩嘩‼️魚子醬呀仲有😍好有魚油香🥳仲有滿滿嘅蟹肉，每一啖都食到😋佢整嘅芝士醬汁好Creamy😳仲要好掛汁👍🏻比佢💯', '酒精含量相對較低，大約只有10%，有青檸汁、蘇打水和薄荷🌿 因為採用左大量嘅薄荷、同青檸🍋，清新又酸甜嘅口感，沖淡了酒精嘅濃烈，喝起來清爽又開胃🌱'],
      overallprice: 3,
      overallyummy: 4,
      overallenv: 4,
      location: "	The Pearl (尖沙咀)	",
      overalltitle: "	《藝 術 風 格 西 餐 廳》	",
      overalldescription: "	呢間餐廳太有feel了，環境充滿古典氣息，周圍都可以見到唔同嘅雕塑😍就好似我玩動森時佈置嘅餐廳咁😂餐廳分左室內、室外位置，有興趣嘅朋友可以坐室外chill下😌不過今日撞正落雨就唯有坐返室內啦☹️大家黎呢度記得做快測呀🤭	",
      place_id: "	ChIJbZj0o3gBBDQRgiwmoS6JNVM	",
























    }
    //trimming spaces
    for (var i in post) {
      if (typeof post[i] == 'string') {
        post[i] = post[i].trim()

      }
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
  console.log('xxx')
  var user = (await firebase.firestore().collection('users').doc(
    getAuth().currentUser.uid
  ).get())
  if (!user.exists) {
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
        .catch(e => console.log(e))
    ).then(() => navigation.replace("MainScreen", { screen: "Home" }));


  } else {
    console.log(user.data())
    if (user.data().pushtoken == 'error') {
      registerForPushNotificationsAsync().then(async (token) =>
        await firebase.firestore()
          .collection("users").doc(getAuth().currentUser.uid).update({
            pushtoken: token || 'error',
          })
      ).catch(e=>{
        console.log(e)
         firebase.firestore()
        .collection("users").doc(getAuth().currentUser.uid).update({
          pushtoken: e.toString(),
        })
      })
    }
  }
}
export async function getUser(id = getMyUid(), refresh = false) {
  var doc
  let today = new Date().toLocaleDateString()

  if (refresh) {
    // refresh

    doc = await firebase.firestore().collection('users').doc(id).get()
    if (doc.exists) {
      doc = doc.data()
    } else {
      var sampledeleteduser = await getUser("Deleted Account", false)
      doc = sampledeleteduser
    }


    //.data()
    const jsonValue = JSON.stringify(doc)
    AsyncStorage.setItem('@foodiebychloe:usercache:' + id + today, jsonValue)

  } else {
    doc = await AsyncStorage.getItem('@foodiebychloe:usercache:' + id + today);
    if (doc !== null) {
      return JSON.parse(doc);
    } else {
      // not cached
      doc = await getUser(id, true)
    }
  }
  return doc
}
export async function getUsersByName(queryText) {
  //descending, limit 30
  var postList = [];
  var snapshot = await firebase.firestore()
    .collection('users')
    .where('name', '>=', queryText)
    .where('name', '<=', queryText + '\uf8ff').get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    singlePost.id = doc.id;
    postList.push((singlePost));
  });
  return (postList);
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
export async function getBothUserPosts(uidA, uidB = getMyUid()) {

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('posts')
    .where('with', 'array-contains', uidA)
    .orderBy('date', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const singlePost = doc.data();
    if (!singlePost.with.includes(uidB)) return
    singlePost.id = doc.id;
    postList.push(convertTimestampToDate(singlePost));
  });
  return (postList);
}
export async function getBothUserPostsMonthly(year, month, uidA, uidB = getMyUid()) {

  //monthly, ascending
  var firstDay = new Date(year, month - 1, 1);
  var lastDay = new Date(year, month, 1);

  var postList = [];

  var snapshot = await firebase.firestore()
    .collection('posts')
    .where('with', 'array-contains', uidA, uidB)
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
  if (parts[2].length == 2) parts[2] = '20' + parts[2]

  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  return new Date(parts[2], parts[0] - 1, parts[1]);

}
/* Uploading */
export async function uploadPost(post, publicOrFriends) {

  post.publicOrFriends = publicOrFriends


  //add self to 'with'
  if (!post.with.includes(getMyUid())) post.with.push(getMyUid())

  //split # and @
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
        console.log(docRef)
        addPostToFeeds(docRef.id, publicOrFriends)
        voteToLocation(post)
        for (var i of post.with) {
          setUserVisited(post.place_id, i)
        }
      })
      .catch(e => console.log('err', e))

    // foodiescore
    for (var i of post.with) {
      addFoodieScore(getMyUid(), i, 5)
    }

    // pollDish: add all dish to 0 , then vote
    //poll dish
    var updateObj = {}
    var maxRating = 0
    var maxIndex = 0
    for (let p in post.title) {
      updateObj[post.title[p]] = 0
      if (post.yummystar[p] > maxRating) {
        maxRating = post.yummystar[p]
        maxIndex = p
      }
    }
    firebase.firestore()
      .collection('dishPoll')
      .doc(post.place_id)
      .set(updateObj)
      .then(() => pollDish(post.place_id, post.title[maxIndex]));



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

  //weigh score to nearest 1 for VOTE
  var score = Math.floor(post.overallscore)

  var location = (await firebase.firestore().collection('location').doc(post.place_id).get())
  if (!location.exists) {
    firebase.firestore()
      .collection("location").doc(post.place_id).set({
        ...yummytemplate,
        name: post.location,
        address: post.address || '',
        ['star' + score]: 1,
        total: 1,
        average: score,
        pic: post.image[0]
      })
  } else {
    firebase.firestore()
      .collection("location").doc(post.place_id).update({
        ['star' + score]: firebase.firestore.FieldValue.increment(1),
        total: firebase.firestore.FieldValue.increment(1),
        average: (location.data().average * location.data().total + score) / parseFloat(location.data().total + 1)
      })
  }
}
async function setUserVisited(place_id, uid = getMyUid()) {
  var doc = firebase.firestore()
    .collection('userVisited')
    .doc(place_id)

  if (await (doc.get()).exists) {
    doc.update({
      "users": firebase.firestore.FieldValue.arrayUnion(uid)
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

  if (authorid != getMyUid()) {
    var author = await getUser(authorid, true)
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
    addFoodieScore(authorid, getMyUid(), 1)
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
    addFoodieScore(authorid, getMyUid(), 2)

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
export async function getRestaurantsMap(searchName = '', searchRegion = '', searchDishes = [],
  searchPrice = [], searchStar = 0) {

  var postList = [];

  var query = firebase.firestore()
    .collection('location')

  if (searchName != '') {
    query = query.where('name', '>=', searchName)
      .where('name', '<=', searchName + '\uf8ff')
    /* }else if (searchAddress != '') {
     query = query.where('address', '>=', searchAddress)
       .where('address', '<=', searchAddress + '\uf8ff') */
  } else if (searchDishes.length > 0) {
    query = query.where('tag', 'array-contains-any', searchDishes)
  } else if (searchPrice.length > 0) {
    query = query.where('price', 'array-contains-any', searchPrice)
  } else if (searchStar > 0) {
    query = query.where('average', '>=', searchStar)
  }


  var snapshot = await query.get() //orderby ensures have LAT 

  snapshot.forEach((doc) => {
    const singlePost = doc.data();

    /* for region search, avoid undefined */
    if (!singlePost.region) singlePost.region = ''

    /* then Re-filter ALL */
    if (!singlePost.hasOwnProperty('lat')) return
    if (!singlePost.name.includes(searchName)) return
    if (!singlePost.region.includes(searchRegion)) return
    if (searchDishes.length > 0 && !singlePost.tag.some(ai => searchDishes.includes(ai))) return
    if (searchPrice.length > 0 && !singlePost.tag.some(ai => searchPrice.includes(ai))) return
    if (singlePost.average < searchStar) return

    singlePost.id = doc.id;
    singlePost.place_id = doc.id;
    postList.push(singlePost);
  });

  // sort 
  postList.sort((a, b) => parseFloat(b.average) - parseFloat(a.average));

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

/* foodieScoring */
export async function addFoodieScore(uidA, uidB, value) {
  // checki f user name has symbol
  if (uidA.includes('@') || uidB.includes('@')) return

  var userA = (await firebase.firestore().collection('score').doc(uidA).get())
  if (!userA.exists) {
    firebase.firestore().collection("score").doc(uidA).set({ [`${uidB}`]: value })
  } else {
    firebase.firestore().collection("score").doc(uidA).update({ [uidB]: firebase.firestore.FieldValue.increment(value) })
  }
  var userB = (await firebase.firestore().collection('score').doc(uidB).get())
  if (!userB.exists) {
    firebase.firestore().collection("score").doc(uidB).set({ [`${uidA}`]: value })
  } else {
    firebase.firestore().collection("score").doc(uidB).update({ [uidA]: firebase.firestore.FieldValue.increment(value) })
  }
}
export async function getFoodieScore(uid = getMyUid()) {
  var userA = await firebase.firestore().collection('score').doc(uid).get()
    .catch(e => { })
  return userA?.data()
}