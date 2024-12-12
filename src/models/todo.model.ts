import {Schema,model,models,Document,Model} from "mongoose"

export interface ITodo extends Document {
    title: string;
    completed: boolean;
    createdAt:Date;
    updatedAt:Date;
  }  

const todoSchema:Schema<ITodo> = new Schema<ITodo>({
    title:{
        type:String,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false,
    }

},{timestamps:true})

export const todo:Model<ITodo> = models.todo || model<ITodo>('todo',todoSchema);