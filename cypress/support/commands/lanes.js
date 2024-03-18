import { laneForm } from '../../forms'

const lanesSelectors = {
  laneTabs: {
    airLaneTab: '#btnAir',
    seaLaneTab: '#btnOcean',
    roadLaneTab: '#btnRoad',
    railLaneTab: '#btnRail',
    logisticsLaneTab: '#btnLogistics',
    brokerageLaneTab: '#btnBrokerage',
  },

  laneForm: {
    currencyDropdown: '#select2-ddlCurrency-container',
    volumeInput: '#txtVolume',
    volumeDropdown: '#select2-ddlVolumeUnit-container',
    revenuePrefix: '.custom-col.col:nth-of-type(5) .prefix.revenuePrefix',
    revenueInput: '#txtRevenue',
    profitPrefix: '.prefix.profitPrefix',
    profitInput: '#txtProfit',
    profitDropdown: '#select2-ddlProfitType-container',
    textCurrencyPrefix: '.input-holder.txtCurrency .prefix.revenuePrefix',
    textCurrency: '#txtCurrency',
    originShipper: '#txtOriginShipper',
    originRegion: '#select2-ddlOriginRegion-container',
    originCountry: '#select2-ddlOriginCountry-container',
    originLocationForm: '#select2-ddlOriginLocation-container',
    destinationCompany: '#txtConsigneeName',
    destinationRegion: '#select2-ddlDestinationRegion-container',
    destinationCountry: '#select2-ddlDestinationCountry-container',
    destinationLocationForm: '#select2-ddlDestinationLocation-container',
    recieveFrom3PLContent: '.col-xl-4.log-col:nth-child(1) .select2-selection.select2-selection--multiple .select2-selection__choice',
    serviceLocationContent: '#select2-ddlServiceLocation-container',
    specialRequirementsContent: '.col-xl-4.log-col:nth-child(3) .select2-selection.select2-selection--multiple .select2-selection__choice',
    barcodeInput: '#chkRequireBarcode',
    trackAndTraceInput: '#chkTracking',
    pickUpInput: '#chkCustomerPickup',
    commentText: '#txtComments',
    saveLane: '#btnSaveLane',
    deleteLane: '#btnDelete',
    laneProfitType: "#ddlProfitType"
  },

  laneValidation: {
    volumeRequired: '.vol-col.custom-col.col-xl-3 .errorText',
    volumeInputError: 'input#txtVolume[class="txtVolume error"]',
    revenueRequired: '.custom-col.col .errorText',
    revenueInputError: 'input#txtRevenue[class="error"]',
    profitRequired: '.input-holder.txtProfit .errorText',
    profitInputError: 'input#txtProfit[class="error"]',
    originShipperRequired: '#divOrigin .input-wrap:nth-of-type(1) .errorText',
    originShipperError: 'input#txtOriginShipper[class="error"]',
    originRegionRequired: '#divOrigin .input-wrap:nth-of-type(2) .errorText',
    originRegionError: '[aria-labelledby="select2-ddlOriginRegion-container"]',
    destinationConsigneeRequired: '#divDestination .input-wrap:nth-of-type(1) .errorText',
    destinationConsigneeError: 'input#txtConsigneeName[class="error"]',
    destinationRegionRequired: '#divDestination .input-wrap:nth-of-type(2) .errorText',
    destinationRegionError: '[aria-labelledby="select2-ddlDestinationRegion-container"]'
  },

  laneOverview: {
    airIcon: '.icon-airplane',
    seaIcon: '.icon-ocean',
    roadIcon: '.icon-road',
    logisticsIcon: '.icon-logistics',
    brokerageIcon: '.icon-Brokerage----White',
    laneHeader: '.no-gutters.header-row .col.col-service > span',
    originHeader: '.no-gutters.values-row > .col-auto.values-label:nth-of-type(1)',
    originLocation: '.no-gutters.values-row > .col.values:nth-of-type(2) > span:nth-of-type(1)',
    originLocationCode: '.no-gutters.values-row > .col.values:nth-of-type(2) .airport-code',
    originLocationCountry: '.no-gutters.values-row > .col.values:nth-of-type(2) > span:nth-of-type(2)',
    destinationHeader: '.no-gutters.values-row > .col-auto.values-label:nth-of-type(4)',
    destinationLocation: '.no-gutters.values-row > .col.values:nth-of-type(5) > span:nth-of-type(1)',
    destinationLocationCode: '.no-gutters.values-row > .col.values:nth-of-type(5) .airport-code',
    destinationLocationCountry: '.no-gutters.values-row > .col.values:nth-of-type(5) > span:nth-of-type(2)',
    perMonthHeader: '.no-gutters.values-row > .col-auto.values-label:nth-of-type(7)',
    volume: '.no-gutters.values-row > .col.values:nth-of-type(8)',
    revenueHeader: '.table-wrp table.lane-table > tbody > tr:nth-of-type(4) > th:nth-of-type(2)',
    revenuePrefixLaneOverview: '.table-wrp table.lane-table > tbody > tr:nth-of-type(5) > td:nth-of-type(3)',
    revenueNumber: '.table-wrp table.lane-table > tbody > tr:nth-of-type(5) > td:nth-of-type(3) span.format-number',
    profitHeader: '.table-wrp table.lane-table > tbody > tr:nth-of-type(4) > th:nth-of-type(3)',
    profitPrefixLaneOverview: '.table-wrp table.lane-table > tbody > tr:nth-of-type(5) > td:nth-of-type(4)',
    profitNumber: '.table-wrp table.lane-table > tbody > tr:nth-of-type(5) > td:nth-of-type(4) span.format-number',
    editLane: '.icon-edit.edit-icon',
  },
}

