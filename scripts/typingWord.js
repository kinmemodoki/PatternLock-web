function WordTyping(targetDom){
  this.target = targetDom;
}

WordTyping.prototype.type = function(word,option){
  this._typingStat = 0;
  this._word = word;
  
  option = option || {};
  this._delay = option.speed || 100;
  this._callback = option.callback || function(){};

  var self = this;
  this._tick();
  this._intervalID = window.setInterval(function(){self._tick()}, this._delay);
}

WordTyping.prototype._tick = function(){
  this._typingStat++;
  this._updateTarget(this._word.slice(0,this._typingStat));
  if(this._word.length===this._typingStat){
    clearInterval(this._intervalID);
    this._callback();
  }
}

WordTyping.prototype._updateTarget = function(val){
  this.target.value=val;
}