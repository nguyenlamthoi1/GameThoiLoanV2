/**
 * Created by CPU12755-local on 7/30/2020.
 */


var user ={
    townHallLevel: 2,
    gold :100,
    coin: 5000,
    elixir : 1000,
    darkElixir: 100,
};
var res_bar=[
    {resImg: "GUIs/shop_gui/icon_gold_bar.png",info: user.gold},
    {resImg: "GUIs/shop_gui/icon_elixir_bar.png",info: user.elixir},
    {resImg: "GUIs/shop_gui/icon_g_bar.png",info: user.coin}
] ;


var UltiGUI ={};
var Ulti={};

UltiGUI.setSizeForObj = function(obj, fromSize, toSize){
       var scaleX = toSize.width / fromSize.width;
       var scaleY = toSize.height / fromSize.height;

       obj.setScaleX(scaleX);
       obj.setScaleY(scaleY);
};

Ulti.convertTime=function fancyTimeFormat(duration)
{
    if(duration == undefined) return 0 + "s";
    var day;
    var hrs;
    var min;
    var secs;

    // Hours, minutes and seconds
    day = ~~(duration /(3600*24));
    if (day > 0 )
        return day+"d";
    hrs = ~~(duration / 3600);  // ~~2 === Math.floor(2);
    if (hrs > 0)
        return hrs+"h";

    min = ~~(duration / 60);
    secs = ~~(duration % 60);

    if (min>0) return min + "m" + secs +"s";
    return secs + "s";

};
Ulti.formatNumber= function(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
};
var GameTestLayer= cc.Layer.extend({
    shop: null,
   ctor: function(){
       this._super();

       this.rootNode = ccs.load("zccs/SceneLogin.json", "").node;
       this.rootNode.setContentSize(cc.winSize);
       ccui.Helper.doLayout(this.rootNode);
       this.addChild(this.rootNode);

       var btn = this.rootNode.getChildByName("Button_1");
       btn.addClickEventListener(function(){
           //scene.addChild(new TableViewTestLayer());
           if (this.shop !=null) this.shop.open();
           else {
               this.shop=new Shop();
               scene.addChild(this.shop);
           }
       });


   },
    onEnter: function(){
        this._super()
    }
});

