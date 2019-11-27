var CryptoJS = require("crypto-js");
var SubCategoryModel = require('./../../models/Admin/SubCategoryManagement.model');
var ErrorManagement = require('./../../../requests-handling/ErrorHandling');
var mongoose = require('mongoose');




// ************************************************** Sub Category *****************************************************
   // Sub Category Async Validate -----------------------------------------------
   exports.SubCategory_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.SubCategory || ReceivingData.SubCategory === '' ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "User Details can not be empty" });
      }else {
         SubCategoryModel.SubCategorySchema.findOne({ 'SubCategory': { $regex : new RegExp("^" + ReceivingData.SubCategory + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category Find Query Error', 'SubCategoryManagement.controller.js', err);
               res.status(417).send({Status: false, ErrorCode: 417, Message: "Some error occurred while Validate the Sub Category!."});
            } else {
               if ( result !== null) {
                  res.status(200).send({Status: true, Available: false });
               } else {
                  res.status(200).send({Status: true, Available: true });
               }
            }
         });
      }
   };   
   // Sub Category Create -----------------------------------------------
   exports.SubCategory_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.SubCategory || ReceivingData.SubCategory === '' ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category can not be empty" });
      } else if (!ReceivingData.Category || ReceivingData.Category === ''  ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Category Details can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Category = ReceivingData.Category.map( obj => mongoose.Types.ObjectId(obj));
         var Create_SubCategory = new SubCategoryModel.SubCategorySchema({
            Category: ReceivingData.Category,
            SubCategory: ReceivingData.SubCategory,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_SubCategory.save(function(err, result) { // Sub Category Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category Creation Query Error', 'SubCategoryManagement.controller.js');
               res.status(417).send({Status: false, ErrorCode: 417, Message: "Some error occurred while creating the Sub Category!."});
            } else {
               SubCategoryModel.SubCategorySchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Category', select: 'Category' })
                  .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                  .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                  .exec(function(err_1, result_1) { // Sub Category FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category Find Query Error', 'SubCategoryManagement.controller.js', err_1);
                     res.status(417).send({status: false, ErrorCode: 417, Message: "Some error occurred while Find The Sub Category!."});
                  } else {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }
               });
            }
         });
      }
   };
   // Sub Category List -----------------------------------------------
   exports.SubCategory_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "User Details can not be empty" });
      }else {
         SubCategoryModel.SubCategorySchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Category', select: 'Category' })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Category Find Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category Find Query Error', 'SubCategoryManagement.controller.js', err);
               res.status(417).send({Status: false, ErrorCode: 417, Error:err, Message: "Some error occurred while Find The Sub Category!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
   // Sub Category Simple List -----------------------------------------------
   exports.SubCategory_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === '') {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "User Details can not be empty" });
      } else if (!ReceivingData.Category || ReceivingData.Category === '') {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Category Details can not be empty" });
      } else {
         SubCategoryModel.SubCategorySchema.find({ 'Category': mongoose.Types.ObjectId(ReceivingData.Category) , 'If_Deleted': false }, { SubCategory : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Sub Category Find Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category Find Query Error', 'SubCategoryManagement.controller.js', err);
               res.status(417).send({Status: false, ErrorCode: 417, Error:err, Message: "Some error occurred while Find The Sub Category!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
   // Sub Category Update -----------------------------------------------
   exports.SubCategory_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.SubCategory_Id || ReceivingData.SubCategory_Id === '' ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category Details can not be empty" });
      }else if(!ReceivingData.Category || ReceivingData.Category === '' ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Category can not be empty" });
      }else if(!ReceivingData.SubCategory || ReceivingData.SubCategory === '' ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Modified User Details can not be empty" });
      }else {
         SubCategoryModel.SubCategorySchema.findOne({'_id': ReceivingData.SubCategory_Id}, {}, {}, function(err, result) { // Sub Category FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category FindOne Query Error', 'SubCategoryManagement.controller.js', err);
               res.status(417).send({Status: false, ErrorCode: 417, Error:err, Message: "Some error occurred while Find The Sub Category!."});
            } else {
               if (result !== null) {
                  ReceivingData.Category = mongoose.Types.ObjectId(ReceivingData.Category);
                  result.Category = ReceivingData.Category;
                  result.SubCategory = ReceivingData.SubCategory;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Sub Category Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category Update Query Error', 'SubCategoryManagement.controller.js');
                        res.status(417).send({Status: false, ErrorCode: 417, Error: err_1, Message: "Some error occurred while Update the Sub Category!."});
                     } else {
                        CategoryModel.CategorySchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Category', select: 'Category' })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // Sub Category FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category Find Query Error', 'SubCategoryManagement.controller.js', err_2);
                              res.status(417).send({Status: false, ErrorCode: 417, Message: "Some error occurred while Find The Sub Category!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category Details can not be valid!" });
               }
            }
         });
      }
   };
   // Sub Category Delete -----------------------------------------------
   exports.SubCategory_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.SubCategory_Id || ReceivingData.SubCategory_Id === '' ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category Details can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, ErrorCode: 400, Message: "Modified User Details can not be empty" });
      }else {
         SubCategoryModel.SubCategorySchema.findOne({'_id': ReceivingData.SubCategory_Id}, {}, {}, function(err, result) { // Sub Category FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category FindOne Query Error', 'SubCategoryManagement.controller.js', err);
               res.status(417).send({Status: false, ErrorCode: 417, Error:err, Message: "Some error occurred while Find The Sub Category!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Sub Category Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Sub Category Delete Query Error', 'SubCategoryManagement.controller.js');
                        res.status(417).send({Status: false, ErrorCode: 417, Error: err_1, Message: "Some error occurred while Delete the Sub Category!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, ErrorCode: 400, Message: "Sub Category Details can not be valid!" });
               }
            }
         });
      }
   };