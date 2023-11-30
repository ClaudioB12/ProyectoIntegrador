var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* LISTAR */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM carrito ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('carrito/index',{data:''});   
    } else {
        res.render('carrito/index',{data:rows});
    }
  });
});

/* VER FORMULARIO ADD */
router.get('/add', function(req, res, next) {    
  res.render('carrito/add', {
      id_clientes: '',
      id_productos: '',
      cantidad: ''
  })
})

router.post('/add', function(req, res, next) {    
  let razonsocial = req.body.razonsocial;
  let documento = req.body.documento;
  let direccion = req.body.direccion;
  let celular = req.body.celular;

  let errors = false;

  if(razonsocial.length === 0) {
    errors = true;
    req.flash('error', "Please enter name");
    res.render('clientes/add', {
      razonsocial: razonsocial
    });
  }

  // if no error
  if(!errors) {
    var form_data = {
      razonsocial: razonsocial,
      documento: documento,
      direccion: direccion,
      celular: celular
    };

    dbConn.query('INSERT INTO clientes SET ?', form_data, function(err, result) {
      if (err) {
        req.flash('error', err);
        res.render('clientes/add', {
          razonsocial: form_data.razonsocial,
          documento: form_data.documento,
          direccion: form_data.direccion,
          celular: form_data.celular
        });
      } else {                
        req.flash('success', 'Cliente successfully added');
        res.redirect('/clientes');
      }
    });
  }
});

/* VER FORMULARIO EDITAR */
router.get('/edit/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM clientes WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/clientes')
      }
      else {
          res.render('clientes/edit', {
              id: rows[0].id,
              razonsocial: rows[0].razonsocial,
              documento: rows[0].documento

          })
      }
  })
})

/* ACTUALIZAR FORMULARIO BASE DE DATOS */
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let razonsocial = req.body.razonsocial;
  let documento = req.body.documento;
  let errors = false;

  if(razonsocial.length === 0,documento.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('clientes/edit', {
          id: req.params.id,
          razonsocial: form_data.razonsocial,
          documento: form_data.documento

      })
  }



  if( !errors ) {   
      var form_data = {
        razonsocial: razonsocial,
        documento:documento
      }
      dbConn.query('UPDATE clientes SET ? WHERE id = ' + id, form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('clientes/edit', {
                  id: req.params.id,
                  razonsocial: form_data.razonsocial,
                  documento: form_data.documento
              })
          } else {
              req.flash('success', 'Registro successfully updated');
              res.redirect('/clientes');
          }
      })
  }
})

/* ELIMINAR REGISTRO BASE DE DATOS */
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM clientes WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/clientes')
      } else {
          req.flash('success', 'REGISTRO successfully deleted! ID = ' + id)
          res.redirect('/clientes')
      }
  })
})

module.exports = router;