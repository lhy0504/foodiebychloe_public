
export const themes = {
    'None':{
        image:'',
        color:'black'
    },
    'Midnight':{
        image:require('../../assets/Midnight.png'),
        color:'white'
    },
    'Pinky':{
        image:require('../../assets/Pinky.png'),
        color:'black'
    },
    'Red':{
        image:require('../../assets/Red.png'),
        color:'white'
    },
    'Rice':{
        image:require('../../assets/Rice.png'),
        color:'black'
    },
    'Dark':{
        image:require('../../assets/gallery_bg.png'),
        color:'white'
    },
   
}
export function getAllThemes(){
    return Object.keys(themes).map(i=>{return {id:i,name:i}})
}
export function getTheme(post){

    if(!post || !post.hasOwnProperty('theme')) return themes.None

    if( !themes.hasOwnProperty(post.theme)) return themes.None
         return themes[post.theme]
    
}