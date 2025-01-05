import {Schema,model,models,Document,Model} from "mongoose"

export interface INotes extends Document {
    title: string;
    message: string;
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
    }

},{timestamps:true})

export const notes:Model<INotes> = models.notes || model<INotes>('notes',notesSchema);