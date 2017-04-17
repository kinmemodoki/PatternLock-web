class PasswordMeasure{
  //論文を参照-> http://dl.acm.org/citation.cfm?id=2702365
  constructor() {
    this.strength = 0.0;
    /* evalate value */
    //Lp; //セル間の長さの和。各セル間の長さはRowとColumnの長い方を採用。(min=1,max=2)
    //Np; //最も多いセグメントの向き数/総セグメント数
    //Ip; //セグメントの交差回数
    /* const value */
    this.w_L = 0.81; //Songらの定めた重み
    this.w_N = 0.04; //Songらの定めた重み
    this.w_I = 0.15; //Songらの定めた重み
    this.paramWeak = 0.40; //ここまでWeak判定
    this.paramMedium = 0.56; //ここまでMedium判定

  }

  //internal functions
  idx2cell(pattern){
    var coordTable = [
      {row:0,column:1},
      {row:0,column:2},
      {row:0,column:3},
      {row:1,column:1},
      {row:1,column:2},
      {row:1,column:3},
      {row:2,column:1},
      {row:2,column:2},
      {row:2,column:3}
    ];
    var cellPattern = [];
    for(var i=0;i<pattern.length;i++)
      cellPattern[i] = coordTable[pattern[i]-1];
    return cellPattern;
  }

  isIntersect(p1,p2,p3,p4) {
    //（p1,p2）と（p3,p4）が交わるか。
    // from http://www5d.biglobe.ne.jp/~tomoya03/shtml/algorithm/Intersection.html
    if(((p1.column - p2.column) * (p3.row - p1.row) + (p1.row - p2.row) * (p1.column - p3.column)) *  ((p1.column - p2.column) * (p4.row - p1.row) + (p1.row - p2.row) * (p1.column - p4.column)) < 0) {
      if(((p3.column - p4.column) * (p1.row - p3.row) + (p3.row - p4.row) * (p3.column - p1.column)) * ((p3.column - p4.column) * (p2.row - p3.row) + (p3.row - p4.row) * (p3.column - p2.column)) < 0){
        return true;
      }
    }
    return false;
  }

  calcLp(pattern){
    var Lp = 0;
    var c1,c2;
    for(var i = 1; i < pattern.length; i++){
      c1 = pattern[i-1];
      c2 = pattern[i];
      var rLength = Math.abs(c1.row - c2.row);
      var cLenght = Math.abs(c1.column - c2.column);

      Lp += (rLength>cLenght)?rLength:cLenght;
    }
    return Lp;
  }

  calcIp(pattern){
    var Ip = 0;
    var c1,c2,c3,c4;
    for(var i = 3; i < pattern.length; i++){
      c4 = pattern[i];
      c3 = pattern[i-1];
      for(var j = 1; j < pattern.length-2; j++){
        c2 = pattern[j];
        c1 = pattern[j-1];
        if(this.isIntersect(c1,c2,c3,c4))
          Ip++;
      }
    }
    return Ip;
  }

  calcNp(pattern){
    var Np = 0;
    var Sp = pattern.length - 1; //セグメントの合計
    var Rp = 0; //連続で入力された同じ向きのセグメント数
    var c1,c2,c3;
    for(var i = 2; i < pattern.length; i++){
      c1 = pattern[i-2];
      c2 = pattern[i-1];
      c3 = pattern[i];
      //c1->c2 と c2->c3 の傾きが一致したらカウント
      if((c1.column - c2.column)*(c2.row-c3.row) == (c2.column-c3.column)*(c1.row-c2.row))
        Rp += 2;
    }
    Np = (Sp -  Rp)/Sp;
    return Np;
  }

  calcStrength(pattern){
    var mLp = this.calcLp(pattern);
    var mIp = this.calcIp(pattern);
    var mNp = this.calcNp(pattern);
    return this.w_L*(mLp/15) + this.w_N*mNp +this.w_I*Math.min(mIp,5)/5;
  }

  getStrength(mPattern){
    var pattern = this.idx2cell(mPattern);
    var strength = this.calcStrength(pattern) || 0;
    return strength;
  }
}