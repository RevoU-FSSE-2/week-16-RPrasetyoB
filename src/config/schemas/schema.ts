import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
      type: String,
      required: true,
      unique: true
    },
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: '',
        enum: ['manager','leader','member','']
    }
  },{
    versionKey: false
  });
  
export const userModel = mongoose.model('users', userSchema);

const taskSchema = new mongoose.Schema({
    task: {
        type : String,
        required : true
    },
    status: {
        type: String,
        default: "Not started",
        enum: ["Not started", "Approved", "Rejected"]
    },
    maker: {
        type : String,
    },
    isDeleted: {
        type: Boolean
    }
},{
    timestamps: {
        currentTime: () => new Date().setUTCHours(0, 0, 0, 0)
    },
    versionKey: false
})

export const taskModel = mongoose.model("tasks", taskSchema);