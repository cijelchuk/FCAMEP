const express = require('express');
const write = require('fs');
var http = require('http');
var url = require('url');
var qs = require('querystring');

// Mines
// var writer = require('./writer');

const app = express();
const port = 3000;

// Para poder leer los parámetros en POST:
app.use(express.urlencoded());
app.use(express.json());

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<b>Hello World!</b>');
  }).listen(8070);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/start', (req, res) => {
    // Interpreta todo lo que va después del '?' en /start?...
    //var message = req.url.substring(7);

    // Interpreta las variables /?year=2017&month=July&name=Daniel
    var q = url.parse(req.url, true).query;
    var name = q.name;
    
    var html = writer.start() + writer.signBar() + writer.landing(name) + writer.end();
    res.send(html);
    console.log(req.session);
})

app.get('/signup', (req, res) => {
    //var html = writer.start() + writer.signup() + writer.end();
    //res.send(html);

    signup(req, res, "");
})

function signup(req, res, msg)
{
    var html = writer.start() + writer.warning(msg) + writer.signup() + writer.end();
    res.send(html);
}

app.post('/dosignup', (req, res) => {
    //var q = url.parse(req.url, true).query;
    var message = req.url;
    var msg = "";
    var body = '';

    //var q = new url.URLSearchParams(req.query);
    
    console.log(req.url + req.body.name);
    if(req.body.pswd != req.body.pswd2) {msg = "Las contraseñas no coinciden";}
    if(req.body.pswd == "") {msg = "La contraseña no puede estar vacía";}
    if(req.body.email == "") {msg = "El correo ingresado no es válido";}
    if(req.body.name == "") {msg = "El nombre no puede estar vacío";}

    signup(req, res, msg);
})

app.get('/login', (req, res) => {
    var html = writer.start() + writer.login() + writer.end();
    res.send(html);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})






app.post('/login/authenticate', (req, res) => {
    //var q = url.parse(req.url, true).query;
    console.log(req.url);
    console.log('Usuario: ' + req.body.Usuario);
    console.log('Clave: ' + req.body.Clave);
    
    let response = {
        "usuario": req.body.Usuario,
        "clave": req.body.Clave,
        "autenticado": true,
        "token": "eyJhbGci.OiJIUzI1NiIsInR5cCI6.IkpXVCJ9",
        "fechaExpiracion": "07/04/2020 15:00:00",
        "mensaje": ""
    };
        
    res.send(JSON.stringify(response));
})




app.post('/operacion', (req, res) => {
    //var q = url.parse(req.url, true).query;
    console.log(req.url);
    const auth = req.get("Authorization");
    var response = '';

    if(auth.substring(0, 6) == 'Bearer ')
    {
        token = auth.substring(7, auth.length - 1);
        console.log('Token: ' + token);

        response = 
        {
            "numeroRegistracion":"26218503",
            "mensaje":"8000-La transferencia fue aceptada",
            "fechaActualizacion":"16/05/2019 12:07:10",
            "procesadaOk": true,
            "saldo": "124566,89"
        };
    }
    else
    {
        response =
        {
            "numeroRegistracion":"0",
            "mensaje":"815-Cuenta deudora inexistente en MEP",
            "fechaActualizacion":"16/05/2019 16:07:51",
            "procesadaOk":false
        };
    }
    
    res.send(JSON.stringify(response));
})

