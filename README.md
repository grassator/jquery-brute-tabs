# Brute Tabs

Minimal but easily extendible jquery tabs plugin for everyone.

What makes **Brute Tabs** really different is an ability to customize every aspect of it's looks and behavior by providing configuration functions instead of limited scalar options used in most jQuery plugins.

## Getting Started

Download the latest version from [github][github]. Then in your web page:

[github]:https://github.com/grassator/jquery-brute-tabs/archive/master.zip

```html
<head>
	<script src="jquery.js"></script>
	<script src="dist/brute-tabs.min.js"></script>
	<link rel="stylesheet" href="dist/brute-tabs.css">
	<script>
	$(function() {
		$('#demo').bruteTabs();
	});
	</script>
</head>
<body>
	<div id="demo" class="brute-tabs">
		<ul class="brute-tabs-buttons">
			<li>One</li>
			<li>Two</li>
			<li>Three</li>
		</ul>
		<div class="brute-tabs-panes">
			<div>Content for first tab</div>
			<div>Content for second tab</div>
			<div>Content for third tab</div>
		</div>
	</div>
</body>
```

## Configuration

You can pass configuration object to plugin initialization with parameters described below:

### `baseName` string

Base for all string entities related to Brute Tabs including base part of element classes when using default `generateClassName` function.

Defaults to `brute-tabs`

### `generateClassName` function (elementNameOrModifier, isModifier)

Generates appropriate class names for select elements in generated markup. It can be used to adjust class names to conform to specific naming guidelines, like the ones used in [BEM](http://bem.info/). 

Default implementation just appends `elementNameOrModifier` to `baseName` with `-` in the middle and can be accessed via `$.fn.bruteTabs.generateClassName`.

Here is an sample implementation of BEM-style class generation:

```js
$('select').bruteTabs({
	generateClassName: function (elementNameOrModifier, isModifier) {
		var cls = this.baseName;
		if(elementNameOrModifier) {
			cls += (isModifier ? '_' : '__') + elementNameOrModifier;
		}
		return cls;
	}
});
```

### Function Context

All of the configuration functions are merged into special object that contains state of tabs widget and handles user and API interactions. Apart from ability to access all the other configuration options within configuration function it also provides references to several useful properties like `$el`, `$currentTab` and `$currentPane`.

### Global Configuration 

All of the previously listed options are also available in `$.fn.bruteTabs.options` object that contains default options for the plugin allowing you to adjust them globally.

## Further Extending

If you need even more control or wish to extend functionality of this plugin, you can extend base class that handles state and user interactions. It is accessible via `$.fn.bruteTabs.klass`.

## Licensing

Licensed under permissive [MIT-style license](https://github.com/grassator/jquery-brute-tabs/blob/master/LICENSE-MIT).
