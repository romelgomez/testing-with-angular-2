## Forms in Angular 2
source: http://angularjs.blogspot.com/2015/03/forms-in-angular-2.html?view=timeslide

Input handling is an important part of application development. The ng-model directive provided in Angular 1 is a great way to manage input, but we think we can do better. The new Angular Forms module is easier to use and reason about than ng-model, it provides the same conveniences as ng-model, but does not have its drawbacks. In this article we will talk about the design goals for the module and show how to use for common use cases.
Optimizing for real world apps

Let's look at what a simple HelloWorld example would look like in Angular 2:

```javascript
@Component({
  selector: 'form-example'
})
@Template({
  // we are binding the input element to the control object
  // defined in the component's class 
  inline: `<input [control]="username">Hello {{username.value}}!`,
  directives: [forms]
})
class FormExample {
  constructor() {
    this.username = new Control('World');
  }
}
```

This example is written using TypeScript 1.5 that supports type and metadata annotations, but it can be easily written in ES6 or ES5. You can find more information on annotations here. The example also uses the new template syntax that you can learn about by watching the keynote Misko and Rado gave at NgConf.

And, for comparison sake, here's what we'd write in Angular 1:

```javascript
var module = angular.module("example", []);
module.controller("FormExample", function() {
  this.username = "World";
});
```

```html
<div ng-controller="FormExample as ctrl">
  <input ng-model="ctrl.username"> Hello {{ctrl.username}}!
</div>
```

At the surface Angular 1 example looks simpler that what we have just done in Angular 2. Let's talk about the challenges of Angular 1 approach with real world applications. 
You can not unit test the form behavior without compiling the associated template. This is because the template contains part of the application behavior.
Though you can do dynamically generated data-driven forms in Angular 1, it is not easy and we want to enable this as a core use case for Angular 2.
The ng-model directive was built using a generic two-way data-binding which makes it difficult to reason about your template statically. Will go into depth on this topic in a following blog post and describe how it lets us achieve significant performance improvements.
There was no concept of an atomic form which could easily be validated, or reverted to original state. 
Although Angular 2 uses an extra level of indirection, it grants major benefits. The control object decouples form behavior from the template, so that you can test it in isolation. Tests are simpler to write and faster to execute. 

Now let's look at a more complex example so that you can see some of these properties.
Forms Mental Model

In Angular 2 working with Forms is broken down to three layers. At the very bottom we can work with HTML elements. On top of that Angular 2 provides the Form Controls API which we have shown in the example above. Finally, Angular 2 will also provide a data-driven forms API which will make building large-scale forms a snap.


Let's look at how this extra level of indirection benefits us for more realistic examples.
Data-Driven Forms

Let's say we would like to build a form such as this:


We will have an object model of an Address which needs to be presented to the user. The requirements also include providing correct layout, labels, and error handling. We would write it like this in Angular 2. 

(This is proposed API, we would love to take your input on this.)

import {forms, required, materialDesign} from 'angular2/forms';

```javascript
// Our model
class Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  residential: boolean;
} 

@Component({
  selector: 'form-example'
})
@Template({
  // Form layout is automatic from the structure
  inline: `<form [form-structure]=”form”></form>`,
  directives: [forms]
})
class FormExample {
  constructor(fb: FormBuilder) {
    this.address = new Address();

    // defining a form structure and initializing it using 
    // the passed in model
    this.form = fb.fromModel(address, [
      // describe the model field, labels and error handling
      {field: 'street', label: 'Street', validator: required},
      {field: 'city', label: 'City', validator: required},
      {field: 'state', label: 'State', size: 2, 
              validator: required},
      {field: 'zip', label: 'Zip', size: 5, 
              validator: zipCodeValidator},
      {field: 'isResidential', type: 'checkbox', 
              label: 'Is residential'}
    }, {
      // update the model every time an input changes
      saveOnUpdate: true,
      // Allow setting different layout strategies
      layoutStrategy: materialDesign
    });
  }
}

function zipCodeValidator(control) {
  if (! control.value.match(/\d\d\d\d\d(-\d\d\d\d)?/)){
    return {invalidZipCode: true};
  }
}
```

The above example shows how an existing model Address can be turned into a form. The process include describing the fields, labels, and validators in a declarative way in your component. The form HTML structure will be generated automatically based on the layout strategy provided to the builder. This helps keeping consistent look & feel through the application. Finally, it is also possible to control the write through behavior, which allows atomic writes to the model. 

We have taken great care to ensure that the forms API is pluggable, allowing you to define custom validators, reuse web-component controls, and define layout and theme.
Form Controls

Although having data driven forms is convenient, sometimes you would like to have full control of how a form is laid out on page. Let's rebuild the same example using the lower level API, which allows you to control the HTML structure in full detail. (This works today in Angular 2 Alpha, but we are also happy to receive your input on improvements we could make.)

```javascript
import {forms, required} from 'angular2/forms';

// An example of typical model
class Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  residential: boolean;
} 

function zipCodeValidator(control) {
  if (! control.value.match(/\d\d\d\d\d(-\d\d\d\d)?/)){
    return {invalidZipCode: true};
  }
}

@Component({
  selector: 'form-example'
})
@Template({
  inline: `
    // explicitly defining the template of the form 
    <form [form]=”form”>
      Street <input control="street">
      <div *if="form.hasError('street', 'required')">Required</div>

      City <input control="city">
      <div *if="form.hasError('city', 'required')">Required</div>

      State <input control="state" size="2">
      <div *if="form.hasError('state', 'required')">Required</div>

      Zip <input control="zip" size="5">
      <div *if="form.hasError('zip', 'invalidZipCoed')">
        Zip code is invalid
      </div>

      Residential <input control="isResidential" type="checkbox">
    </form> 
  `
  directives: [forms]
})
class FormExample {
  constructor(fb: FormBuilder) {
    this.address = new Address();

    // defining a form model 
    this.form = fb.group({
      street: [this.address.street, required],
      city: [this.address.city, required],
      state: [this.address.city, required],
      zip: [this.address.zip, zipCodeValidator],
      isResidential: [this.address.isResidential]
    });

    this.form.changes.forEach(() => this.form.writeTo(this.address));
  }
}
```

When using the control form API we still define the behavior of the form in the component, but the way the form is laid out is defined in the template. This allows you to implement even the most unusual forms. 

## Summary

The new Angular 2 Forms module makes building forms easier than ever. It also adds benefits such as consistent look and feel for all forms in your application, easier unit testing, and more predictable behavior.

The API is still work in progress, we welcome any feedback. Please submit your input by filing issues or creating PRs at http://github.com/angular/angular.