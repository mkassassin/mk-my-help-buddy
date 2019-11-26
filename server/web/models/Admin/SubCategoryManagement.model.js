var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// SubCategory Schema
   var SubCategorySchema = mongoose.Schema({
      Category: { type: Schema.Types.ObjectId, ref: 'Categories', required : true },
      SubCategory: { type : String , required : true},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarSubCategory = mongoose.model('SubCategories', SubCategorySchema, 'SubCategory_Management');



   
module.exports = {
   SUbCategorySchema : VarSubCategory
};