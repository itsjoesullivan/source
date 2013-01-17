var rce = require('./rce');

var testProject = {
	files: {
		'src': {
			'index.js': "var x = qwerty"
		}
	}
};
describe('rce', function() {
	it('accepts a project object, allows a branch to be created, modified, committed to, then can revert to each.', function() {
		var proj = rce(testProject);
		proj.branch('grammar');
		proj.checkout('grammar');
		proj.working.files['src']['index.js'] += ';';
		proj.add('src/index.js');
		proj.commit('added semi-colon');
		proj.checkout('trunk');
		expect(proj.working.files['src']['index.js']).toEqual('var x = qwerty');
		proj.checkout('grammar');
		expect(proj.working.files['src']['index.js']).toEqual('var x = qwerty;');
	});
});
