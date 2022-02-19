Ext.Ajax.on('beforerequest', function(conn, options){
    conn.defaultHeaders = {
        'Authorization': 'Bearer ' + App.Desktop.apiToken
    };
});

Ext.Ajax.on('requestexception', function (conn, response, options) {
    let responseText = response.responseText;
    let responseXML = response.responseXML;


    if (responseText && !responseXML) {
        let o = Ext.decode(responseText);
        switch (o.code) {
            case 401:
                if (o.message === 'Expired JWT Token') {
                    Ext.Ajax.request({
                        url: '/security/api/token',
                        success: function(response, opts) {
                            let obj = Ext.decode(response.responseText);
                            App.Desktop.apiToken = obj.token;
                        },
                        failure: function(response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
                break;
        }
    }
});
