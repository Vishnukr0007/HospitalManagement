const mongoose=require('mongoose');
const UserSchema=mongoose.Schema({
    name:{
        type:String
    },
    department:{
        type:String
    },departmenthead:{
        type:String
    },
    image:{
        type:String
    }
})
const UserModel=mongoose.model('data',UserSchema)
module.exports=UserModel;