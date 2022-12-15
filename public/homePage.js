'use strict';
const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();
// выход из личного кабинета
logoutButton.action = () => ApiConnector.logout((logout) => {
    if(logout.success){
        location.reload();
        clearInterval(intervel);
    };
});
// запрос на получение текущего пользователя
ApiConnector.current((response) => {
    if(response.success){
        ProfileWidget.showProfile(response.data);
    } else{
        moneyManager.setMessage(false, 'Не удалось получить данный пользователя!');
    };
});
// получение текущих курсов валют
ApiConnector.getStocks((response) => {
    if (response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    } else{
        moneyManager.setMessage(false, 'Не удалось получить текущий курс валют!');
    };
});
// таймер раз в минуту
let intervel = setInterval(()=>{
	ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        } else{
            moneyManager.setMessage(false, 'Не удалось получить текущий курс валют!');
        };
    });
}, 60000);
// операции с деньгами
// пополнение баланса
moneyManager.addMoneyCallback = (request) => {
    ApiConnector.addMoney(request, (req) => {
        if(req.success){
            ProfileWidget.showProfile(req.data);
            moneyManager.setMessage(true, 'Пополнение баланса прошло успешно!');
        } else{
            moneyManager.setMessage(false, 'Ошибка, не удалось пополнить баланс!');
        };
    });
};
// конвертирование валют
moneyManager.conversionMoneyCallback = (request) => {
    ApiConnector.convertMoney(request, (req) => {
        if(req.success){
            ProfileWidget.showProfile(req.data);
            moneyManager.setMessage(true, 'Конвертирование валюты прошло успешно!');
        } else{
            moneyManager.setMessage(false, 'Ошибка, не удалось выполнить конвертирование!');
        };
    });
};
// перевод валюты
moneyManager.sendMoneyCallback = (request) => {
    ApiConnector.transferMoney(request, (req) => {
        if(req.success){
            ProfileWidget.showProfile(req.data);
            moneyManager.setMessage(true, 'Перевод валюты прошел успешно!');
        } else{
            moneyManager.setMessage(false, 'Ошибка, не удалось выполнить перевод!');
        };
    });
};
// работа с избранным
// запрос начального списка избранного
function returnCompletedTable(request){
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(request.data);
    moneyManager.updateUsersList(request.data);
};
ApiConnector.getFavorites((request) => {
    if(request.success){
        returnCompletedTable(request);
    };
});
// добавление в список избранного
favoritesWidget.addUserCallback = (object) => {
    ApiConnector.addUserToFavorites(object, (request) => {
        if(request.success){
            returnCompletedTable(request);
            favoritesWidget.setMessage(true, 'Пользователь добавлен в список избранного!');
        } else{
            favoritesWidget.setMessage(false, 'Не удалось добавить пользователя в список избранного!');
        };
    });
};
// удаление из списка избранного
favoritesWidget.removeUserCallback = (request) => {
    ApiConnector.removeUserFromFavorites(request, (request) => {
        if(request.success){
            returnCompletedTable(request);
            favoritesWidget.setMessage(true, 'Пользователь удален из списка избранного!');
        } else{
            favoritesWidget.setMessage(false, 'Не удалось удалить пользователя!');
        };
    });
};