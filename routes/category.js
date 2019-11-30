var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {	
	// fetch and sort users collection by id in descending order
	req.db.collection('category').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('category/list', {
				title: 'Category List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('category/list', {
				title: 'Category List', 
				data: result
			})
		}
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('category/add', {
		title: 'Add New Category',
		name: '',
		usn: '',
		dept: '',
		dob: '',
		email: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('status', 'Status is required').notEmpty()             //Validate age
      //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var category = {
			name: req.sanitize('name').escape().trim(),
			status: req.sanitize('usn').escape().trim()
		}
				 
		req.db.collection('category').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('category/add', {
					title: 'Add New Category',
					name: category.name,
					status: category.status
								
				})
			} else {				
				req.flash('success', 'Data added successfully!')
				
				// redirect to user list page				
				res.redirect('/category')
				
				// render to views/user/add.ejs
				/*res.render('user/add', {
					title: 'Add New User',
					name: '',
					usn: '',
					dept: '',
					dob: '',
					email: ''					
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('category/add', { 
            title: 'Add New Category',
            name: req.body.name,
            status: req.body.status
           
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('category').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if user not found
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/category')
		}
		else { // if user found
			// render to views/user/edit.ejs template file
			res.render('category/edit', {
				title: 'Edit Category', 
				//data: rows[0],
				id: result[0]._id,
				name: result[0].name,
				status: result[0].status				
			})
		}
	})	
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('status', 'Status is required').notEmpty()             //Validate age
    

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var category = {
			name: req.sanitize('name').escape().trim(),
			status: req.sanitize('status').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('category').update({"_id": o_id}, category, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/edit.ejs
				res.render('category/edit', {
					title: 'Edit Category',
					id: req.params.id,
					name: req.body.name,
					status: req.body.status
				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/category')
				
				// render to views/user/edit.ejs
				/*res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					usn: req.body.usn,
					dept: req.body.dept,
					dob: req.body.dob,
					email: req.body.email
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('category/edit', { 
            title: 'Edit Category',            
			id: req.params.id, 
			name: req.body.name,
			status: req.body.status
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('category').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list page
			res.redirect('/category')
		} else {
			req.flash('success', 'Category deleted successfully! id = ' + req.params.id)
			// redirect to users list page
			res.redirect('/category')
		}
	})	
})

module.exports = app
