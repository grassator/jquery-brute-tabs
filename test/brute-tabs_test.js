(function ($) {

	module('jQuery#bruteTabs', {
		// This will run before each test in this module.
		setup: function () {
			this.$el = $('#qunit-fixture');
		}
	});

	test('is chainable', function () {
		expect(1);
		strictEqual(this.$el.bruteTabs(), this.$el, 'should be chainable');
	});

	test('can generate appropriate class names', function () {
		expect(3);
		var pluginObject = this.$el.bruteTabs().data($.fn.bruteTabs.options.baseName);
		ok(pluginObject.generateClassName());
		ok(pluginObject.generateClassName('select').match(/select/gi));
		ok(pluginObject.generateClassName('select', true).match(/select/gi));
	});

	test('supports configuring base name', function () {
		expect(1);
		var baseName = 'some-other-select';
		ok(this.$el.bruteTabs({ baseName: baseName }).data(baseName));
	});

}(jQuery));
