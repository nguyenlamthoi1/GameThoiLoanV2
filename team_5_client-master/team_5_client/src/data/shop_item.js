/**
 * Created by Admin on 8/11/2020.
 */
//only for modify cost info
var resIcon={
    gold: "GUIs/shop_gui/gold.png",
    elixir: "GUIs/shop_gui/elixir.png",
    coin: "GUIs/shop_gui/elixir.png",
    darkElixir: "GUIs/shop_gui/icon_dElixir_bar.png",
    free:"MIỄN PHÍ"
};
//
var ItemModel = cc.Class.extend({
    ctor: function(){
        cc.log("NEW ITEM MODEL");
        this.itemModelNode =ccs.load("zccs/itemInList.json","").node;
    },
    getSize: function(){
        cc.log("Get content size");
        return this.getModel().getChildByName("Item").getChildByName("itemBack").getContentSize();
    },
    setData: function(data){
        ItemModel.setData(this.itemModelNode,data);
    },
    getModel: function(){
        return this.itemModelNode;
    }
});

ItemModel.setData = function(itemModelNode,data){
    cc.log("SET DATA FOR ITEM MODEL NODE");
    cc.log("JSON: "+JSON.stringify(data));

    var node =itemModelNode.getChildByName("Item");
    var title = node.getChildByName("ItemName");
    var buildTime = node.getChildByName("timeLabel");
    var img = node.getChildByName("itemImg");
    var cost = node.getChildByName("costLabel");
    var resIcon = node.getChildByName("resIcon");
    var reqLabel = node.getChildByName("requirementLabel");
    var slot = node.getChildByName("slot");
    var itemImg = node.getChildByName("itemImg");

    title.setString(data["title"]);
    buildTime.setString(Ulti.convertTime(data["buildTime"]));
    img.loadTextureNormal(data["img"]);

    var costInfo = ItemModel._modifyCostAndCheck(data,cost);
    cc.log("costInfo = "+costInfo);
    cc.log("Res.free = "+resIcon.free);

    if (costInfo == "MIỄN PHÍ"){
        //set Imge for free item
        resIcon.setVisible(false);
        cost.setString("MIỄN PHÍ");

        cc.log(data["title"]+" IS " + res.free);
    }
    else{
        cc.log(data["title"] + " ITS COST: "+costInfo[0]);
        resIcon.setVisible(true);
        cost.setString(Ulti.formatNumber(costInfo[0]));
        resIcon.loadTexture(costInfo[1]);

    }

    //Check requirement
    itemImg.setBright(true);
    slot.setBright(true);
    reqLabel.setVisible(false);
    node.getChildByName("timeLabel").setVisible(true);
    node.getChildByName("timeIcon").setVisible(true);
    node.getChildByName("numBuildLabel").setVisible(true);


    if ("townHallLevelRequired" in data)
        if (user.townHallLevel < data["townHallLevelRequired"]){
            itemImg.setBright(false);
            slot.setBright(false);
            reqLabel.setVisible(true);
            reqLabel.setString("Yêu cầu nhà chính cấp "+data["townHallLevelRequired"]);
            node.getChildByName("timeLabel").setVisible(false);
            node.getChildByName("timeIcon").setVisible(false);
            node.getChildByName("numBuildLabel").setVisible(false);


        }

    //Check Max quantity to build

};
ItemModel._modifyCostAndCheck=function(data,costLabel){
    costLabel.setColor(cc.color(255,255,255));
    if ("gold" in data && data["gold"] > 0) {
        cc.log("USER HAS gold: "+user.gold);
        cc.log("REQUIRE: "+data["gold"]);
        if (user.gold < data["gold"]) costLabel.setColor(cc.color(250,0,0));
        return [data["gold"], resIcon.gold];
    }
    if ("elixir" in data && data["elixir"] > 0) {
        cc.log("USER HAS elixir: "+user.elixir);
        cc.log("REQUIRE: "+data["elixir"]);
        if (user.elixir < data["elixir"]) costLabel.setColor(cc.color(250,0,0));
        return [data["elixir"], resIcon.elixir];
    }
    if ("darkElixir" in data && data["darkElixir"] > 0){
        if (user.darkElixir < data["darkElixir"]) costLabel.setColor(cc.color(250,0,0));
        return [data["darkElixir"],resIcon.darkElixir];
    }
    if ("coin" in data && data["coin"] > 0 ) {
        cc.log("USER HAS COIN: "+user.coin);
        cc.log("REQUIRE: "+data["coin"]);
        if (user.coin < data["coin"]) costLabel.setColor(cc.color(250,0,0));
        return [data["darkElixir"],resIcon.darkElixir];
    }

    return resIcon.free;
};
ItemModel.checkClickOnItem=function(itemModelNode){

    var item = itemModelNode.getChildByName("Item");
    var btn = item.getChildByName("slot");

    if (btn.bright == true) return true;
    else  return false;
};


