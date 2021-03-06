/*
 After you have changed any settings for the responsive_images task,
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

/* eslint-disable camelcase */
module.exports = function(grunt) {

	grunt.initConfig({
		responsive_images: {
			dev: {
				options: {
					// engine: 'im',
					sizes: [
						{
							width: 1200,
							suffix: '_large_2x',
							quality: 100
						}, {
							width: 1200,
							suffix: '_large_1x',
							quality: 80
						}, {
							width: 800,
							suffix: '_medium_2x',
							quality: 100
						}, {
							width: 800,
							suffix: '_medium_1x',
							quality: 80
						}, {
							width: 600,
							suffix: '_small',
							quality: 100
						}
					]
				},
				files: [
					{
						expand: true,
						src: ['*.{gif,jpg}'],
						cwd: 'images/',
						dest: 'img/'
					}
				]
			}
		},

		/* Clear out the images directory if it exists */
		clean: {
			dev: {
				src: ['img']
			}
		},

		/* Generate the images directory if it is missing */
		mkdir: {
			dev: {
				options: {
					create: ['img']
				}
			}
		},

		/* Copy the "fixed" images that don't go through processing into the images/directory */
		copy: {
			dev: {
				files: [
					{
						expand: true,
						src: ['images_src/fixed/*.{gif,jpg,png}'],
						dest: 'img/',
						flatten: true
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-responsive-images');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.registerTask('default',
		['clean', 'mkdir', 'copy', 'responsive_images']);

};