const { airLaneTab, seaLaneTab, roadLaneTab, railLaneTab, logisticsLaneTab, brokerageLaneTab } = lanesSelectors.laneTabs

const {
  currencyDropdown,
  volumeInput,
  volumeDropdown,
  revenuePrefix,
  revenueInput,
  profitPrefix,
  profitInput,
  profitDropdown,
  textCurrencyPrefix,
  textCurrency,
  originShipper,
  originRegion,
  originCountry,
  originLocationForm,
  destinationCompany,
  destinationRegion,
  destinationCountry,
  destinationLocationForm,
  recieveFrom3PLContent,
  serviceLocationContent,
  specialRequirementsContent,
  barcodeInput,
  trackAndTraceInput,
  pickUpInput,
  commentText,
  saveLane,
  deleteLane,
  laneProfitType,
} = lanesSelectors.laneForm


const { volumeRequired, volumeInputError, revenueRequired, revenueInputError, profitRequired, profitInputError, originShipperRequired, originShipperError, originRegionRequired, originRegionError, destinationConsigneeRequired, destinationConsigneeError, destinationRegionRequired, destinationRegionError } = lanesSelectors.laneValidation

const {
  airIcon,
  seaIcon,
  roadIcon,
  logisticsIcon,
  brokerageIcon,
  laneHeader,
  originHeader,
  originLocation,
  originLocationCode,
  originLocationCountry,
  destinationHeader,
  destinationLocation,
  destinationLocationCode,
  destinationLocationCountry,
  perMonthHeader,
  volume,
  revenueHeader,
  revenuePrefixLaneOverview,
  revenueNumber,
  profitHeader,
  profitPrefixLaneOverview,
  profitNumber,
  editLane,
} = lanesSelectors.laneOverview

const newLaneSelector = (newLaneId) => `.outer-wrp.first-wrp.inner-wrp-padding[data-id="${newLaneId}"]`

Cypress.Commands.add('profitValidationChecker', () => {
  cy.get(saveLane).click()

  cy.get('.swal2-popup.swal2-modal.swal2-show').should('be.visible')
  cy.get('.swal2-icon.swal2-error.swal2-animate-error-icon > .swal2-x-mark > [class^="swal2-x-mark-line"]')
    .should('have.length', 2)
    .should('have.css', 'background-color')
    .and('eq', 'rgb(242, 116, 116)')
  cy.get('#swal2-content')
    .should('have.text', 'Profit cannot be higher than revenue.')
  cy.get('.swal2-actions > .swal2-confirm.swal2-styled')
    .should('be.visible')
    .contains('OK')
    .click()

  cy.get('#divLaneAddEdit').should('be.visible')
})

