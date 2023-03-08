const User = require('../models/user')
const getAllFriendsId = require('./getAllFriendsId')

module.exports = async function(id, query){
    let friendId = await getAllFriendsId(id,'friends')
    let regex = new RegExp(query)
    query = query ? { username : regex, _id : { $in : friendId }} : { _id : { $in : friendId } }

    let getAllUser = new Promise((resolve,reject) => {
        User.find(query, (err,res) => {
            if (err) reject(new Error(err))
            if(res.length === 0) return resolve([])
            if(res){
                res = res.map(item => {
                    let index = item.friends.findIndex(i => {
                        return i.member.includes(id)
                    })
                    // console.log(index)
                    if(index > -1){
                        return {
                            _id: item._id,
                            username: item.username,
                            name: item.name,
                            profilePicture: item.profilePicture,
                            isSelf: id === item.friends[index].requestBy
                        }
                    }else{
                        return
                    }
                })
                resolve(res)
            }
        })
    })
    return getAllUser
}