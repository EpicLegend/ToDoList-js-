
// global variables

var count = 0;
var state = {
	edit: false,
}

document.addEventListener("DOMContentLoaded", function () {

	function addTask () {
		var text = document.querySelector(".add__input").value;

		if(text != "") {
			count++;

			var container = document.querySelector('.app__content');

			document.querySelector(".add__input").value = "";

			// insert task
			container.append( generationTask(text) );

			save();
		}
	}

	function generationTask(text) {
		var item = document.createElement("div");
		item.classList.add('app__item');

		var number = document.createElement("div");
		number.classList.add("app__number");
		var number_content = document.createElement("span");
		number_content.append(count);
		number.append(number_content);

		var divtext = document.createElement("div");

		divtext.classList.add('app__text');
		var p = document.createElement("p")
		var span = document.createElement("span");
		span.append(text);
		p.append(span);
		var input = document.createElement("textarea");
		//input.setAttribute('type', 'text');
		input.classList.add("app__edit");
		p.append(input);
		divtext.append(p)


		var div = document.createElement("div");

		var done = document.createElement("button");
		done.classList.add("btn");
		done.classList.add("btn_done");
		done.addEventListener("click", doneTask);
		done.append("done");

		var edit = document.createElement("button");
		edit.classList.add("btn");
		edit.classList.add("btn_edit");
		edit.addEventListener("click" , editTask);
		edit.append("edit");

		var del = document.createElement("button");
		del.classList.add("btn");
		del.classList.add("btn_delete");
		del.addEventListener("click", deleteTask);
		del.append("delete");

		div.append(done);
		div.append(edit);
		div.append(del);

		divtext.append(div);

		item.append(number);
		item.append(divtext);

		return item;
	}

	function deleteTask () {
		count--;

		var parent = this.parentElement.parentElement.parentElement;

		parent.remove();

		state.edit = false;

		refreshTask();
	}

	function doneTask () {
		if ( !state.edit )  {
			this.parentElement.parentElement.parentElement.classList.toggle("app__item_done");

			if ( this.innerHTML == "done" ) {
				this.innerHTML = "refresh";
			} else {
				this.innerHTML = "done";
			}
		}

		save();
	}

	function refreshTask () {
		var items = document.querySelectorAll(".app__number span");

		for (var i = 0; i < count; i++) {
			items[i].innerHTML = i + 1;
		}

		save();
	}

	function editTask () {
		var container = this.parentElement.parentElement.querySelector("p");
		container.classList.toggle("edit");

		if ( this.innerHTML == "edit" ) {
			// открыть редактирование

			text = container.querySelector("span").innerHTML;

			container.querySelector(".app__edit").value = text;

			state.edit = true;
			this.innerHTML = "save";
		} else {
			// сохранить отредактированный текст

			container.querySelector("span").innerHTML = container.querySelector(".app__edit").value;

			state.edit = false;
			this.innerHTML = "edit";

			save();
		}
	} 

	var AppTask = {
		count: 0,
		items: [],
		toString: function () {

			var str = "";

			for (var i = 0; i < this.items.length; i++) {
				str += this.items[i].description + ";" + this.items[i].state + ";";
			}

			return ""+ this.count +";"+ str;
		}
	}

	function save() {
		

		var items = document.querySelectorAll(".app__item");

		AppTask.count = items.length;

		for ( var i = 0; i < items.length; i++) {
			AppTask.items[i] = {
				description: items[i].querySelector("p span").innerHTML,
				state: items[i].classList.contains("app__item_done"),
			}
		}

		localStorage.setItem( "AppTask", AppTask );
	}

	function load () {
		var data = localStorage.getItem("AppTask");

		var iter = parseInt( data.slice( 0, data.indexOf(";") ) );

		data = data.slice( data.indexOf(";") + 1 );
		var arr = []

		for(var i = 0; i < iter; i++) {

			arr.push({
					description: data.slice(0, data.indexOf(";")),
					state: data.slice( data.indexOf(";") + 1, data.indexOf(";", data.indexOf(";") + 1 ) )
				});
			data = data.substring( data.indexOf(";", data.indexOf(";") + 1 ) + 1 );
		}

		for ( var i = 0; i < iter; i++) {
			console.log(arr[i]);
			count++;
			var item = generationTask( arr[i].description );
			if ( arr[i].state !== "false" ) {
				item.classList.add("app__item_done");
				item.querySelector(".btn_done").innerHTML = "refresh";
			}
				

			document.querySelector('.app__content').append( item );
		}
	}

	// init APP (load save data)

	load();


	// bind btn
	document.querySelector(".add__btn").addEventListener( "click", addTask );
});