Cypress.Commands.add('laneFormChecker', (type,
  {
    currencyPrefix,
    currencyCode,
    volumeText,
    volumeUnit,
    revenueText,
    profitText,
    profitUnit,
    calculatedRevenue,
    originCompanyName,
    originRegionText,
    originCountryText,
    originLocationText,
    destinationCompanyName,
    destinationRegionText,
    destinationCountryText,
    destinationLocationText,
    content3pl,
    serviceLocationValue,
    specialRequirementsValue,
    barcodeChecked,
    trackAndTraceChecked,
    pickUpChecked,
    laneCommentText,
  }) => {

  if (type === 'air' || type === 'sea' || type === 'road') {
    cy.get(originShipper).invoke('val').should('eq', originCompanyName)
    cy.get(originRegion).should('have.text', originRegionText)
    cy.get(originCountry).should('have.text', originCountryText)
    cy.get(originLocationForm).should('have.text', originLocationText)
    cy.get(destinationCompany).invoke('val').should('eq', destinationCompanyName)
    cy.get(destinationRegion).should('have.text', destinationRegionText)
    cy.get(destinationCountry).should('have.text', destinationCountryText)
    cy.get(destinationLocationForm).contains(destinationLocationText)
  } else if (type === 'logistics') {
    cy.get(recieveFrom3PLContent).contains(content3pl)
    cy.get(serviceLocationContent).should('have.text', serviceLocationValue)
    cy.get(specialRequirementsContent).contains(specialRequirementsValue)

    if (barcodeChecked === true) {
      cy.get(barcodeInput).should('be.checked')
    } else {
      cy.get(barcodeInput).should('not.be.checked')
    }

    if (trackAndTraceChecked === true) {
      cy.get(trackAndTraceInput).should('be.checked')
    } else {
      cy.get(trackAndTraceInput).should('not.be.checked')
    }

    if (pickUpChecked === true) {
      cy.get(pickUpInput).should('be.checked')
    } else {
      cy.get(pickUpInput).should('not.be.checked')
    }
  }

  cy.get(currencyDropdown).should('have.text', currencyCode)
  cy.get(volumeInput).invoke('val').should('eq', volumeText)
  cy.get(volumeDropdown).contains(volumeUnit)
  cy.get(revenuePrefix).should('have.text', currencyPrefix)
  cy.get(revenueInput).invoke('val').should('eq', revenueText)
  cy.get(profitPrefix).should('have.text', currencyPrefix)
  cy.get(profitInput).invoke('val').should('eq', profitText)
  cy.get(profitDropdown).contains(profitUnit)
  cy.get(textCurrencyPrefix).should('have.text', currencyPrefix)
  cy.get(textCurrency).invoke('val').should('eq', calculatedRevenue)
  cy.get(commentText).invoke('val').should('eq', laneCommentText)
})

Cypress.Commands.add('checkLaneAirSeaRoad', (type, laneId, laneContent,
  {
    laneHeaderText,
    originLocationText,
    originLocationCodeText,
    originLocationCountryText,
    destinationLocationText,
    destinationLocationCodeText,
    destinationLocationCountryText,
    volumeText,
  }) => {

  const specificSelector = newLaneSelector(laneId)

  switch (type) {
    case 'air':
      cy.get(`${specificSelector} ${airIcon}`)
        .should('be.visible')
        .should('have.css', 'color')
        .and('eq', 'rgb(52, 168, 232)')
      break

    case 'sea':
      cy.get(`${specificSelector} ${seaIcon}`)
        .scrollIntoView()
        .should('be.visible')
        .should('have.css', 'color')
        // .and('eq', 'rgb(14, 130, 194)')
        .and('eq', 'rgb(52, 168, 232)')
      break

    case 'road':
      cy.get(`${specificSelector} ${roadIcon}`)
        .should('be.visible')
        .should('have.css', 'color')
        // .and('eq', 'rgb(51, 167, 153)')
        .and('eq', 'rgb(52, 168, 232)')
      break
  }

  switch (laneContent) {
    case 'empty':
      cy.get(`${specificSelector} ${originLocation}`)
        .should('have.class', 'hide')
        .and('exist')
      cy.get(`${specificSelector} ${originLocationCode}`).contains('( )')

      cy.get(`${specificSelector} ${destinationLocation}`)
        .should('have.class', 'hide')
        .and('exist')
      cy.get(`${specificSelector} ${destinationLocationCode}`).contains('( )')
      break

    case 'data':
      cy.get(`${specificSelector} ${originLocation}`).contains(originLocationText)
      cy.get(`${specificSelector} ${originLocationCode}`).contains(originLocationCodeText)

      cy.get(`${specificSelector} ${destinationLocation}`).contains(destinationLocationText)
      cy.get(`${specificSelector} ${destinationLocationCode}`).contains(destinationLocationCodeText)
      break
  }

  cy.get(`${specificSelector} ${laneHeader}`).contains(laneHeaderText)
  cy.get(`${specificSelector} ${originHeader}`).should('have.text', 'ORIGIN')
  cy.get(`${specificSelector} ${originLocationCountry}`).should('have.text', originLocationCountryText)
  cy.get(`${specificSelector} ${destinationHeader}`).should('have.text', 'DESTINATION')
  cy.get(`${specificSelector} ${destinationLocationCountry}`).should('have.text', destinationLocationCountryText)
  cy.get(`${specificSelector} ${perMonthHeader}`).should('have.text', 'PER MONTH')
  cy.get(`${specificSelector} ${volume}`).contains(volumeText)
})

