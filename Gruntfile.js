module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/* JS MINIFICATION
		**********************************/
		uglify: {
			main: {
				options: { banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' },
				files: { 'tokenizer.min.js': 'tokenizer.js' }
			}
		},

		/* SEMVER HELPER
		**********************************/
		bump: {
			options: {
				pushTo: 'origin',
				files: ['package.json', 'bower.json'],
				commitFiles: ['package.json', 'bower.json', 'tokenizer.min.js']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('build', ['uglify']);
};
