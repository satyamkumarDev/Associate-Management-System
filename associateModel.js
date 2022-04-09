import mongoose from 'mongoose';

const SpecializationSchema=new mongoose.Schema({
    SpecializationId:{type:Number, required:true,unique:true},
    SpecializationName:{type:String, required:true}
},
{
    timestamps:true,
});
const Specialization=mongoose.model('Specialization', SpecializationSchema);
export default Specialization;

