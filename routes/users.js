var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {	
	// fetch and sort users collection by id in descending order
	req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'Time table List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/list', {
				title: 'Time table List', 
				data: result
			})
		}
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add time Table',
		name: '',
		usn: '',
		dept: '',
		dob: '',
		email: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Subject name is required').notEmpty()           //Validate name
	req.assert('usn', 'Subject code is required').notEmpty() 
	req.assert('dept', 'dept is required').notEmpty()  
	req.assert('dob', 'date of exam is required').notEmpty()            //Validate age
    req.assert('email', 'time is required valid email is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			usn: req.sanitize('usn').escape().trim(),
			dept: req.sanitize('dept').escape().trim(),
			dob: req.sanitize('dob').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
				 
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('user/add', {
					title: 'Add Time table',
					name: user.name,
					usn: user.usn,
					dept: user.dept,
					dob: user.dob,
					email: user.email					
				})
			} else {				
				req.flash('success', 'Data added successfully!')
				
				// redirect to user list page				
				res.redirect('/users')
				
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
        res.render('user/add', { 
            title: 'Add time table',
            name: req.body.name,
			usn: req.body.usn,
			dept: req.body.dept,
			dob:req.body.dob,
            email: req.body.email
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if user not found
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else { // if user found
			// render to views/user/edit.ejs template file
			res.render('user/edit', {
				title: 'Edit Time table', 
				//data: rows[0],
				id: result[0]._id,
				name: result[0].name,
				usn: result[0].usn,
				dept: result[0].dept,
				dob: result[0].dob,
				email: result[0].email					
			})
		}
	})	
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Subject name is required').notEmpty()           //Validate name
	req.assert('usn', 'Subject code is required').notEmpty() 
	req.assert('dept', 'dept is required').notEmpty()  
	req.assert('dob', 'date of exam is required').notEmpty()            //Validate age
    req.assert('email', 'time is required valid email is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			usn: req.sanitize('usn').escape().trim(),
			dept: req.sanitize('dept').escape().trim(),
			dob: req.sanitize('dob').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/edit.ejs
				res.render('user/edit', {
					title: 'Edit time table',
					id: req.params.id,
					name: req.body.name,
					usn: req.body.usn,
					dept: req.body.dept,
					dob: req.body.dob,
					email: req.body.email
				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/users')
				
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
        res.render('user/edit', { 
            title: 'Edit time table',            
			id: req.params.id, 
			name: req.body.name,
			usn: req.body.usn,
			dept: req.body.dept,
			dob: req.body.dob,
			email: req.body.email
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list page
			res.redirect('/users')
		} else {
			req.flash('success', 'deleted successfully! id = ' + req.params.id)
			// redirect to users list page
			res.redirect('/users')
		}
	})	
})

module.exports = app
