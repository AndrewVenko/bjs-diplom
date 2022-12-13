'use strict';
const logoutButton = new LogoutButton();
// выход из личного кабинета
logoutButton.action = () => ApiConnector.logout((logout) => {
    if(logout.success){
        location.reload();
    };
});
// запрос на получение текущего пользователя
ApiConnector.current((response) => {
    if(response.success){
        ProfileWidget.showProfile(response.data);
    };
});
// получение текущих курсов валют
const tableBody = new RatesBoard();
ApiConnector.getStocks((response) => {
    if(response.success){
        tableBody.clearTable();
        tableBody.fillTable(response.data);
    };
});
// операции с деньгами
// пополнение баланса
let addMoneyForm = new MoneyManager();
addMoneyForm.addMoneyCallback = (request) => {
    ApiConnector.addMoney(request, (req) => {
        if(req.success){
            ProfileWidget.showProfile(req.data);
            addMoneyForm.setMessage(true, 'Пополнение баланса прошло успешно!');
        } else{
            addMoneyForm.setMessage(false, 'Ошибка, не удалось пополнить баланс!');
        };
    });
};
// конвертирование валют
addMoneyForm.conversionMoneyCallback = (request) => {
    ApiConnector.convertMoney(request, (req) => {
        if(req.success){
            ProfileWidget.showProfile(req.data);
            addMoneyForm.setMessage(true, 'Конвертирование валюты прошло успешно!');
        } else{
            addMoneyForm.setMessage(false, 'Ошибка, не удалось выполнить конвертирование!');
        };
    });
};
//перевод валюты
addMoneyForm.sendMoneyCallback = (request) => {
    ApiConnector.transferMoney(request, (req) => {
        if(req.success){
            ProfileWidget.showProfile(req.data);
            addMoneyForm.setMessage(true, 'Перевод валюты прошел успешно!');
        } else{
            addMoneyForm.setMessage(false, 'Ошибка, не удалось выполнить перевод!');
        };
    });
};
//работа с избранным
// запрос начального списка избранного
let favoritesTableBody = new FavoritesWidget();
ApiConnector.getFavorites((request) => {
    if(request.success){
        favoritesTableBody.clearTable();
        favoritesTableBody.fillTable(request.data);
        addMoneyForm.updateUsersList(request.data);
    };
});
// добавление в список избранного
favoritesTableBody.addUserCallback = (object) => {
    ApiConnector.addUserToFavorites(object, (request) => {
        if(request.success){
            favoritesTableBody.clearTable();
            favoritesTableBody.fillTable(request.data);
            addMoneyForm.updateUsersList(request.data);
            favoritesTableBody.setMessage(true, 'Пользователь добавлен в список избранного!');
        } else{
            favoritesTableBody.setMessage(false, 'Не удалось добавить пользователя в список избранного!');
        };
    });
};
// удаление из списка избранного
favoritesTableBody.removeUserCallback = (request) => {
    ApiConnector.removeUserFromFavorites(request, (req) => {
        if(req.success){
            favoritesTableBody.clearTable();
            favoritesTableBody.fillTable(req.data);
            addMoneyForm.updateUsersList(req.data);
            favoritesTableBody.setMessage(true, 'Пользователь удален из списка избранного!');
        } else{
            favoritesTableBody.setMessage(false, 'Не удалось удалить пользователя!');
        };
    });
};