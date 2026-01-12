import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {type: String,required: true,trim: true
    },
    email: {type: String,required: true,unique: true,index: true,lowercase: true
    },
    password_hash: {type: String,required: true
    },
    current_token: {type: String,
      default: null
    },
    created_at: {type: Date,
      default: Date.now
    },
    metadata: {
      type: Schema.Types.Mixed,default: {}
    }
  },
  {
    timestamps: false
  }
);

export default mongoose.model("User", UserSchema);
