var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* LISTAR */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM productos ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('productos/index',{data:''});   
    } else {
        res.render('productos/index',{data:rows});
    }
  });
});

/* VER FORMULARIO ADD */
router.get('/add', function(req, res, next) {    
  res.render('productos/add', {
      nombre: '',
      descripcion: '',
      foto: '',
      stock: '',
      precio: '',
      CATEGORIAS_id: ''
  })
})

router.post('/add', function(req, res, next) {    
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let foto = req.body.foto;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let CATEGORIAS_id = req.body.CATEGORIAS_id;


  let errors = false;

  if(nombre.length === 0) {
    errors = true;
    req.flash('error', "Please enter name");
    res.render('productos/add', {
      nombre: nombre
    });
  }

  // if no error
  if(!errors) {
    var form_data = {
      nombre: nombre,
      descripcion: descripcion,
      foto: foto,
      stock: stock,
      precio: precio,
      CATEGORIAS_id: CATEGORIAS_id
    };

    dbConn.query('INSERT INTO productos SET ?', form_data, function(err, result) {
      if (err) {
        req.flash('error', err);
        res.render('productos/add', {
          nombre: form_data.nombre,
          descripcion: form_data.descripcion,
          foto: form_data.foto,
          stock: form_data.stock,
          precio: form_data.precio,
          CATEGORIAS_id: form_data.CATEGORIAS_id
        });
      } else {                
        req.flash('success', 'Producto successfully added');
        res.redirect('/Productos');
      }
    });
  }
});

/* VER FORMULARIO EDITAR */
router.get('/edit/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM productos WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/productos')
      }
      else {
          res.render('productos/edit', {
              id: rows[0].id,
              nombre: rows[0].nombre,
              descripcion: rows[0].descripcion,
              foto: rows[0].foto,
              stock: rows[0].stock,
              precio: rows[0].precio,
              CATEGORIAS_id: rows[0].CATEGORIAS_id          })
      }
  })
})

/* ACTUALIZAR FORMULARIO BASE DE DATOS */
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let foto = req.body.foto;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let CATEGORIAS_id = req.body.CATEGORIAS_id;
  let errors = false;

  if(nombre.length === 0,descripcion.length === 0,foto.length === 0,stock.length === 0,precio.length === 0,CATEGORIAS_id === 0){
      errors = true;
      req.flash('error', "Please enter name");
      res.render('clientes/edit', {
          id: req.params.id,
          nombre: form_data.nombre,
          descripcion: form_data.descripcion,
          foto: form_data.foto,
          stock: form_data.stock,
          precio: form_data.precio,
          CATEGORIAS_id: form_data.CATEGORIAS_id

      })
  }



  if( !errors ) {   
      var form_data = {
        nombre: nombre,
        descripcion: descripcion,
        foto: foto,
        stock: stock,
        precio: precio,
        CATEGORIAS_id: CATEGORIAS_id
      }
      dbConn.query('UPDATE productos SET ? WHERE id = ' + id, form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('productos/edit', {
                  id: req.params.id,
                  nombre: form_data.nombre,
                  descripcion: form_data.descripcion,
                  foto: form_data.foto,
                  stock: form_data.stock,
                  precio: form_data.precio,
                  CATEGORIAS_id: form_data.CATEGORIAS_id
              })
          } else {
              req.flash('success', 'Registro successfully updated');
              res.redirect('/productos');
          }
      })
  }
})

/* ELIMINAR REGISTRO BASE DE DATOS */
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM productos WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/productos')
      } else {
          req.flash('success', 'REGISTRO successfully deleted! ID = ' + id)
          res.redirect('/productos')
      }
  })
})

module.exports = router;