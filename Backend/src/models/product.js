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
    subcategory: { type: String, //required: true,
    },
    price: {type: Number, required: true,
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
  },
  { timestamps: true },
)

export default mongoose.model("Product", productSchema)
