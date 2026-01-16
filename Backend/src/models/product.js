import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    product_id:{type:String , unique:true , index:true
    },
    name: {type: String, required: true, index:true
    },
    description: {type: String, //required: true,
    },
    category: { type: String, required: true,
    },
    pricing: {
      small : {type : Number},
      medium : {type :Number},
      large : {type : Number}
    },
    sizes: [String],
    bestSeller: { type: Boolean,default: false,
    },
    images_uri: [String],
    image_public:[String],
    stock: {
      type: Number,
      default: null,
      description:"Out of Stock"
    },
    is_active: { type: Boolean, default: false,
    },
    same_day_delivery: { type: Boolean, default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Product", productSchema)
