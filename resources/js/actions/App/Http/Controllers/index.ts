import Api from './Api'
import Planning from './Planning'
import DashboardController from './DashboardController'
import OrderController from './OrderController'
import OrderEmployeeController from './OrderEmployeeController'
import ProductionOrderProcessingController from './ProductionOrderProcessingController'
import OrderStateController from './OrderStateController'
import ArticleICController from './ArticleICController'
import ArticleIPController from './ArticleIPController'
import ArticleIOController from './ArticleIOController'
import ModelSCQController from './ModelSCQController'
import PalletSheetController from './PalletSheetController'
import ArticleController from './ArticleController'
import CustomerController from './CustomerController'
import CustomerDivisionController from './CustomerDivisionController'
import CustomerShippingAddressController from './CustomerShippingAddressController'
import SupplierController from './SupplierController'
import MaterialController from './MaterialController'
import MachineryController from './MachineryController'
import PalletTypeController from './PalletTypeController'
import CriticalIssueController from './CriticalIssueController'
import ArticleCategoryController from './ArticleCategoryController'
import EmployeeController from './EmployeeController'
import OfferActivityController from './OfferActivityController'
import OfferTypeController from './OfferTypeController'
import OfferSectorController from './OfferSectorController'
import OfferSeasonalityController from './OfferSeasonalityController'
import LasFamilyController from './LasFamilyController'
import LasWorkLineController from './LasWorkLineController'
import LsResourceController from './LsResourceController'
import OfferOrderTypeController from './OfferOrderTypeController'
import OfferOperationCategoryController from './OfferOperationCategoryController'
import OfferOperationController from './OfferOperationController'
import OfferOperationListController from './OfferOperationListController'
import OfferController from './OfferController'
import ValueTypesController from './ValueTypesController'
import ProductionPortalWebController from './ProductionPortalWebController'
import Settings from './Settings'

const Controllers = {
    Api: Object.assign(Api, Api),
    Planning: Object.assign(Planning, Planning),
    DashboardController: Object.assign(DashboardController, DashboardController),
    OrderController: Object.assign(OrderController, OrderController),
    OrderEmployeeController: Object.assign(OrderEmployeeController, OrderEmployeeController),
    ProductionOrderProcessingController: Object.assign(ProductionOrderProcessingController, ProductionOrderProcessingController),
    OrderStateController: Object.assign(OrderStateController, OrderStateController),
    ArticleICController: Object.assign(ArticleICController, ArticleICController),
    ArticleIPController: Object.assign(ArticleIPController, ArticleIPController),
    ArticleIOController: Object.assign(ArticleIOController, ArticleIOController),
    ModelSCQController: Object.assign(ModelSCQController, ModelSCQController),
    PalletSheetController: Object.assign(PalletSheetController, PalletSheetController),
    ArticleController: Object.assign(ArticleController, ArticleController),
    CustomerController: Object.assign(CustomerController, CustomerController),
    CustomerDivisionController: Object.assign(CustomerDivisionController, CustomerDivisionController),
    CustomerShippingAddressController: Object.assign(CustomerShippingAddressController, CustomerShippingAddressController),
    SupplierController: Object.assign(SupplierController, SupplierController),
    MaterialController: Object.assign(MaterialController, MaterialController),
    MachineryController: Object.assign(MachineryController, MachineryController),
    PalletTypeController: Object.assign(PalletTypeController, PalletTypeController),
    CriticalIssueController: Object.assign(CriticalIssueController, CriticalIssueController),
    ArticleCategoryController: Object.assign(ArticleCategoryController, ArticleCategoryController),
    EmployeeController: Object.assign(EmployeeController, EmployeeController),
    OfferActivityController: Object.assign(OfferActivityController, OfferActivityController),
    OfferTypeController: Object.assign(OfferTypeController, OfferTypeController),
    OfferSectorController: Object.assign(OfferSectorController, OfferSectorController),
    OfferSeasonalityController: Object.assign(OfferSeasonalityController, OfferSeasonalityController),
    LasFamilyController: Object.assign(LasFamilyController, LasFamilyController),
    LasWorkLineController: Object.assign(LasWorkLineController, LasWorkLineController),
    LsResourceController: Object.assign(LsResourceController, LsResourceController),
    OfferOrderTypeController: Object.assign(OfferOrderTypeController, OfferOrderTypeController),
    OfferOperationCategoryController: Object.assign(OfferOperationCategoryController, OfferOperationCategoryController),
    OfferOperationController: Object.assign(OfferOperationController, OfferOperationController),
    OfferOperationListController: Object.assign(OfferOperationListController, OfferOperationListController),
    OfferController: Object.assign(OfferController, OfferController),
    ValueTypesController: Object.assign(ValueTypesController, ValueTypesController),
    ProductionPortalWebController: Object.assign(ProductionPortalWebController, ProductionPortalWebController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers