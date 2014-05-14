JUnit Logger - A QUnit addon for producing JUnit-style XML test reports
============

A QUnit addon that produces JUnit-style XML test reports for integration into build tools like Jenkins.

### Usage ###

Include the addon script after QUnit itself, then implement the `jUnitReport` hook to do something with the XML string (e.g. upload it to a server):

```js
QUnit.jUnitReport = function(report) {
	console.log(report.xml);
};
```

### Notes ###

If you're using Grunt, you should take a look at its [qunit task](https://github.com/cowboy/grunt/blob/master/docs/task_qunit.md). Or use [John Bender's grunt-junit plugin](https://github.com/johnbender/grunt-junit) to have the `qunit` task output JUnit-style XML, as this reporter does.
