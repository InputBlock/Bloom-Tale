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

     product_type: {
      type: String,
      enum: ["simple", "sized"], // simple = candle, balloon | sized = flowers
      default: "simple",
    },

    // Single price for products without sizes (Candles, Combos)
    price: { type: Number, default: null },
    // Size-based pricing for products with sizes
    pricing: {
      small : {type : Number, default: null},
      medium : {type :Number, default: null},
      large : {type : Number, default: null}
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
