var measure = new PasswordMeasure();

var lock = new PatternLock("#patternContainer",{
  margin:50,
  radius:70,
  onDraw:function(pattern){
    //finish write pattern.
  },
  onMove:function(pattern){
    //when add a node to stack.
    //console.log("MOVE!: ",pattern);
    console.log(measure.getStrength(pattern));
  },
});