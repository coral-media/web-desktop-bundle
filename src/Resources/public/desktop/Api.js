Ext.Ajax.on('beforerequest', function (conn, options) {
    conn.defaultHeaders = {
        'Authorization': 'Bearer ' + App.Desktop.apiToken
    };
});

Ext.Ajax.on('requestexception', function (conn, response, options) {
    let responseText = response.responseText;
    let responseXML = response.responseXML;
    console.log(response);

    if (responseText && !responseXML) {
        let o = Ext.decode(responseText);
        switch (o.code) {
            case 401:
                if (o.message === 'Expired JWT Token') {
                    if(localStorage.getItem('refreshToken') !== null) {
                        let refreshToken = localStorage.getItem('refreshToken');
                        localStorage.setItem('refreshToken', '');
                        Ext.Msg.show({
                            title:'Refresh authentication token?',
                            msg: 'If you press <i>No</i> you will be redirected to the login page',
                            buttons: Ext.Msg.YESNOCANCEL,
                            fn: function(btn) {
                                switch (btn) {
                                    case 'yes':
                                        Ext.Ajax.request({
                                            url: '/api/security/token/refresh',
                                            method: 'POST',
                                            params: {refresh_token: refreshToken},
                                            success: function (response, opts) {
                                                let objResponse = Ext.decode(response.responseText);
                                                App.Desktop.apiToken = objResponse['token'];
                                                localStorage.setItem('refreshToken', objResponse['refresh_token']);
                                                localStorage.setItem('token', objResponse['token']);
                                            },
                                            failure: function (response, opts) {
                                                console.log('server-side failure with status code ' + response.status);
                                            }
                                        });
                                        break;
                                    case 'no':
                                        window.location.href = '/desktop/login'
                                        break;

                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }
                } else {
                    window.location.href = '/desktop/login'
                }
                break;
        }
    }
});
