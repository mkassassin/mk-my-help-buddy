var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Category Schema
   var CategorySchema = mongoose.Schema({
      Category: { type : String , required : true},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarCategory = mongoose.model('Categories', CategorySchema, 'Category_Management');



   
module.exports = {
   CategorySchema : VarCategory
};