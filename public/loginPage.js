'use strict';
const userForm = new UserForm();
// для авторизации
userForm.loginFormCallback = (data) => ApiConnector.login(data,
    (serverResponseLogin) => {if(serverResponseLogin.success){
        location.reload();
    } else{
        userForm.setLoginErrorMessage(serverResponseLogin.error);
    }
});
// для регистрации
userForm.registerFormCallback = (data) => ApiConnector.register(data,
    (serverResponseRegister) => {if(serverResponseRegister){
        location.reload();
    } else{
        userForm.setRegisterErrorMessage(serverResponseRegister.error);
    };
});