define(['knockout', 'appState'],
  function(ko, appState) {    
    function Entity(defaultType) {
      this.id = ko.observable();
      this.name = ko.observable();
      this.description = ko.observable();

      this.defaultType = defaultType;
    
      if (defaultType) {
        this.type = ko.observable([defaultType]);
      }                   
    }

    Entity.prototype.fromObject = function(entity) {
      this.description('');

      if (entity) {
        this.id(entity.id);
        this.name(entity.name);

        if (entity.description) {
          this.description(entity.description);
        }

        if (this.defaultType) this.type([entity.type]);

        this.utcCreatedDate = entity.utcCreatedDate;
        this.utcLastModifiedDate = entity.utcLastModifiedDate;
        
        this.createdBy = entity.createdBy;
        this.lastModifiedBy = entity.lastModifiedBy;

      } else {
        this.id('');
        this.name('');        

        if (this.defaultType) this.type([this.defaultType]);
        
        this.utcCreatedDate = null;
        this.utcLastModifiedDate = null;
  
        this.createdBy = null;
        this.lastModifiedBy = null;
      }
    };

    Entity.prototype.toObject = function() {
      var obj = {
        name: this.name()
      };

      if (this.description()) {
        obj.description = this.description();
      }

      if (this.id()) {
        obj.id = this.id();

        obj.utcCreatedDate = this.utcCreatedDate;
        obj.utcLastModifiedDate = this.utcLastModifiedDate;
        
        obj.createdBy = this.createdBy;
        obj.lastModifiedBy = this.lastModifiedBy;
      }

      if (this.defaultType && this.type().length > 0) {
        obj.type = this.type()[0];  
      }
      
      return obj;
    };

    function error(jqXhr, andThen) {
      var data = jqXhr.responseJSON;

      if (data && data.errors && data.errors.length > 0) {
        andThen.call(null, null, data.errors);
      } else {
        andThen.call(null, null, ['Service unavailable.']);            
      }
    }

    Entity.error = error;

    Entity.list = function(path, showLoading, andThen) {
      if (showLoading) appState.loading(true);

      $.ajax({
        url: appState.apiUrl + path,
        type: 'GET',
        contentType: 'application/json',
        headers: appState.user.oauth.getHeader(),

        success: function(response) {
          var data = JSON.parse(response);
          appState.loading(false);          
          andThen.call(null, data.items, null);
        }
      }).fail(function(jqXhr) {
        appState.loading(false);
        error(jqXhr, andThen);
      });
    };

    Entity.get = function(path, showLoading, andThen) {
      var url = appState.apiUrl + path;

      if (showLoading) appState.loading(true);

      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        headers: appState.user.oauth.getHeader(),

        success: function(data) {
          appState.loading(false);          
          andThen.call(null, data.item, null);
        }
      }).fail(function(jqXhr) {
        appState.loading(false);
        error(jqXhr, andThen);
      });
    };

    Entity.save = function(data, path, andThen) {
      var url = appState.apiUrl + path + (data.id ? data.id : '');
      appState.loading(true);

      $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: data.id ? 'PUT' : 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: appState.user.oauth.getHeader(),

        success: function(result) {          
          appState.loading(false);
          andThen.call(null, result.item, null);
        }
      }).fail(function(jqXhr) {
        appState.loading(false);
        error(jqXhr, andThen);        
      });
    };

    Entity.remove = function(path, andThen) {
      var url = appState.apiUrl + path;
      appState.loading(true);

      $.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        headers: appState.user.oauth.getHeader(),

        success: function(data) {
          appState.loading(false);          
          andThen.call(null, data.item, null);              
        }
      }).fail(function(jqXhr) {
        appState.loading(false);
        error(jqXhr, andThen);
      });
    };

    return Entity;
  }
);
