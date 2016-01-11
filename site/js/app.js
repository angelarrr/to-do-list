// create model toDo which will store string of text and check if task has been completed or not
var toDo = Backbone.Model.extend({
	defaults: {
		task: '',
		completed: false
	}
});
