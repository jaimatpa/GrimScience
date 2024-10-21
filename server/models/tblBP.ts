import { DataTypes } from "sequelize";
import sequelize from "../utils/databse";

const tblBP = sequelize.define(
  "tblBP",
  {
    UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    instanceID: {
      type: DataTypes.INTEGER,
    },
    oldproductid: {
      type: DataTypes.INTEGER,
    },
    oldpartid: {
      type: DataTypes.INTEGER,
    },
    partflag: {
      type: DataTypes.BOOLEAN,
    },
    subassemblyflag: {
      type: DataTypes.BOOLEAN,
    },
    productflag: {
      type: DataTypes.BOOLEAN,
    },
    supplyflag: {
      type: DataTypes.BOOLEAN,
    },
    ALTER2LEADTIME: {
      type: DataTypes.STRING,
    },
    ALTER2MANTXT: {
      type: DataTypes.STRING,
    },
    ALTER2MANNUM: {
      type: DataTypes.STRING,
    },
    ALTER2DEATXT: {
      type: DataTypes.STRING,
    },
    ALTER2DEANUM: {
      type: DataTypes.STRING,
    },
    ALTER2QTY1: {
      type: DataTypes.STRING,
    },
    ALTER2QTY2: {
      type: DataTypes.STRING,
    },
    ALTER2QTY4: {
      type: DataTypes.STRING,
    },
    ALTER2QTY3: {
      type: DataTypes.STRING,
    },
    ALTER2PRICE1: {
      type: DataTypes.STRING,
    },
    ALTER2PRICE4: {
      type: DataTypes.STRING,
    },
    ALTER2PRICE3: {
      type: DataTypes.STRING,
    },
    ALTER2PRICE2: {
      type: DataTypes.STRING,
    },
    ALTER2PRICE5: {
      type: DataTypes.STRING,
    },
    ALTER2QTY5: {
      type: DataTypes.STRING,
    },
    ALTER1LEADTIME: {
      type: DataTypes.STRING,
    },
    ALTER1MANTXT: {
      type: DataTypes.STRING,
    },
    ALTER1MANNUM: {
      type: DataTypes.STRING,
    },
    ALTER1DEATXT: {
      type: DataTypes.STRING,
    },
    ALTER1DEANUM: {
      type: DataTypes.STRING,
    },
    ALTER1QTY1: {
      type: DataTypes.STRING,
    },
    ALTER1QTY2: {
      type: DataTypes.STRING,
    },
    ALTER1QTY4: {
      type: DataTypes.STRING,
    },
    ALTER1QTY3: {
      type: DataTypes.STRING,
    },
    ALTER1PRICE1: {
      type: DataTypes.STRING,
    },
    ALTER1PRICE4: {
      type: DataTypes.STRING,
    },
    ALTER1PRICE3: {
      type: DataTypes.STRING,
    },
    ALTER1PRICE2: {
      type: DataTypes.STRING,
    },
    ALTER1PRICE5: {
      type: DataTypes.STRING,
    },
    ALTER1QTY5: {
      type: DataTypes.STRING,
    },
    PRIMARYQTY5: {
      type: DataTypes.STRING,
    },
    PRIMARYPRICE5: {
      type: DataTypes.STRING,
    },
    PRIMARYPRICE2: {
      type: DataTypes.STRING,
    },
    PRIMARYPRICE3: {
      type: DataTypes.STRING,
    },
    PRIMARYPRICE4: {
      type: DataTypes.STRING,
    },
    PRIMARYPRICE1: {
      type: DataTypes.STRING,
    },
    PRIMARYQTY3: {
      type: DataTypes.STRING,
    },
    PRIMARYQTY4: {
      type: DataTypes.STRING,
    },
    PRIMARYQTY2: {
      type: DataTypes.STRING,
    },
    PRIMARYQTY1: {
      type: DataTypes.STRING,
    },
    PRIMARYDEANUM: {
      type: DataTypes.STRING,
    },
    PRIMARYDEATXT: {
      type: DataTypes.STRING,
    },
    PRIMARYMANNUM: {
      type: DataTypes.STRING,
    },
    PRIMARYMANTXT: {
      type: DataTypes.STRING,
    },
    PRIMARYLEADTIME: {
      type: DataTypes.STRING,
    },
    SELLINGPRICE: {
      type: DataTypes.STRING,
    },
    SUBCATEGORY: {
      type: DataTypes.STRING,
    },
    PARTTYPE: {
      type: DataTypes.STRING,
    },
    SPECIFICATIONS: {
      type: DataTypes.STRING,
    },
    DESCRIPTION: {
      type: DataTypes.STRING,
    },
    STOCKNUMBER: {
      type: DataTypes.STRING,
    },
    UNIT: {
      type: DataTypes.STRING,
    },
    MULTIPLE: {
      type: DataTypes.INTEGER,
    },
    CODE: {
      type: DataTypes.STRING,
    },
    TODAY: {
      type: DataTypes.DATE,
    },
    PRODUCTLINE: {
      type: DataTypes.STRING,
    },
    MODEL: {
      type: DataTypes.STRING,
    },
    WARRENTY: {
      type: DataTypes.STRING,
    },
    SHIPWEIGHT: {
      type: DataTypes.STRING,
    },
    NETWEIGHTFULL: {
      type: DataTypes.STRING,
    },
    ELECTRICAL: {
      type: DataTypes.STRING,
    },
    NETWEIGHT: {
      type: DataTypes.STRING,
    },
    OnHand: {
      type: DataTypes.INTEGER,
    },
    AdjustedAmount: {
      type: DataTypes.STRING,
    },
    Reason: {
      type: DataTypes.STRING,
    },
    COMMENT: {
      type: DataTypes.STRING,
    },
    ORDERCOST: {
      type: DataTypes.STRING,
    },
    WORKCENTERS: {
      type: DataTypes.STRING,
    },
    ALTER2UL: {
      type: DataTypes.STRING,
    },
    ALTER1UL: {
      type: DataTypes.STRING,
    },
    PRIMARYUL: {
      type: DataTypes.STRING,
    },
    DRAWINGCUSTOM: {
      type: DataTypes.STRING,
    },
    EQUIPMENTFLAG: {
      type: DataTypes.STRING,
    },
    PlanID: {
      type: DataTypes.INTEGER,
    },
    GeneralType: {
      type: DataTypes.STRING,
    },
    AccountNumber: {
      type: DataTypes.STRING,
    },
    InventoryUnit: {
      type: DataTypes.STRING,
    },
    InventoryCost: {
      type: DataTypes.STRING,
    },
    HEIGHT: {
      type: DataTypes.STRING,
    },
    WIDTH: {
      type: DataTypes.STRING,
    },
    LENGTH: {
      type: DataTypes.STRING,
    },
    SPECSHEET: {
      type: DataTypes.STRING,
    },
    TANKDEPTH: {
      type: DataTypes.STRING,
    },
    WAXCAPACITY: {
      type: DataTypes.STRING,
    },
    CRYOTHERMSECTIONS: {
      type: DataTypes.STRING,
    },
    CRYOTHERMWALLS: {
      type: DataTypes.STRING,
    },
    CRYOTHERMGALLONSLEFT: {
      type: DataTypes.STRING,
    },
    CRYOTHERMGALLONSRIGHT: {
      type: DataTypes.STRING,
    },
    CRYOTHERMCATEGORY: {
      type: DataTypes.STRING,
    },
    DURALASTSUBCATEGORY: {
      type: DataTypes.STRING,
    },
    DURALASTCATEGORY: {
      type: DataTypes.STRING,
    },
    PARADYNAMIXSUBCATEGORY: {
      type: DataTypes.STRING,
    },
    PARADYNAMIXCATEGORY: {
      type: DataTypes.STRING,
    },
    CRYOTHERMWARMTANKSWITCHABLE: {
      type: DataTypes.STRING,
    },
    VariablePricing: {
      type: DataTypes.STRING,
    },
    BuiltInHouse: {
      type: DataTypes.BOOLEAN,
    },
    minimum: {
      type: DataTypes.INTEGER,
    },
    CryothermCorianNumber: {
      type: DataTypes.STRING,
    },
    CryothermPcoatNumber: {
      type: DataTypes.STRING,
    },
    CryothermLeftFrame: {
      type: DataTypes.STRING,
    },
    CryothermLeftTank: {
      type: DataTypes.STRING,
    },
    CryothermLeftPump: {
      type: DataTypes.STRING,
    },
    CryothermLeftJets: {
      type: DataTypes.STRING,
    },
    CryothermLeftCunitNumber: {
      type: DataTypes.STRING,
    },
    CryothermRightFrame: {
      type: DataTypes.STRING,
    },
    CryothermRightTank: {
      type: DataTypes.STRING,
    },
    CryothermRightPump: {
      type: DataTypes.STRING,
    },
    CryothermRightJets: {
      type: DataTypes.STRING,
    },
    CryothermRightCunitnumber: {
      type: DataTypes.STRING,
    },
    InspectionLevel: {
      type: DataTypes.STRING,
    },
    MDET: {
      type: DataTypes.INTEGER,
    },
    MDET1: {
      type: DataTypes.DECIMAL,
    },
    override: {
      type: DataTypes.STRING,
    },
    grossprofit: {
      type: DataTypes.STRING,
    },
    CryoThermControlPanelNumber: {
      type: DataTypes.STRING,
    },
    CryoThermHeaterNumber: {
      type: DataTypes.STRING,
    },
    amps: {
      type: DataTypes.STRING,
    },
    ETLCriticalComponent: {
      type: DataTypes.BOOLEAN,
    },
    sds: {
      type: DataTypes.STRING,
    },
    SubassemblyInventoried: {
      type: DataTypes.STRING,
    },
    LeftTankAssembly: {
      type: DataTypes.STRING,
    },
    RightTankAssembly: {
      type: DataTypes.STRING,
    },
    RevisedBy: {
      type: DataTypes.STRING,
    },
    Recommendations: {
      type: DataTypes.TEXT,
    },
    StatementOfNeed: {
      type: DataTypes.TEXT,
    },
    SupportorProject: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "tblBP",
    timestamps: false,
  }
);

export default tblBP;
