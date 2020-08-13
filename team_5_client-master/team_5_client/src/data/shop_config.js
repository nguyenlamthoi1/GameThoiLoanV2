/**
 * Created by Admin on 8/11/2020.
 */

const ITEM_TYPE = {
    TREA:0, //TREASURES
    RES: 1, //RESOURCE
    DECO: 2, //DECORATIONS
    ARMY: 3, //ARMY
    DEF: 4, //DEFENSE
    SHIELD:5 //SHIELD
};
var shop_info={
    RES_TYPE:{
        STO_1 : {
            title: "KHO VÀNG"
        },
        STO_2 : {
            title: "KHO DẦU"
        },
        STO_3 : {
            title: "KHO DẦU ĐEN"
        },
        RES_1 : {
            title: "MỎ VÀNG"
        },
        RES_2 : {
            title: "MỎ DẦU"
        },
        RES_3 : {
            title: "MỎ DẦU ĐEN"
        },
        BDH_1: {
            title:"NHÀ THỢ XÂY"
        }
    },
    ARMY_TYPE:{
        BAR_1: {
            title:"NHÀ LÍNH"
        },
        BAR_2: {
            title:"NHÀ X-MEN"
        },
        AMC_1:{
            title:"TRẠI LÍNH"
        },
        LAB_1:{
          title: "NHÀ NGHIÊN CỨU"
        }
    },
    DEF_TYPE:{
        DEF_1: {
            title:"PHÁO"
        },
        DEF_2: {
            title:"CHÒI CUNG"
        },
        DEF_3:{
            title:"MÁY BẮN ĐÁ"
        },
        DEF_4:{
            title:"CHÒI PHÉP"
        },
        DEF_5: {
            title:"PHÁO CAO XẠ"
        },
        /*DEF_6: {
            title:"DEF_1"
        },*/
        DEF_7:{
            title:"THẦN TIỄN"
        },
        DEF_8:{
            title: "THÁP SẤM SÉT"
        },
        DEF_9: {
            title:"THÁP ÁNH SÁNG"
        },
        /*DEF_10: {
            title:"NHÀ X-MEN"
        },
        DEF_11:{
            title:"TRẠI LÍNH"
        },*/
        DEF_12:{
            title: "PHÁO RỒNG"
        }
    }
};
var configPaths={
    RES_TYPE :{
        STO: "config/Storage.json",
        RES: "config/Resource.json",
        BDH: "config/BuilderHut.json"
    },
    ARMY_TYPE:{
        BAR: "config/Barrack.json",
        AMC: "config/ArmyCamp.json",
        LAB: "config/Laboratory.json"
    },
    DEF_TYPE:{
        WALL: "config/Wall.json",
        DEF: "config/Defence.json"
    }
};
var ShopConfig = cc.Class.extend({

 });
ShopConfig.loadItemsOfType= function(resType){
    var dataItems = {};
    var type="RES_TYPE";
    cc.log("READ RESTYPE ="+resType)
    if (resType == ITEM_TYPE.RES){
        cc.log("ShopConfig: LOAD JSON FILE of TYPE RESOURCE ")
        type="RES_TYPE";
    }
    else if (resType == ITEM_TYPE.ARMY){
        cc.log("ShopConfig: LOAD JSON FILE of ARMY RESOURCE ")
        type="ARMY_TYPE";
    }
    else if (resType == ITEM_TYPE.DEF){
        cc.log("ShopConfig: LOAD JSON FILE of DEF RESOURCE ")
        type="DEF_TYPE";
    }


    for (var path in configPaths[type]) {
        cc.log('ShopConfig: test path: '+path);
        var data = cc.loader.getRes(configPaths[type][path]);
        for (var id in data) {
            cc.log("ID IS "+id);

            if (id in shop_info[type]) {

                dataItems[id] = data[id]["1"];
                dataItems[id]["img"] = "GUIs/icons/shop_gui/icon/" + id + ".png";
                cc.log("TITLE IS" + shop_info[type][id]["title"]);
                dataItems[id]["title"] = shop_info[type][id]["title"];
            }
        }
    }
    cc.log("ShopConfig: SET DATA ITEMS"+Object.keys(dataItems));
    ShopConfig.resData=dataItems;
    return dataItems;
};
