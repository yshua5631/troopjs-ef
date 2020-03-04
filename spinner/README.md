## The Spinner Widget

### How does it work
The spinner widget of troopjs-ef is an UI widget presenting a spinner that will get automatically tick/hide when the application is running/finished a certain "task", a "task" is defined as a promise that is created from the `core/component/base#task` method. In troopjs-ef, data query alike calls are already wrapped in task, so whenever there's a in progressing data query, the spinner is ticking until the query has returned, this behaviors make it the least effort to introduce your page's "loading/waiting" functionality without introducing any manual hook. 

### Parallel Tasks
The spinner is designed to work with multiple paralleled tasks, coordinating them under a single spinning process, e.g. supposed that you have the first query task triggered the spinner where following it there comes the second query task - in such case the spinner will be counting for the amount of tasks, only to conclude after all tasks have completed.

### Usages
Two types of spinner are for provided, depending on the way how it govenrns the page:
 * Inline spinner - spinner only lives on part of the page, it get notified by a custom "task" dom event that get bubbled up from any **sub widget** that does async job, ideally for implmenting spinning for covering one section of the page.
 * Global spinner - spinner that dominates the full page, it get notified on the "task" hub topic that is catching all async tasks running on this page, suitable if your page need a page-wide spinner lives anywhere.

Use the spinner widget is as simple as declaring it as a widget:

As for the global spinner, put it anywhere in the page:
```
<body>
<header data-weave="troopjs-header/widget/main">
  ...
</header>
<main>
  <div class="ets-spinner" data-weave="troopjs-ef/spinner/global"></div>
   ...
</main>
<footer data-weave="troopjs-footer/widget/main">
  ...
</footer>
</body>
```

As for the inline spinner, attach it on one container HTML element:
```
<body>
<section data-weave="my-troop-app/widget/foo,troopjs-ef/spinner/widget">
  ...
</section>
</body>
```

Then define in CSS stylesheet how does the `.ets-spinner` and `.ets-spinning` looks like:
```
.ets-spinner{
	display: none;	
}

.ets-spinning {
	display: block;
	background: transparent url(../img/spinning.gif) 50% 50% no-repeat;
	opacity: .7;
}
```

