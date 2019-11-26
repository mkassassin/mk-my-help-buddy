module.exports = function(app) {

   var Controller = require('./../../controllers/Admin/AdminManagement.controller');

   
   app.post('/API/AdminManagement/User_Create', Controller.User_Create);
   app.post('/API/AdminManagement/User_Login_Validate', Controller.User_Login_Validate);

   app.post('/API/AdminManagement/Country_List', Controller.Country_List);
   app.post('/API/AdminManagement/State_List', Controller.State_List);
   app.post('/API/AdminManagement/City_List', Controller.City_List);

};