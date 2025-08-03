import {Schema,model,models,Document,Model} from "mongoose"

export interface INotes extends Document {
    title: string;
    message: string;
    favourite: boolean;
    pinned: boolean;
    createdAt:Date;
    updatedAt:Date;
  }  

const notesSchema:Schema<INotes> = new Schema<INotes>({
    title:{
        type:String,
        required:true,
    },
    message:{
        type:String,
    },
    favourite:{
        type:Boolean,
        default: false
    },
        pinned:{
        type:Boolean,
        default: false
    }
},{timestamps:true})

export const notes:Model<INotes> = models.notes || model<INotes>('notes',notesSchema);