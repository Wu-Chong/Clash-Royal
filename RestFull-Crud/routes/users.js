var express = require('express');
var router = express.Router();
const sql = require('mssql');
var createError = require('http-errors');
//oggetto di configurazione per accedere al database
const config = {
    user: 'wu.chong',
    password: 'xxx123#',
    server: '213.140.22.237',
    database: 'wu.chong',
}

/*  Tutte queste chiamate, porta a una callback hell
router.get('/no_use', function(req, res, next) {
  //connessione al databese, tramite la funzione connect di mssql, come parametri l'oggetto di
  //di configurazione e l'errore in caso non si connetta al database
  sql.connect(config, err => {
      if(err) console.log(err);
      //inizializzare una query
      let sqlRequest = new sql.Request();

      //come parametri si manda la query, l'errore e il risultato della query, quest'ultimi per convenzione
      sqlRequest.query('select * from dbo.[cr-unit-attributes]', (err, result) =>{ 
      if(err) console.log(err);
      res.send(result);
      });
  }); 
});

router.get('/no_use/search/:unit', function(req, res, next) {
  sql.connect(config, err => {
      if(err) console.log(err);
      let sqlRequest = new sql.Request();
      //res.params.parametro si riferisce al parametro che viene inserito all'interno dell'URL
      sqlRequest.query(`select * from dbo.[cr-unit-attributes] where Unit ='$req.params.unit'`, (err, result) =>{ 
      if(err) console.log(err);
      res.send(result);
      });
  }); 
});


router.post('/', function(req, res, next){
    console.log(req.body); // req.body contiene tutti i valori della form
    let Unit = req.body;
    if(!Unit){ //controlle che non ci siano doppioni uguali
        next(createError(400 , "Please provide a correct unit"));
    }
    sql.connect(config, err =>{
        //fa la query di insert
        let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit,Cost,Hit_Speed) VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}')`;
        let sqlRequest = new sql.Request();
        sqlRequest.query(sqlInsert, (err, result) =>{
             if (error) throw error;
             return res.send({ error: false, data: results, message: 'New user has been created successfully.'}); 
        })
    });
});
*/

//unica funzione dove passiamo le altre funzioni
let executeQuery = function (res, query, next) {
  //effettua la connessio e vengono passati 2 parametri config e la funzione dove viene passata il parametro 'err'
  sql.connect(config, function (err) {
    //verifica se non ci sono errori durante la connessione  
    if (err) { 
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    //crea una variabile per fare una richiesta
    var request = new sql.Request(); // create Request object
    //nella funzione viene passato come parametro la query indirizzato al DB, l'errore per la query e, se presnte il risultato della query
    request.query(query, function (err, result) {
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      res.send(result.recordset); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      sql.close();
    });

  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery(res, sqlQuery, next);
});

router.get('/search/:name', function (req, res, next) {
  let sqlQuery = `select * from dbo.[cr-unit-attributes] where Unit = '${req.params.name}'`;
  executeQuery(res, sqlQuery, next);
});

router.post('/', function (req, res, next) {
  // Add a new Unit  
  let unit = req.body;
  if (!unit) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit,Cost,Hit_Speed) 
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}')`;
  executeQuery(res, sqlInsert, next);
  res.send({success:true, message: "unità inserita con successo", unit: unit})
});


module.exports = router;