var Shop = cc.Layer.extend({
    closeBtn: null,
    backBtn:null,
    resInfoBar:null,
    background:null,
    listItemsLayer: null,
    shopTitle: null,

   ctor: function(){
       this._super();
       this.init();
   },
    init: function(){
        var sizeWin= cc.director.getWinSize();
        //===== create Background for the shop=====
        this.background= ccs.load("zccs/ShopUILayer.json","").node;
        //var background= cc.Sprite.create("GUIs/shop_gui/nen2.png");
        this.background.setAnchorPoint(cc.p(0,0));
        var bgSize= this.background.getContentSize();

        var percentX = 0.9;
        var percentY = 0.85;

        var bgWidthScale = sizeWin.width*percentX/bgSize.width;
        var bgHeightScale = sizeWin.height*percentY/bgSize.height;

        this.background.setScaleX(bgWidthScale);
        this.background.setScaleY(bgHeightScale);

        this.background.setPosition(sizeWin.width*((1-percentX)/2),sizeWin.height*(1-percentY)/2);
        //Init Shop Title
        this.shopTitle=this.background.getChildByName("shopTitle");
        //Init and Show category Items
        this.addChild(this.background);
        var shopCatLayer=this.makeCatItems();
        var sizeOfshopLayer=shopCatLayer.getContentSize();
        shopCatLayer.setScaleX(bgSize.width/sizeOfshopLayer.width);
        shopCatLayer.setScaleY(bgSize.height*0.85/sizeOfshopLayer.height);
        shopCatLayer.setAnchorPoint(cc.p(0,0));
        shopCatLayer.setPosition(cc.p(0,0));

        this.background.addChild(shopCatLayer);
        // init and Hide resources info bar

        this.resInfoBar = cc.Sprite.create("GUIs/shop_gui/res_info.png");
        this.resInfoBar.setAnchorPoint(cc.p(0.5,0));
        this.resInfoBar.setPosition(cc.p(bgSize.width/2,0));

        this.makeResInfoBar();

        this.resInfoBar.setVisible(false);
        this.background.addChild(this.resInfoBar);
        // init list of item GUI but hide it
        this.openItemListOfType(ITEM_TYPE.RES);
        this.listItemsLayer.setVisible(false);
        // Init close(show) and back button(hide)
        this.backBtn = this.background.getChildByName("backBtn");
        this.backBtn.addClickEventListener(function(){
            this.open();
        }.bind(this));
        this.closeBtn = this.background.getChildByName("closeBtn");
        this.closeBtn.addClickEventListener(function(){
            this.onClickCloseButton();
        }.bind(this));
    },
    onClickCloseButton: function(){
       this.setVisible(false);
    },
    makeResInfoBar: function(){

        var dBetweenXPercent = 0.05;
        var alignBorderPercent = 0.2;
        var numRes = res_bar.length;

        var percentWidth = (1-(res_bar.length-1)*dBetweenXPercent-2*alignBorderPercent)/3;

        for (var i = 0; i<numRes ; i++){
            var resInfoModel = ccs.load("zccs/Bar.json","").node;
            var resInfoModelSize = resInfoModel.getChildByName("numberBar").getContentSize();
            var resInfoBarSize= this.resInfoBar.getContentSize();
            var scaleToWidth = percentWidth*resInfoBarSize.width/resInfoModelSize.width;

            //resInfoModel.setScaleX(scaleToWidth);
            var resIcon = resInfoModel.getChildByName("resIcon");

            var resNum = resInfoModel.getChildByName("numberBar").getChildByName("numberLabel");

            resIcon.loadTexture(res_bar[i].resImg);
            resNum.setString(res_bar[i].info);
            this.resInfoBar.addChild(resInfoModel);

            var posX;
            var posY=0.5*resInfoBarSize.height;
            resInfoModel.setScaleX(scaleToWidth);
            if (i == 0) posX = alignBorderPercent*resInfoBarSize.width + resInfoBarSize.width*percentWidth*0.5;
            else posX += resInfoBarSize.width*percentWidth + dBetweenXPercent*resInfoBarSize.width;
            resInfoModel.setPosition(posX,posY);
        }

    }
    ,
    makeCatItems: function(){
        // ============creat cat slot===============
        // make rows of shop category
        var background= new cc.Layer();
        background.setName("shopCatLayer");
        var sizeOfBg = background.getContentSize(); //background=800x640
        var alignFromBorderX=0.1*sizeOfBg.width;
        var alignFromBorderY=0.1*sizeOfBg.height;
        var dBetweenX=0.025*sizeOfBg.width;
        var dBetweenY=0.05*sizeOfBg.height;
        var percentX = 0.25;
        var percentY = 0.75/2;
        //===Row1===

        //cat #1
        var resCat= this.makeCatSlot("GUIs/shop_gui/type_buy_res.png","NGÂN KHỐ");
        //Modify Scale
        var sizeOfSlot= resCat.getChildByName("catSlot").getSize();

        var widthInPercent=sizeOfBg.width*percentX;
        var heightInPercent=sizeOfBg.height*percentY;

        var scaleToWidth= widthInPercent/sizeOfSlot.width;
        var scaleToHeight= heightInPercent/sizeOfSlot.height;

        resCat.setScale(scaleToWidth,scaleToHeight);
        //Modify Position
        var posX=alignFromBorderX+0.5*widthInPercent;
        var posY=alignFromBorderY+dBetweenY+1.5*heightInPercent;

        resCat.setPosition(cc.p(posX,posY));

        background.addChild(resCat);

        //cat #2
        resCat= this.makeCatSlot("GUIs/shop_gui/type_res.png","TÀI NGUYÊN");

        resCat.setScale(scaleToWidth,scaleToHeight);

        posX=alignFromBorderX+dBetweenX+1.5*widthInPercent;
        posY=alignFromBorderY+dBetweenY+1.5*heightInPercent;

        resCat.setPosition(cc.p(posX,posY));

        background.addChild(resCat);

        btn = resCat.getChildByName("catTitleBtn");
        btn.addClickEventListener(function(){
            cc.log("Click tài nguyên");

            background.setVisible(false);
            //show backBtn
            this.backBtn.setVisible(true);
            //show resources info bar
            this.resInfoBar.setVisible(true);
            //modify shop title
            this.shopTitle.setString("TÀI NGUYÊN");

            this.openItemListOfType(ITEM_TYPE.RES);

        }.bind(this));
        //cat #3

        resCat= this.makeCatSlot("GUIs/shop_gui/type_dc.png","TRANG TRÍ");

        resCat.setScale(scaleToWidth,scaleToHeight);

        posX=alignFromBorderX+2*dBetweenX+2.5*widthInPercent;
        posY=alignFromBorderY+dBetweenY+1.5*heightInPercent;

        resCat.setPosition(cc.p(posX,posY));

        background.addChild(resCat);

        //===Row2===
        //cat #1
        resCat= this.makeCatSlot("GUIs/shop_gui/type_army.png","QUÂN ĐỘI");

        resCat.setScale(scaleToWidth,scaleToHeight);

        posX=alignFromBorderX+0.5*widthInPercent;
        posY=alignFromBorderY+0.5*heightInPercent;

        resCat.setPosition(cc.p(posX,posY));

        background.addChild(resCat);
        btn = resCat.getChildByName("catTitleBtn");
        btn.addClickEventListener(function(){
            cc.log("Click QUÂN ĐỘI");

            background.setVisible(false);
            //show backBtn
            this.backBtn.setVisible(true);
            //show resources info bar
            this.resInfoBar.setVisible(true);
            //modify shop title
            this.shopTitle.setString("QUÂN ĐỘI");
            this.openItemListOfType(ITEM_TYPE.ARMY);

        }.bind(this));
        //cat #2
        resCat= this.makeCatSlot("GUIs/shop_gui/type_defense.png","PHÒNG THỦ");

        resCat.setScale(scaleToWidth,scaleToHeight);

        posX=alignFromBorderX+dBetweenX+1.5*widthInPercent;
        posY=alignFromBorderY+0.5*heightInPercent;

        resCat.setPosition(cc.p(posX,posY));

        background.addChild(resCat);

        btn = resCat.getChildByName("catTitleBtn");
        btn.addClickEventListener(function(){
            cc.log("Click QUÂN ĐỘI");

            background.setVisible(false);
            //show backBtn
            this.backBtn.setVisible(true);
            //show resources info bar
            this.resInfoBar.setVisible(true);
            //modify shop title
            this.shopTitle.setString("PHÒNG THỦ");
            this.openItemListOfType(ITEM_TYPE.DEF);

        }.bind(this));
        //cat #3

        resCat= this.makeCatSlot("GUIs/shop_gui/type_sheild.png","BẢO VỆ");

        resCat.setScale(scaleToWidth,scaleToHeight);

        posX=alignFromBorderX+2*dBetweenX+2.5*widthInPercent;
        posY=alignFromBorderY+0.5*heightInPercent;

        resCat.setPosition(cc.p(posX,posY));

        background.addChild(resCat);

        return background;
    },
    makeCatSlot: function(imgCat,titleCat){
        var slotCatModel = ccs.load("zccs/ShopItem.json","").node;
        var catImg= slotCatModel.getChildByName("catImg");
        var title= slotCatModel.getChildByName("catTitleBtn").getChildByName("catTitle");

        catImg.loadTexture(imgCat);
        title.setString(titleCat);
        return slotCatModel;
    },
    openItemListOfType: function(resType){

        //Show list of Items
        //if not this layer not init then init
        if (this.listItemsLayer == null){
        listOfItemLayer = new TableViewTestLayer(resType);
        var heightInPercent = 0.7;
        var width = this.background.getContentSize().width;
        var height = this.background.getContentSize().height*0.7; //70% background's height
        var tbViewLayerSize = cc.size(width,height);
        UltiGUI.setSizeForObj(listOfItemLayer,listOfItemLayer.getContentSize(),tbViewLayerSize); //set Size for tableview

        var posY=this.background.getContentSize().height*(1-heightInPercent)/2; //set position for tableview
        listOfItemLayer.setAnchorPoint(cc.p(0,0));
        listOfItemLayer.setPosition(0,posY);

        this.listItemsLayer=listOfItemLayer;
        this.background.addChild(listOfItemLayer);
        } //else show this layer
        else{
            //pass data into this layer
            //set visible
            this.listItemsLayer.loadDataFromJson(resType);
            this.listItemsLayer.setVisible(true);
        }

    },
    open: function(){
        this.setVisible(true);
        this.backBtn.setVisible(false);
        this.resInfoBar.setVisible(false);
        this.listItemsLayer.setVisible(false);
        this.background.getChildByName("shopCatLayer").setVisible(true);
        this.shopTitle.setString("CỬA HÀNG");
    }
});

var CustomTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);
    }
});
var TableViewTestLayer = cc.Layer.extend({
    layerSize:null,
    cellSize: null,
    dataItems: {},
    numItems:0,
    tableView: null,
    ctor:function (resType) {
        this._super();
        this.init(resType);
    },

    init:function (resType) {

        this.dataItems=ShopConfig.loadItemsOfType(resType);
        this.numItems = Object.keys(this.dataItems).length;

        this.layerSize = this.getContentSize();
        var tableView = new cc.TableView(this, this.layerSize);
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        tableView.x = 0;
        tableView.y = 0;
        tableView.setDelegate(this);
        this.addChild(tableView);
        tableView.reloadData();

        this.tableView =  tableView;
        return true;
    },

    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
        if (ItemModel.checkClickOnItem(cell.getChildByTag(456))){
            cc.log("CLICK ONTO "+this.dataItems[Object.keys(this.dataItems)[cell.getIdx()]]["title"]);
        }

    },
    tableCellHighlight:function(table, cell){
        cc.log("cell highlight at index: " + cell.getIdx());
        if (ItemModel.checkClickOnItem(cell.getChildByTag(456))) {
            cc.log("WE SCALE");
            var actionBy = cc.scaleBy(0.01, 1.01, 1.01);
            cell.getChildByTag(456).runAction(actionBy);
        }
    }
    ,
    tableCellUnhighlight:function(table, cell){
        cc.log("cell release at index: " + cell.getIdx());
        if (ItemModel.checkClickOnItem(cell.getChildByTag(456))) {
            var actionBy = cc.scaleBy(0.01, 1 / 1.01, 1 / 1.01);
            cell.getChildByTag(456).runAction(actionBy);
        }
    }
    ,
    tableCellSizeForIndex:function (table, idx) {
        this.cellSize = new cc.size(this.layerSize.width/3.5,this.layerSize.height);
        return this.cellSize;
    },

    tableCellAtIndex:function (table, idx) {
        cc.log("TABLE CELL AT INDEX"+idx.toFixed());

        //var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        //var label;
        var id = Object.keys(this.dataItems)[idx];
        if (!cell) {

            cell = new CustomTableViewCell();
/*
            label = new cc.LabelTTF(strValue, "Helvetica", 20.0);
            label.x = 0;
            label.y = 0;
            label.anchorX = 0;
            label.anchorY = 0;
            label.tag = 123;
            cell.addChild(label);
*/
            //Init Cell with Item Inside
             var itemModel=new ItemModel();
             var item = itemModel.getModel(); //Get csd.node.
             var sizeOfItem = itemModel.getSize();
             UltiGUI.setSizeForObj(item,sizeOfItem, this.cellSize); //setSize
             item.setPosition(cc.p(0,0)); //set Position
             item.setTag(456); //set Tag
             itemModel.setData(this.dataItems[id]); //modify data of Item
             cell.addChild(item);


        } else {
             //cell.getChildByTag(123).setString(idx);
             ItemModel.setData(cell.getChildByTag(456),this.dataItems[id]);
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.numItems ;
    },

    loadDataFromJson: function(resType){
        this.dataItems=ShopConfig.loadItemsOfType(resType);
        this.numItems = Object.keys(this.dataItems).length;
        this.tableView.reloadData();
    }
});


