$(function(){

var app = {};

// todo model
// ----------
// store string of text in task
// check if task has been completed or not
app.toDo = Backbone.Model.extend({
	// default attr for todo
	defaults: {
		task: '',
		completed: false
	},
	toggle: function(){
		this.save({
			completed: !this.get('completed')
		});
	}
});

// collection
// ----------
app.toDoList = Backbone.Collection.extend({
	model: app.toDo,
	localStorage: new Store("bb-todos"),
	// filter coompleted todos
	completed: function(){
		return this.where({ completed: true });
	},
	// filter remaining todos
	remaining: function(){
		return this.where({ completed: false });
	}
});

app.todos = new app.toDoList();

// views
// -----

// render individual todo item
app.toDoView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#todos-template').html()),
	events: {
		"click .toggle": "toggleComplete",
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));
		return this;
	},
	// toggle completed state of model
	toggleComplete: function(){
		this.model.toggle();
	}
});

// render full list of todos
app.toDoAppView = Backbone.View.extend({
	el: '.my-todo',

	countTemplate: _.template($('#count-template').html()),

	// events for adding new todo, checking all boxes
	events: {
		'keypress #add-todo': 'createOnEnter',
		'click #toggle-all': 'markAllCompleted'
	},

	initialize: function(){
		this.input = this.$('#add-todo');
		this.allChecks = this.$('#toggle-all')[0];

		this.listenTo(app.todos, 'add', this.addOne);
		this.listenTo(app.todos, 'reset', this.addAll);
		this.listenTo(app.todos, 'all', this.render);

		this.main = this.$('.main-content');
		this.footer = this.$('.footer');

		app.todos.fetch(); // load from local storage
	},

	render: function(){
		var completed = app.todos.completed().length;
		var remaining = app.todos.remaining().length;

		if (app.todos.length) {
			this.footer.html(this.countTemplate({ completed: completed, remaining: remaining }));
		}

		this.allChecks = !remaining;
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
		app.todos.create(this.newAttributes());
		this.input.val('');
	},
	// add single todo item
	addOne: function(todo){
		var view = new app.toDoView({ model: todo });
		$('.list-todos').append(view.render().el);
	},
	// add all items to collection at once
	addAll: function(){
		this.$('.list-todos').html('');
		app.todos.each(this.addOne, this);
	},
	markAllCompleted: function(){
		var completed = this.allChecks.checked;

		app.todos.each(function(todo){
			todo.save({
				completed: completed
			});
		});
	}
});

app.todoAppView = new app.toDoAppView();

});