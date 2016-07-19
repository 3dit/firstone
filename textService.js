angular.module('app')
.service('textService',function() {
  return {
    getSelections: function() {
      var texts = [
        {id:0, text:"Quisque vel imperdiet orci."},
        {id:1, text:"metus arcu viverra ante, quis faucibus ex justo vel nisi."},
        {id:2, text:"Maecenas ultricies quam vel lectus convallis"},
      ];
      return texts;
    }
  }
});