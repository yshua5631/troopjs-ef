/*jshint node:true*/
module.exports = function(grunt) {
	"use strict";
	var UNDEFINED;
	var path = require('path');
	var pkg = grunt.file.readJSON('package.json');
	var _ = grunt.util._;

	// List of source modules.
	var source = [
		'{widget,blurb,ccl,command,component,logger,route,service,spinner,tracking}/**/*.js'
	];

	// Convert list of source files into their module names.
	var modules = _.pluck(grunt.file.expandMapping(source, pkg.name, {
		cwd: '.',
		rename: function(dest, matchedSrcPath, options) {
			var extnameReg = new RegExp(path.extname(matchedSrcPath) + '$');
			return path.join(dest, matchedSrcPath.replace(extnameReg, ''));
		}
	}), 'dest');

	grunt.initConfig({
		"pkg": pkg,

		"build" : {
			"src" : ".",
			"dist" : "dist",
			"banner" : "/**\n" +
				" * <%= pkg.name %> - <%= pkg.version %>\n" +
				" */"
		},

		"requirejs" : {
			"options" : {
				"baseUrl" : "<%= build.src %>",
				"optimize" : "none",
				"skipDirOptimize" : true,
				"keepBuildDir" : true,
				"fileExclusionRegExp": /^(?:\.\w+|node_modules|Gruntfile\.js|support|test|dist)$/,
				"packages": [{
					"name" : "troopjs-ef",
					"location" : ".",
					"main" : "package"
				}],
				"paths" : {
					"troopjs-core" : "empty:",
					"troopjs-browser" : "empty:",
					"troopjs-utils" : "empty:",
					"client-state": "empty:",
					"client-tracking": "empty:",
					"when" : "empty:",
					"poly": "empty:"
				}
			},
			"nodeps" : {
				"options" : {
					"include": modules,
					"out": "<%= build.dist %>/nodeps.js"
				}
			}
		},

		"clean" :[ "<%= build.dist %> "],

		"uglify" : {
			"options" : {
				"preserveComments" : false
			},
			"nodeps" : {
				"files" : {
					"<%= build.dist %>/nodeps.min.js" : "<%= build.dist %>/nodeps.js"
				}
			}
		},

		"git-describe" : {
			"bundles" : {
				"options" : {
					"prop" : "pkg.version"
				}
			}
		},

		"usebanner" : {
			"options" : {
				"position" : "top",
				"banner" : "<%= build.banner %>"
			},
			"nodeps" : {
				"files" : {
					"src" : [ "<%= build.dist %>/nodeps.js", "<%= build.dist %>/nodeps.min.js" ]
				}
			}
		},

		"json-replace" : {
			"options" : {
				"space" : " "
			},
			"bower.json" : {
				"options" : {
					"replace" : {
						"version" : "<%= pkg.version %>",
						"ignore" : UNDEFINED
					}
				},
				"files" : [{
					"src": "bower.json",
					"dest" : "<%= build.dist %>/bower.json"
				}]
			}
		},

		"git-dist" : {
			"bundles" : {
				"options" : {
					"branch" : "dist/2.x",
					"dir" : "<%= build.dist %>",
					"message" : "<%= pkg.name %> - <%= pkg.version %>"
				}
			}
		},

		"buster" : {
			"troopjs-ef" : {}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-banner");
	grunt.loadNpmTasks("grunt-git-describe");
	grunt.loadNpmTasks("grunt-git-dist");
	grunt.loadNpmTasks("grunt-json-replace");
	grunt.loadNpmTasks("grunt-plugin-buster");

	grunt.registerTask("compile", [ "requirejs" ]);
	grunt.registerTask("compress", [ "uglify" ]);
	grunt.registerTask("version", [ "git-describe", "usebanner", "json-replace" ]);
	grunt.registerTask("dist", [ "clean", "git-dist:bundles:clone", "compile", "compress", "version", "git-dist:bundles:commit", "git-dist:bundles:push" ]);
	grunt.registerTask("default", [ "compile" ]);
};
