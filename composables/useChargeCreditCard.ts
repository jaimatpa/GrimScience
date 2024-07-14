import type { UseFetchOptions } from "#app";

export const useChargeCreditCard = async (chargeData, opts: UseFetchOptions<any>) => {
  const toast = useToast();
  const config = useRuntimeConfig()
  const {cardInfo, orderInfo, customerInfo} = chargeData
  try {
    const apiFetch = $fetch.create({
      onResponseError({ response }) {
        toast.add({
          title: 'Error',
          description: response?._data?.message??response?._data?.error??'Some error happened!',
          icon: 'i-heroicons-exclamation-circle',
          color: 'red'
        })
      }
    })
    return await apiFetch('https://apitest.authorize.net/xml/v1/request.api', 
      {
        method: 'POST',
        body: {
          "createTransactionRequest": {
              "merchantAuthentication": {
                  "name": config.public.AUTHORIZE_API_LOGIN_KEY,
                  "transactionKey": config.public.AUTHORIZE_TRANSACTION_KEY
              },
              "transactionRequest": {
                  "transactionType": "authCaptureTransaction",
                  "amount": `${cardInfo.amount}`,
                  "payment": {
                      "creditCard": {
                          "cardNumber": cardInfo.cardnumber,
                          "expirationDate": `${cardInfo.expirationyear}-${cardInfo.expirationmonth}`,
                          "cardCode": cardInfo.ccv
                      }
                  },
                  "lineItems": {
                      "lineItem": {
                          "itemId": "1",
                          "name": "vase",
                          "description": "Cannes logo",
                          "quantity": "1",
                          "unitPrice": "45.00"
                      }
                  },
                  "tax": {
                      "amount": `${orderInfo.tax ?? 0}`,
                      "name": "level2 tax name",
                      "description": "level2 tax"
                  },
                  "duty": {
                      "amount": `${orderInfo.MDET ?? 0}`,
                      "name": "duty name",
                      "description": "duty description"
                  },
                  "shipping": {
                      "amount": `${orderInfo.shipping ?? 0}`,
                      "name": "level2 tax name",
                      "description": "level2 tax"
                  },
                  "poNumber": "",
                  "customer": {
                      "id": customerInfo.customerID
                  },
                  "billTo": {
                      "firstName": customerInfo.fname,
                      "lastName": customerInfo.lname,
                      "company": customerInfo.company1,
                      "address": customerInfo.address,
                      "city": customerInfo.city,
                      "state": customerInfo.state,
                      "zip": customerInfo.zip,
                      "country": customerInfo.country
                  },
                  "shipTo": {
                      "firstName": customerInfo.fname,
                      "lastName": customerInfo.lname,
                      "company": customerInfo.company1,
                      "address": customerInfo.address,
                      "city": customerInfo.city,
                      "state": customerInfo.state,
                      "zip": customerInfo.zip,
                      "country": customerInfo.country
                  },
                  "customerIP": "",
                  "transactionSettings": {
                      "setting": {
                          "settingName": "testRequest",
                          "settingValue": "false"
                      }
                  },
                  "userFields": {
                      "userField": [
                          {
                              "name": "MerchantDefinedFieldName1",
                              "value": "MerchantDefinedFieldValue1"
                          },
                          {
                              "name": "favorite_color",
                              "value": "blue"
                          }
                      ]
                  },
            "processingOptions": {
                  "isSubsequentAuth": "true"
                  },
                  "subsequentAuthInformation": {
                  "originalNetworkTransId": config.public.AUTHORIZE_TRANSACTION_KEY,
                  "originalAuthAmount": `${orderInfo.subtotal ?? 0}`,
                  "reason": "resubmission"         
                  },			
                  "authorizationIndicatorType": {
                  "authorizationIndicator": "final"
                }
              }
          }
        },
        server: false, 
        lazy: true,
        ...opts
      } as any
    )
  } catch (error) {

  }
};