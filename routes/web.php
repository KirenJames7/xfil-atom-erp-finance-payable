<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('app.index');
});

Route::get('apifl', 'Controller@getFLAPIUrl')->middleware('ajax');

Route::get('apiim', 'Controller@getIMAPIUrl')->middleware('ajax');

Route::post('authenticate', 'LDAPAuth\User\UserController@userSignIn')->middleware('ajax');

Route::post('unauthenticate', 'LDAPAuth\User\UserController@userSignOut')->middleware('ajax');

Route::get('checkactivesession', 'LDAPAuth\User\UserController@userSessionActiveCheck')->middleware('ajax');

Route::get('features', 'Feature\FeatureController@getFeatures')->middleware('ajax');

Route::get('vendors', 'Vendor\VendorController@listAllVendors')->middleware('ajax');

Route::get('vendorcontacts', 'Vendor\VendorContactController@listVendorContacts')->middleware('ajax');

Route::post('vendorcreation', 'Vendor\VendorController@vendorCreation')->middleware('ajax');

Route::get('contacttypes', 'ContactType\ContactTypeController@listAllContactTypes')->middleware('ajax');


Route::get('testmail', 'MailController@send');

Route::get('adminauthorizationstructures', 'LDAPAuth\User\AuthorizationStructure\AuthorizationStructureController@listAuthorizationStructures')->middleware('ajax');

Route::get('adminpurchasegroups', 'LDAPAuth\User\PurchaseGroup\PurchaseGroupController@listPurchaseGroupsAdministration')->middleware('ajax');

Route::get('adminusermanagement', 'LDAPAuth\User\UserManagement\UserManagementController@listUsers')->middleware('ajax');

Route::get('existingusers', 'LDAPAuth\User\UserManagement\UserManagementController@listExistingUsers')->middleware('ajax');

Route::get('purchaserequeststatuses', 'PurchaseRequestStatus\PurchaseRequestStatusController@listPurchaseRequestStatuses')->middleware('ajax');

Route::get('purchaserequests', 'PurchaseRequest\PurchaseRequestController@listPurchaseRequests')->middleware('ajax');

Route::post('newpurchaserequest', 'PurchaseRequest\PurchaseRequestController@insertPurchaseRequest')->middleware('ajax');

Route::post('deletepurchaserequest', 'PurchaseRequest\PurchaseRequestController@deletePurchaseRequest')->middleware('ajax');

Route::post('cancelpurchaserequest', 'PurchaseRequest\PurchaseRequestController@cancelPurchaseRequest')->middleware('ajax');

Route::post('editpurchaserequest', 'PurchaseRequest\PurchaseRequestController@editPurchaseRequest')->middleware('ajax');

Route::post('sendpurchaserequestforapproval', 'PurchaseRequest\PurchaseRequestController@sendPurchaseRequestForApproval')->middleware('ajax');

Route::get('purchaserequestapprovereject', 'PurchaseRequestApproveReject\PurchaseRequestApproveRejectController@listPurchaseRequestApproveReject')->middleware('ajax');

Route::post('purchaserequestreject', 'PurchaseRequestApproveReject\PurchaseRequestApproveRejectController@rejectPurchaseRequest')->middleware('ajax');

Route::post('purchaserequestapprove', 'PurchaseRequestApproveReject\PurchaseRequestApproveRejectController@approvePurchaseRequest')->middleware('ajax');

Route::get('purchasequotestatuses', 'PurchaseQuoteStatus\PurchaseQuoteStatusController@listPurchaseQuoteStatuses')->middleware('ajax');

Route::get('purchasequotes', 'PurchaseQuote\PurchaseQuoteHeaderController@listPurchaseQuotes')->middleware('ajax');

Route::get('purchasequotelines', 'PurchaseQuote\PurchaseQuoteLineController@listPurchaseQuoteLines')->middleware('ajax');

Route::post('newpurchasequote', 'PurchaseQuote\PurchaseQuoteHeaderController@newPurchaseQuote')->middleware('ajax');

Route::post('extendpurchasequote', 'PurchaseQuote\PurchaseQuoteHeaderController@extendPurchaseQuote')->middleware('ajax');

Route::post('sendpurchasequotesforauthorization', 'PurchaseQuote\PurchaseQuoteHeaderController@sendPurchaseQuoteForAuthorization')->middleware('ajax');

Route::get('purchasequoteauthorization', 'PurchaseQuotePurchaseOrderAuthorization\PurchaseQuotePurchaseOrderAuthorizationController@listPurchaseQuotesForAuthorization')->middleware('ajax');

Route::get('purchaserequestpurchasequoteauthorization', 'PurchaseQuotePurchaseOrderAuthorization\PurchaseQuotePurchaseOrderAuthorizationController@listPurchaseRequestPurchaseQuotesForAuthorization')->middleware('ajax');

Route::get('purchaserequestpurchasequotepurchasequotelineauthorization', 'PurchaseQuotePurchaseOrderAuthorization\PurchaseQuotePurchaseOrderAuthorizationController@listPurchaseRequestPurchaseQuotesPurchaseQuoteLinesForAuthorization')->middleware('ajax');

Route::post('purchasequotereject', 'PurchaseQuotePurchaseOrderAuthorization\PurchaseQuotePurchaseOrderAuthorizationController@rejectPurchaseQuote')->middleware('ajax');

Route::post('purchasequoteauthorize', 'PurchaseQuotePurchaseOrderAuthorization\PurchaseQuotePurchaseOrderAuthorizationController@authorizePurchaseQuote')->middleware('ajax');

Route::get('purchaseorderstatuses', 'PurchaseOrderStatus\PurchaseOrderStatusController@listPurchaseOrderStatuses')->middleware('ajax');

Route::get('deliverymodes', 'DeliveryMode\DeliveryModeController@listDeliveryModes')->middleware('ajax');

Route::get('deliveryterms', 'DeliveryTerm\DeliveryTermController@listDeliveryTerms')->middleware('ajax');

Route::get('paymentterms', 'PaymentTerm\PaymentTermController@listPaymentTerms')->middleware('ajax');

Route::get('methodsofpayment', 'MethodOfPayment\MethodOfPaymentController@listMethodsofPayment')->middleware('ajax');

Route::get('purchaseorders', 'PurchaseOrder\PurchaseOrderHeaderController@listAllPurchaseOrders')->middleware('ajax');

Route::get('purchaseorderlines', 'PurchaseOrder\PurchaseOrderLineController@listPurchaseOrderLines')->middleware('ajax');

Route::get('purchasequotesforpurchaseorders', 'PurchaseOrder\PurchaseOrderHeaderController@listPurchaseQuotesForPurchaseOrders')->middleware('ajax');

Route::get('purchasequotelinesforpurchaseorders', 'PurchaseOrder\PurchaseOrderHeaderController@listAuthorizedPurchaseQuoteLines')->middleware('ajax');

Route::post('newpurchaseorder', 'PurchaseOrder\PurchaseOrderHeaderController@newPurchaseOrder')->middleware('ajax');

Route::get('unassingedpurchasegroupusers', 'LDAPAuth\User\PurchaseGroup\PurchaseGroupUserController@listUsers')->middleware('ajax');