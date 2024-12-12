import mongoose,{Schema,model,models,Document,Model} from "mongoose"

export interface IUser extends Document {
    userId: string;
    todo: mongoose.Schema.Types.ObjectId[];
  }  

const userSchema:Schema<IUser> = new Schema<IUser>({
    userId:{
        type:String,
        required:true,
    },
    todo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"todo",
        }
    ]

},{timestamps:true})

export const user:Model<IUser> = models.user || model<IUser>('user',userSchema);