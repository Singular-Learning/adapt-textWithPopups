define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var TextWithPopupView = ComponentView.extend({

    events: {
      'click a[id]': 'openPopup'
    },

    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();

      this.setupInview();
    },

    setupInview: function() {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        this.setCompletionStatus();
        return;
      }

      if (this.model.get('_isPopupOptional') == true) {
        this.setupInviewCompletion(selector);
      }
    },

    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector: function() {
      if (this.model.get('body')) return '.component__body';

      if (this.model.get('instruction')) return '.component__instruction';

      if (this.model.get('displayTitle')) return '.component__title';

      return null;
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    openPopup: function(event) {

      event && event.preventDefault();

      var currentPopup = event.target;
      popupItems = this.model.get('_items');
      popupObject = {};

      popupItems.forEach(function(current){
        if (current.id === currentPopup.id) {
          // Set current pop-up as visited
          current._isVisited = true;
          popupObject = {
            title: current.title,
            body: current.body
          };
        }
      });

      // Set Completion Status when we open the pop-up
      if (this.model.get('_isPopupOptional') == false) {
        this.checkCompletionStatus();
      }
      
      Adapt.notify.popup(popupObject);
    
    },

    getVisitedItems: function() {
      return _.filter(this.model.get('_items'), function(item) {
        return item._isVisited;
      });
    },

    checkCompletionStatus: function() {
      if (this.model.get('_isOptional') == false) {
        if (this.getVisitedItems().length == this.model.get('_items').length) {
          this.setCompletionStatus(); 
        }
      } 
    },

  },
  {
    template: 'textwithpopup'
  });

  return Adapt.register('textwithpopup', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: TextWithPopupView
  });
});
