module.exports = function(app) {

   var Controller = require('./../../controllers/Admin/SubCategoryManagement.controller');
   
   app.post('/API/SubCategoryManagement/SubCategory_Create', Controller.SubCategory_Create);
   app.post('/API/SubCategoryManagement/SubCategory_List', Controller.SubCategory_List);
   app.post('/API/SubCategoryManagement/SubCategory_SimpleList', Controller.SubCategory_SimpleList);
   app.post('/API/SubCategoryManagement/SubCategory_Update', Controller.SubCategory_Update);
   app.post('/API/SubCategoryManagement/SubCategory_Delete', Controller.SubCategory_Delete);
   app.post('/API/SubCategoryManagement/SubCategory_AsyncValidate', Controller.SubCategory_AsyncValidate);

};