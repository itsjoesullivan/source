source
======

"Git is fundamentally a content-addressable filesystem with a VCS user interface written on top of it." - [Pro Git](http://git-scm.com/book)

This isn't a clone of Git, but I'm exploring some of its functionality. Particularly I'm interested in the role that source control can play as filesystem in situations where the importance of an actual filesystem is secondary.

Right now, you can do:

```javascript
	var myProjectObject = {
		files: {
			src: {
				'index.js': "var x = 'asdf'"
			}
		}
	};

	var myProject = source(myProjectObject);

	//branching
	myProject.branch()
		//trunk
	myProject.branch('cool-idea');
	myProject.branch();
		//trunk
		//cool-idea
	myProject.branch('fix-syntax');

	//checkout
	myProject.checkout('fix-syntax');

	//myProject.working.files is your friendly file system
	myProject.working.files.src['index.js'] += ';';

	//stage
	myProject.add('src/index.js'); //familiar paths

	//commit
	myProject.commit('Added semi-colon');

	myProject.checkout('trunk');
	myProject.working.files.src['index.js'];
		//"var x = 'asdf'"

	myProject.checkout('fix-syntax');
	myProject.working.files.src['index.js'];
		//"var x = 'asdf';"
```

Obviously, merge is on the todo list :)
