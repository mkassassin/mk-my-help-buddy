module.exports = function(app) {

   var Controller = require('./../../controllers/Admin/CategoryManagement.controller');
   
   app.post('/API/CategoryManagement/Category_AsyncValidate', Controller.Category_AsyncValidate);
   app.post('/API/CategoryManagement/Category_Create', Controller.Category_Create);
   app.post('/API/CategoryManagement/Category_List', Controller.Category_List);
   app.post('/API/CategoryManagement/Category_SimpleList', Controller.Category_SimpleList);
   app.post('/API/CategoryManagement/Category_Update', Controller.Category_Update);
   app.post('/API/CategoryManagement/Category_Delete', Controller.Category_Delete);

};