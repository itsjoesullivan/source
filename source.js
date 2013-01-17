var log = function(text) {
	console.log(text);
},
	_ = require('underscore'),
	clone = require('./lib/clone'),
	diff = new (require('./lib/diff')).diff_match_patch();

source = function(projectObj) {

	var commitTemplate = {
		subjects: [],
		changes: []
	},
		commit = false;
		getPath = function(origPath,origObj) {
			if(typeof origPath === 'string') {
				origPath = origPath.split('/');
			}
			var path = clone(origPath);
			var obj = clone(origObj);
			if(!path.length) {
				return obj;
			}
			var next = path[0]
			if(next in obj) {
				path.shift();
				return getPath(path,obj[next]);
			}
			throw 'bad path';
		}

	var project = {
		branches: {
			trunk: {
				commits: []
			}
		},//holds all branches
		working: {},//holds the current state of all the files, including things that arent committed 
		current: {},//HEAD, I guess, of the currently selected branch.
		commits: [],
		files: {}
	}
	if('files' in projectObj) {
		project.files = projectObj.files;
	} else {
		throw 'bad object... needs a files part'
	}

	project.branch = function(name) {
		if(!name) {
			for(var branchName in this.branches) {
				log(branchName);		
			}
		} else {
			this.branches[name] = {
				commits: []	
			}		
		}
		return this;
	},
	project.checkout = function(name) {
		commit = clone(commitTemplate);
		if(!name) {
			project.branch();
		} else {
			log('Checking out ' + name)
			var applyR = function(path) {
				var file = clone(getPath(path,project.files));
				if(typeof file === 'string') {
					var commits = project.branches[project.checkedOut].commits;
					for(var i in commits) {
						var haveSaid = false;
						var commit = commits[i];
						commit.changes.forEach(function(change) {
							if(change.path === path) {
								log('Applying "' + commit.message + '"');
								var patch = diff.patch_apply(change.patch,file);
								file = patch[0];
							}
						});
					}
				} else {
					for(var i in file) {
						var newPath = path + '/' + i;
						file[i] = applyR(newPath);
					}	
				}
				return file;
			}
			if(name in this.branches) {
				var files = clone(this.files);
				this.checkedOut = name;
				for(var i in files) {
					files[i] = applyR([i]);
				}
				this.current = this.branches[name];
				this.current.files = files;
				this.working = clone(this.current);
			}
		}
	}
	project.add = function(subject) {
		log('Adding ' + subject);
			if(typeof subject === 'string') {
				subject = subject.split('/');	
			}
		commit.subjects[subject.join('/')] = getPath(subject,this.working.files)
	}
	project.commit = function(message) {
		log('Commiting: "' + message + '"');
		var subjects = commit.subjects;
		commit.message = message;
		for(var subjectPath in subjects) {
			var path = subjectPath.split('/');
			var subject = subjects[subjectPath];
			var old = getPath(path,this.current.files);
			var patch = diff.patch_make(old,subject);
			commit.changes.push({
				path: subjectPath,
				patch: patch
			});
		}		
		delete commit.subjects;
		this.current.commits.push(clone(commit));
		this.current = clone(this.working);
		commit = clone(commitTemplate);
	}
	project.checkout('trunk');
	return project;
};

module.exports = source;
