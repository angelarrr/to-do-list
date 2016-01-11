var app = {};

// create model toDo which will store string of text and check if task has been completed or not
app.toDo = Backbone.Model.extend({
	// default attr for todo
	defaults: {
		task: '',
		completed: false
	},
});

// collection
app.toDoList = Backbone.Collection.extend({
	model: app.toDo,
	localStorage: new Store("bb-todos")
});

app.todoList = new app.toDoList();

// views
// render individual todo item
app.toDoView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#todos-template').html()),
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
});

// render full list of todos
app.toDoAppView = Backbone.View.extend({
	el: '.my-todo',
	initialize: function(){
		this.input = this.$('#add-todo');
		app.todoList.on('add', this.addAll, this);
		app.todoList.on('reset', this.addAll, this);
		app.todoList.fetch(); // load from local storage
	},
	events: {
		'keypress #add-todo': 'createOnEnter'
	},
	newAttributes: function(){
		return {
			task: this.input.val().trim(),
			completed: false
		}
	},
	// when press enter, create new todo model
	createOnEnter: function(e){
		if (e.which !== 13 || !this.input.val().trim() ){
			return;
		}
		app.todoList.create(this.newAttributes());
		this.input.val('');
	},
	addOne: function(todo){
		var view = new app.toDoView({ model: todo });
		$('.list-todos').append(view.render().el);
	},
	addAll: function(){
		this.$('.list-todos').html('');
		app.todoList.each(this.addOne, this);
	}
});

app.todoAppView = new app.toDoAppView();