Cypress.Commands.add('checkLaneLogisticsBrokerage', (type, laneId,
  {
    laneHeaderText,
    volumeText,
  }) => {
  switch (type) {
    case 'logistics':
      cy.get(logisticsIcon).should('be.visible')
        .should('be.visible')
        .should('have.css', 'color')
        .and('eq', 'rgb(52, 168, 232)')
      // .and('eq', 'rgb(41, 197, 163)')
      break

    case 'brokerage':
      cy.get(brokerageIcon).should('be.visible')
        .should('be.visible')
        .should('have.css', 'color')
        .and('eq', 'rgb(52, 168, 232)')
      // .and('eq', 'rgb(14, 130, 194)')
      break
  }

  const specificSelector = newLaneSelector(laneId)

  cy.get(`${specificSelector} ${laneHeader}`).contains(laneHeaderText)
  cy.get(`${specificSelector} ${perMonthHeader}`).should('have.text', 'PER MONTH')
  cy.get(`${specificSelector} ${volume}`).contains(volumeText)
})


Cypress.Commands.add('addLane', (newLaneInfo) => {
  cy.intercept({
    method: 'POST',
    url: '/api/lane/SaveLane/',
  }).as('newLane')
  cy.fillForm(laneForm, newLaneInfo)
  cy.get(saveLane).then(($button) => {
    if ($button.length > 0) {
      cy.wrap($button).click();
      cy.wait('@newLane');
    }else{
      getIframeBody().then($body => {
          const videoPopupCloseBtn = '[aria-label="Close"]';
          cy.wrap($body)
            .find(videoPopupCloseBtn)
            .then($button => {
              if ($button.length > 0) {
                cy.wrap($button).click();
              }
            });
        });
        cy.get(saveLane)
    .click()
  cy.wait('@newLane')
    } });
})

Cypress.Commands.add('navigteToLaneTab', (lane) => {
  const laneNavigation = (selector, laneName) => {
    cy.get(selector)
      .contains(laneName)
      .click()

    cy.get(selector)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(30, 146, 210)')
  }

  switch (lane) {
    case 'air':
      laneNavigation(airLaneTab, 'Air')
      break

    case 'sea':
      laneNavigation(seaLaneTab, 'Sea')
      break

    case 'road':
      laneNavigation(roadLaneTab, 'Road')
      break

    case 'rail':
      laneNavigation(railLaneTab, 'Rail')
      break

    case 'logistics':
      laneNavigation(logisticsLaneTab, 'Logistics')
      break

    case 'brokerage':
      laneNavigation(brokerageLaneTab, 'Brokerage')
      break
  }
})

Cypress.Commands.add('toggleCurrencyAndUpdatePrefixes', (laneFormCurrency, newForm) => {
  cy.fillForm(laneFormCurrency, newForm)

  cy.get(revenuePrefix).should('have.text', '€')
  cy.get(profitPrefix).should('have.text', '€')
  cy.get(textCurrencyPrefix).should('have.text', '€')
})

const getIframeDocument = () => {
  return cy
        .get('iframe#frm_popup')
        .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  // get the document
  return getIframeDocument()
    .its('body')
    .should('not.be.undefined')
    .then($body => {
      if ($body.length > 0) {
        return cy.wrap($body);
      } else {
        throw new Error('Iframe body not found.');
      }
    });
};

Cypress.Commands.add('profitDropdown', (value) => {
  cy.get(laneProfitType).next('span').then(($span) => {
    cy.wrap($span).click();
  });
  cy.get('li').contains(value).click()
})

Cypress.Commands.add('laneValidationChecker', (laneType) => {
  const colourCheckerForValidation = (type) => {
    cy.get(type)
      .should('have.text', 'Required')
      .should('have.css', 'color')
      .and('eq', 'rgb(205, 43, 30)')
  }

  const borderHighlightedRed = (type) => {
    cy.get(type)
      .should('be.visible')
      .should('have.css', 'border-color')
      .and('eq', 'rgb(205, 43, 30)')
  }
  cy.get(saveLane).click()

  // volume
  borderHighlightedRed(volumeInputError)
  colourCheckerForValidation(volumeRequired)

  // revenue
  borderHighlightedRed(revenueInputError)
  colourCheckerForValidation(revenueRequired)

  // profit
  borderHighlightedRed(profitInputError)
  colourCheckerForValidation(profitRequired)

  if (laneType == 'air' || laneType == 'sea' || laneType == 'road' || laneType == 'rail') {
    cy.get(originShipper).clear()
    cy.get(saveLane).click()
    //origin shipper
    borderHighlightedRed(originShipperError)
    colourCheckerForValidation(originShipperRequired)

    //origin region
    borderHighlightedRed(originRegionError)
    colourCheckerForValidation(originRegionRequired)

    //destination consignee
    borderHighlightedRed(destinationConsigneeError)
    colourCheckerForValidation(destinationConsigneeRequired)

    //destination region
    borderHighlightedRed(destinationRegionError)
    colourCheckerForValidation(destinationRegionRequired)
  }

})