// CONSULTA DE SALDO
app.get('/saldo', (req, res) => {
    var q = url.parse(req.url, true).query;
    var cuenta = q.cuenta;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7);
    var response = '';
    
    console.log(val + '.');

    if(val == 'Bearer ')
    {
        if(cuenta > 1000)
        {
            response = {
                "cuenta": cuenta,
                "entidad": "80009",
                "saldo": "6735878,11",
                "saldoApertura": "0,00",
                "totalDebitos": "264121,89",
                "totalCreditos": "7000000,00"
            };
            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError": "871-cuenta inexistente"
            };
            res.statusCode = 404;         
        }
    }
    else
    {
        response =
        {
            "numeroRegistracion":"0",
            "mensaje":"815-Cuenta deudora inexistente en MEP",
            "fechaActualizacion":"16/05/2019 16:07:51",
            "procesadaOk":false
        };

        res.statusCode = 400;
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE SALDOS HISTÓRICOS
app.get('/saldo/historicos', (req, res) => {
    var q = url.parse(req.url, true).query;
    var cuenta = q.cuenta;
    var fecha = q.fecha;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var yyyy = fecha.substring(0, 4);
    var mm = fecha.substring(4, 6);
    var dd = fecha.substring(6, 8);
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(cuenta > 1000 || !cuenta)
        {
            response = {
                "saldos": [
                    {
                        "entidad": "11",
                        "cuenta": "11",
                        "fecha": yyyy + '/' + mm + '/' + dd,
                        "saldoInicial": "50,20",
                        "totalDebitos": "5,00",
                        "totalCreditos": "20,80",
                        "saldoCierre": "66,00"
                    },
                    {
                        "entidad": "11",
                        "cuenta": "11001",
                        "fecha": "25/01/2019",
                        "saldoInicial": "0,00",
                        "totalDebitos": "1000",
                        "totalCreditos": "4000",
                        "saldoCierre": "3000"
                    },
                    {
                        "entidad": "11",
                        "cuenta": "11002",
                        "fecha": "03/07/2018",
                        "saldoInicial": "2,00",
                        "totalDebitos": "0,00",
                        "totalCreditos": "0,00",
                        "saldoCierre": "2,00"
                    }        
                ]
            };

            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError": "871-cuenta inexistente"
            };
            res.statusCode = 404;         
        }
    }
    else
    {
        response =
        {
            "numeroRegistracion":"0",
            "mensaje":"815-Cuenta deudora inexistente en MEP",
            "fechaActualizacion":"16/05/2019 16:07:51",
            "procesadaOk":false
        };
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE SALDOS de Cuentas de Garantías de las Cámaras Electrónicas Compensadoras
app.get('/saldo/camara', (req, res) => {
    var q = url.parse(req.url, true).query;
    var tipoCuenta = q.tipoCuenta;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(tipoCuenta)
        {
            response = 
            {
                "cuenta":"1234",
                "entidad":"80009",
                "saldo":"6735878,11"
            };

            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError":"802-Entidad informante inexistente en MEP"
            };
            res.statusCode = 400;         
        }
    }
    else
    {
        response =
        {
            "numeroRegistracion":"0",
            "mensaje":"815-Cuenta deudora inexistente en MEP",
            "fechaActualizacion":"16/05/2019 16:07:51",
            "procesadaOk":false
        };
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE MOVIMIENTOS
app.get('/movimientos', (req, res) => {
    var q = url.parse(req.url, true).query;
    var cuenta = q.cuenta;
    var origen = q.origen;
    var offset = q.offset;
    var limit = q.limit;
    var order = q.order;
    var tipo = q.tipo;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(cuenta && origen)
        {
            response = 
            {
                "metadata": 
                {
                    "resultset":
                    {
                        "count":180,
                        "offset":5,
                        "limit":5
                    }
                },
                "movimientos": [
                    {
                        "operatoria":"UG1",
                        "transaccion":"26290581/1", "entidadDeudora":"11",
                        "cuentaDeudora":"11",
                        "entidadAcreedora":"100",
                        "cuentaAcreedora":"100",
                        "importe":"66,59",
                        "instruccionDePago": "CG;4578;",
                        "fechaProcesado":"02/09/2019 12:40:25",
                        "numeroInterno":"WS01"
                    }, 
                    {
                        "operatoria":"UG1", 
                        "transaccion":"26290583/1",
                        "entidadDeudora":"11",
                        "cuentaDeudora":"11",
                        "entidadAcreedora":"100",
                        "cuentaAcreedora":"100",
                        "importe":"596,34",
                        "instruccionDePago": "CG;4579;",
                        "fechaProcesado":"02/09/2019 12:40:26",
                        "numeroInterno":"WS02"
                    }
                ]};

            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError":"901-MEP Cerrado"
            };
            res.statusCode = 400;         
        }
    }
    else
    {
        response =
        {
            "numeroRegistracion":"0",
            "mensaje":"815-Cuenta deudora inexistente en MEP",
            "fechaActualizacion":"16/05/2019 16:07:51",
            "procesadaOk":false
        };
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE MOVIMIENTOS (ARCHIVO MPC)
app.get('/movimientos/mpc', (req, res) => {
    var q = url.parse(req.url, true).query;
    var cuenta = q.cuenta;
    var origen = q.origen;
    var order = q.order;
    var numeroDesde = q.numeroDesde;
    var tipo = q.tipo;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(cuenta && origen)
        {
            response = `ent deudora;cta deudora;ent acreedora;cta acreedora;nro operacion;importe;operatoria;fecha;instruccion pago 11;11;14;14;26177657/1;2.00;UZZ;25/01/2019 12:14:35;MP;8;11;11;14;14;26177659/1;3.00;UZZ;25/01/2019 12:57:17;MP;10;11;11;14;14;26177660/1;1.00;UZZ;25/01/2019 12:57:18;MP;9;`;
            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError":"901-MEP Cerrado"
            };
            res.statusCode = 400;         
        }
    }
    else
    {
        response =
        {
            "numeroRegistracion":"0",
            "mensaje":"815-Cuenta deudora inexistente en MEP",
            "fechaActualizacion":"16/05/2019 16:07:51",
            "procesadaOk":false
        };
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE MOVIMIENTO PUNTUAL
app.get('/movimientos/*', (req, res) => {
    var q = url.parse(req.url, true).query;
    console.log(q);

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(1 == 1)
        {
            response = 
            {
                "operatoria": "DK0",
                "transaccion": "26312817/1",
                "entidadDeudora": "80009",
                "cuentaDeudora": "80009",
                "entidadAcreedora": "7",
                "cuentaAcreedora": "7",
                "importe": "123,50",
                "instruccionDePago": "REF01;30500011382;30;4500;TV;Observaciones...;",
                "fechaProcesado": "02/06/2020 11:03:28",
                "numeroInterno": "WS1002",
            };
            
            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError":"901-MEP Cerrado"
            };
            res.statusCode = 400;         
        }
    }
    else
    {
        response =
        {
            "mensajeError":"883-Movimiento no corresponde con entidad informante"
        };
        res.statusCode = 400;  
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE CUENTAS
app.get('/consulta/cuentas', (req, res) => {
    var q = url.parse(req.url, true).query;
    var codigoEntidad = q.codigoEntidad;
    var codigoCuenta = q.codigoCuenta;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(codigoEntidad && codigoEntidad > 10)
        {
            response = 
            {
                "metadata":
                {
                    "resultset":
                    {
                        "count":1453,
                        "offset":0,
                        "limit":2
                    }
                },
                "cuentas": [
                    {
                        "codigoCuenta":codigoCuenta,
                        "codigoEntidad":codigoEntidad,
                        "descripcion":"DEP EN USD SERV TIT PUB. B OF N YORK",
                        "moneda":"USD",
                        "estado":"1"
                    },
                    {
                        "codigoCuenta":codigoCuenta,
                        "codigoEntidad":codigoEntidad,
                        "descripcion":"DEP EN YENES CANJE DEUD B OF N YORK",
                        "moneda":"JPY",
                        "estado":"1"
                    }
                ]
            };

            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError":"871-Cuenta inexistente"
            };
            res.statusCode = 400;
        }
    }
    else
    {
        response = 
            {
                "mensajeError":"871-Cuenta inexistente"
            };
        res.statusCode = 400;
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE OPERATORIAS
app.get('/consulta/operatorias', (req, res) => {
    var q = url.parse(req.url, true).query;
    var codigoOperatoria = q.codigoOperatoria;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(codigoOperatoria && codigoOperatoria != 'X')
        {
            response = 
            {
                "metadata":
                {
                "resultset":
                {
                "count":1,
                "offset":0,
                "limit":25
                }
                },
                "operatorias": [
                {
                "codigo":"DL0",
                "descripcion":"TRANSF MISMO TITULAR",
                "horaDesde":"08:00",
                "horaHasta":"11:00",
                "estado":"1",
                "cuentaContrapartida":"000",
                "entidadIgual":"N",
                "monedaIgual":"S",
                "instruccionDePago": [
                {
                "tipoDato":"CBU",
                "tag":"CBA",
                "nombre":"CBU Beneficiario",
                "orden": 1,
                "requerido":"1",
                "parametro":"A",
                "longitudMaxima":22,
                "longitudMinima":6,
                "valorMinimo":"",
                "valorMaximo":""
                },
                {
                "tipoDato":"CUIT",
                "tag":"CUA",
                "nombre":"CUIT / CUIL Beneficiario",
                "orden": 2,
                "requerido":"1",
                "parametro":"I",
                "longitudMaxima":11,
                "longitudMinima":11,
                "valorMinimo":"",
                "valorMaximo":""
                }
                ],
                "cuentasAlDebito": [
                {
                "codigoCuenta":"11",
                "codigoEntidad":"11"
                },
                {
                "codigoCuenta":"14",
                "codigoEntidad":"14"
                },
                {
                "codigoCuenta":"147",
                "codigoEntidad":"147"
                }
                ],
                "cuentasAlCredito": [
                {
                "codigoCuenta":"165",
                "codigoEntidad":"165"
                }
                ]
                } 
                ]
            };

            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError": "801-Operatoria inexistente"
            };
            res.statusCode = 400;
        }
    }
    else
    {
        response = 
            {
                "mensajeError": "801-Operatoria inexistente"
            };
        res.statusCode = 400;
    }
    
    res.send(JSON.stringify(response));
})


// CONSULTA DE TABLAS
app.get('/consulta/tablas', (req, res) => {
    var q = url.parse(req.url, true).query;
    var idTabla = q.idTabla;

    const auth = req.get("Authorization");
    var val = auth.substring(0, 7)
    var response = '';
    
    if(val == 'Bearer ')
    {
        if(idTabla && ["092", "030", "068", "101"].filter(a => a == idTabla).length > 0)
        {
            response = 
            {
                "metadata":
                {
                "resultset":
                {
                "count":77,
                "offset":0,
                "limit":2
                }
                },
                    "tablas": [
                    {
                    "id":idTabla,
                    "nombre":"Tipo de Operatorias de Camaras",
                    "contenidos": [
                    {
                    "codigo":"ACRL",
                    "contenido":"ARGENCLEAR"
                    },
                    {
                    "codigo":"AMEX",
                    "contenido":"American Expres"
                    },
                    {
                    "codigo":"ARGE",
                    "contenido":"Mastercard"
                    },
                    {
                    "codigo":"VISA",
                    "contenido":"Visa"
                    }
                    ]
                    },
                    {
                    "id":"014",
                    "nombre":"Coparticipacion de Impuestos",
                    "contenidos": [
                    {
                    "codigo":"01",
                    "contenido":"Ley 23.548"
                    },
                    {
                    "codigo":"02",
                    "contenido":"Ley 23.906 art. 3 y 4"
                    },
                    {
                    "codigo":"03",
                    "contenido":"Ley 23.966 art. 5"
                    }
                    ]
                    }
                    ]
            };
            res.statusCode = 200;
        }
        else
        {
            response = 
            {
                "mensajeError":"886-Tabla inexistente"
            };
            res.statusCode = 400;
        }
    }
    else
    {
        response = 
        {
            "mensajeError":"886-Tabla inexistente"
        };
        res.statusCode = 400;
    }
    
    res.send(JSON.stringify(response));
})

