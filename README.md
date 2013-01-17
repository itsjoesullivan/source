source
======

What does version control look like in the browser?

This is more a thought experiment, seeing how source control might look in a browser. Exploring my understanding of how git works by implementing some of the features.

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
