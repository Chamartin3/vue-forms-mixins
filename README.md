# Vue Forms Mixin



#### Base Form Mixin

Create de basis of the form, generates a proxy form to  evaluate changes, gets the instance of object if exist, sets the mode to edition or creation depending of is there is an instance of the object. 

##### Data: 

requerido

form:{}

service:{}

```javascript
mode:'creation'//by default
viewmode:false
```

methods

stProxy:private

setFields: private

setInstance:()

**hooks used**

beforeMount()



#### Main form Mixin

___

Send the form to an specific space



**data:{**

service

mode:creation

alert

}

**computed**

meta() // generates metadata for buttons and name 

methods called

_beforeSend()
_preProcessForm()

    successSend(success){},
    failedSend(fail){},
uses _inErrors (dependence of errors)



#### Subform mixin

*****

*** depends on **

_preProcessForm()



watch for any internal change and emits a preprocesed result when 



#### Errors mixin

----------------------

Work wioth internal errors (generated from the model) or outerrors generated from an external model, centralices both into one array 

form errors





#### Currency Fields

```
currencyMixin
```

Dependency:  vue-currency-input

Transform the currencies into data that can be send to the server. 



#TODO 

separate the notification from the main form

add froned side validation

repair the _preprocess form error on v-currency on send