Cypress.Commands.add('laneDefaultValues', ({ volume, profit, prefix }) => {
  cy.get(volumeDropdown).contains(volume)
  cy.get(profitDropdown).contains(profit)
  cy.get(profitPrefix).contains(prefix)
})

Cypress.Commands.add('toggleNewVolume', (volumeMetricString) => {
  cy.get('#select2-ddlVolumeUnit-container')
    .click()
  cy.get('#select2-ddlVolumeUnit-results')
    .contains(volumeMetricString)
    .click()
})

Cypress.Commands.add('profitUpdateChecker', (laneMetricSelectors, newFormInputs, newRevenue) => {  
  cy.profitDropdown('Flat Rate');
  cy.fillForm(laneMetricSelectors, newFormInputs)
  cy.get(textCurrency).invoke('val').should('eq', newRevenue)
})

Cypress.Commands.add('prePopulatedShipper', (companyName) => {
  cy.get(originShipper).invoke('val').should('eq', companyName)
})

Cypress.Commands.add('deleteLaneAPI', (laneId, { subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'GET',
    url: `/api/lane/DeleteLane/?laneId=${laneId}&globalUserId=${globalUserId}&lanesubscriberId=${subscriberId}`,
  })
})

Cypress.Commands.add('editLane', (newLaneId, subscriberId) => {
  cy.intercept({
    method: 'GET',
    url: `/api/lane/GetLane/?laneId=${newLaneId}&subscriberId=${subscriberId}`,
  }).as('getLaneInfo')
  cy.get(`${newLaneSelector(newLaneId)} ${editLane}`)
    .click()
  cy.wait('@getLaneInfo')
  cy.wait(8000)
})

Cypress.Commands.add('deleteLane', (laneId) => {
  cy.get(deleteLane).click()
  cy.deleteModal('Delete Lane!', 'Are you sure you want to delete this lane?', 'delete')
  cy.loadingModel()
  cy.wait(3000)
  cy.get(newLaneSelector(laneId)).should('not.exist')
})

Cypress.Commands.add('addLaneAPI', (dealId, laneType,
  {
    currencyCode,
    profitUnit,
    profitPercent,
    profitAmount,
    revenue,
    volumeAmount,
    volumeUnit,
    shippingFrequency,
    originCompany,
    origenCountryCode,
    originRegion,
    originCode,
    originUnlocoCode,
    destinationCompany,
    destinationCountryCode,
    destinationRegion,
    destinationCode,
    destinationUnlocoCode,
    recieve3pl,
    requirements,
    serviceLocation,
    barcode,
    track,
    pickUpAtWarehouse,
    comment,
  },
  { subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'POST',
    url: '/api/lane/SaveLane/',
    body: {
      'Lane': {
        'CurrencyCode': currencyCode,
        'DestinationCountryCode': destinationCountryCode,
        'OriginCountryCode': origenCountryCode,
        'DestinationRegionName': destinationRegion,
        'OriginRegionName': originRegion,
        'ProfitPercent': profitPercent,
        'ProfitUnitOfMeasure': profitUnit,
        'Revenue': revenue,
        'DealId': dealId,
        'LaneId': 0,
        'Service': laneType,
        'Comments': comment,
        'ConsigneeCompany': destinationCompany,
        'ShipperCompany': originCompany,
        'ShippingFrequency': shippingFrequency,
        'SubscriberId': subscriberId,
        'UpdateUserId': userId,
        'VolumeAmount': volumeAmount,
        'VolumeUnit': volumeUnit,
        'ProfitAmount': profitAmount,
        'OriginIataCode': originCode,
        'OriginUnlocoCode': originUnlocoCode,
        'DestinationIataCode': destinationCode,
        'DestinationUnlocoCode': destinationUnlocoCode,
        'ReceiveFrom3PL': recieve3pl,
        'SpecialRequirements': requirements,
        'ServiceLocation': serviceLocation,
        'RequiresBarcode': barcode,
        'TrackAndTrace': track,
        'CustomerPickUpAtWarehouse': pickUpAtWarehouse,
      },
      'UpdatedGlobalUserId': globalUserId
    },
  })
})
