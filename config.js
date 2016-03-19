var dest 	= './app',
		src 	= './src';

module.exports = {
	dest: dest,
	src : src,
	libs:{
		css: {
			src:[
				"./bower_components/normalize-css/normalize.css"
			],
			options:{
				basename: "libs"
			},
			dest: dest+"/assets/css"
		},
		js: {
			src:[
				"./bower_components/angular/angular.min.js",
				"./bower_components/angular-ui-router/release/angular-ui-router.min.js"
			],
			options:{
				basename: "libs"
			},
			dest: dest+"/assets/js"
		}
	},
	browserSync:{
		options:{
			baseDir: dest
		}
	},
	sass:{
		src: src+"/sass/app.sass",
		watchSrc: src+"/sass/**/*.sass",
		options:{
			intermd: src+"/sass",
			basename: 'blog.css'
		},
		dest: dest+"/assets/css/"
	},
	jade:{
		src: src+"/jade/**/*.jade",
		dest: dest+"/assets/html/"
	},
	js:{
		src: src+"/js/src/**/*.js",
		options:{
			intermd: src+"/js",
			basename: 'blog'
		},
		dest: dest+"/assets/js/"
	},
	img:{
		src: src+"/img/**/*",
		dest: dest+"/assets/img/"
	}
}
