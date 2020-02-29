import { Base } from '../../utils/Base.js';

class Cart extends Base{
  constructor(){
    super();
    this._storageKeyName = 'cart'
  }

  add(item,counts){
    var cartData = this.getCartDataFromLocal();
    var isHasInfo = this._isHasThatOne(item.id,cartData);
   
    if(isHasInfo.index == -1){
      item.counts = counts;
      item.selectStatus = true;
      cartData.push(item);
    }else{
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  getCartDataFromLocal(){
    var res = wx.getStorageSync(this._storageKeyName);
    if(!res){
      res = []
    }
    return res;
  }

  getOrderDataFromLocal(){
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = []
    }
    var newRes = [];
    for(let i =0;i<res.length;i++){
      if(res[i].selectStatus){
        newRes.push(res[i]);
      }
    }
    return newRes;
  }

  _isHasThatOne(id,arr){
    var result = { index:-1 };
    for(let i = 0;i < arr.length;i++){
      if (arr[i].id == id){
        result = {
          index:i,
          data:arr[i]
        };
        break;
      }
    }
    return result;
  }

  getCartTotalCounts(flag){
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (let i = 0;i < data.length; i++){
      if(flag){
        if(data[i].selectStatus){
          counts += data[i].counts;
        }
      }
      else{
        counts += data[i].counts;
      }
    }
    return counts;
  }

  _changeCounts(id,counts){
    var cartData = this.getCartDataFromLocal();
    var hasInfo = this._isHasThatOne(id,cartData);
    if(hasInfo.index != -1){
      if(hasInfo.data.counts > 1){
        cartData[hasInfo.index].counts += counts;
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  addCounts(id){
    this._changeCounts(id,1);
  }

  cutCounts(id){
    this._changeCounts(id,-1);
  }

  sdelete(ids){
    if(!(ids instanceof Array)){
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for(let i = 0;i<ids.length;i++){
      var hasInfo = this._isHasThatOne(ids[i],cartData);
      
      if(hasInfo.index != -1){
        cartData.splice(hasInfo.index, 1);
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  exec(data){
    wx.setStorageSync(this._storageKeyName, data);
  }

}

export {Cart};