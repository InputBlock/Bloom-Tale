import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    product_id:{type:Number , unique:true , index:true
    },
    name: {type: String, required: true, index:true
    },
    description: {type: String, //required: true,
    },
    category: { type: String, required: true,
    },
    subcategory: { type: String, //required: true,
    },
    price: {type: Number, required: true,
    },
    sizes: [String],
    bestSeller: { type: Boolean,default: false,
    },
    images: {type:String , default:null},
    stock: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Product", productSchema)
