import { DEAL_DETAIL_URL } from '../../urls'
import { laneForm } from '../../forms'
import { stringGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('Air Lane', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    const newCompanyName = `Lane Testing Company ${stringGen(6)}`
    const newContactName = `Contact Lane Testing ${stringGen(5)}`
    const newDealNameForLane = `Deal Air Lane Testing ${stringGen(4)}`
    let newCompanyId
    let globalCompanyId
    let dealContactId
    let dealId

    before(() => {
        cy.APILogin('salesRep')

        const companyData = {
            companyName: newCompanyName,
            subscriberId,
            userId: salesRepUserId,
            globalUserId: salesRepGlobalUserId
        }
        cy.addCompanyAPI(companyData).then((response) => {
            newCompanyId = response.body.CompanyId
            globalCompanyId = response.body.GlobalCompanyId

            cy.addContactWithCompanyIDAPI(globalCompanyId, newContactName, userData).then((response) => {
                dealContactId = response.body.Contact.GlobalContactId
            })

            cy.addDeal(response.body.GlobalCompanyId, newCompanyName, dealContactId, newContactName, newDealNameForLane, 'Qualifying', userData).then((response) => {
                dealId = response.body
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(response.body))
            })
        })
    })

    after(() => {
        cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
        cy.removeContactAPI(dealContactId, userData)
        cy.deleteDealAPI(dealId, userData)
    })

    describe('Air Lane form testing', () => {
        before(() => {
            cy.navigateToLaneForm(newDealNameForLane)
            cy.navigteToLaneTab('air')

            const airLaneDefaults = {
                volume: 'Tonnes',
                profit: 'Percentage',
                prefix: '%',
            }

            cy.laneDefaultValues(airLaneDefaults)
        })

        after(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        })

        describe('validation testing', () => {

            it('Company is pre-enetered into origin shipper field', () => {
                cy.prePopulatedShipper(newCompanyName)
            })

            it('Valume, Revenue and Profit fields show correct validation messages for required', () => {
                cy.laneValidationChecker('air')
            })

            it('changing currency dropdown to European Euros changes the prefix for Revenue, Profit and Text Currency', () => {
                const newFormInputs = {
                    laneProfitType: 'Flat Rate',
                    laneCurrency: 'European Euros',
                }

                cy.toggleCurrencyAndUpdatePrefixes(laneForm, newFormInputs)
            })

            it('Profit must not be more than revenue', () => {
                const newFormInputs = {
                    laneVolume: '2000',
                    laneRevenue: '500',
                    laneProfit: '20',
                    laneProfitType: 'Per KG',
                }

                cy.fillForm(laneForm, newFormInputs)
                cy.profitValidationChecker()
            })
        })

        describe('Profit updates with different inputs', () => {
            before(() => {
                const newFormInputs = {
                    laneVolume: '2',
                    laneRevenue: '500',
                    laneProfit: '50',
                }

                cy.wait(2000)
                cy.fillForm(laneForm, newFormInputs)
            })

            it('Profit Update - Volume: Tonnes - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Tonnes',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '250')
            })

            it('Profit Update - Volume: Tonnes - Profit: Flat Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Tonnes',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '50')
            })

            it('Profit Update - Volume: Tonnes - Profit: Per KG', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Tonnes',
                    laneProfitType: 'Per KG',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '100,000')
            })

            it('Profit Update - Volume: KGs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '250')
            })

            it('Profit Update - Volume: KGs - Profit: Flat Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '50')
            })

            it('Profit Update - Volume: KGs - Profit: Per KG', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Per KG',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '100')
            })
        })
    })

    describe('Air Lane functionality', () => {
        let newLaneId

        before(() => {
            cy.intercept({
                method: 'POST',
                url: '/api/lane/SaveLane/',
            }).as('newLane')
        })

        context('Adding Air Lanes', () => {
            beforeEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                const airLaneDefaults = {
                    volume: 'Tonnes',
                    profit: 'Percentage',
                    prefix: '%',
                }

                cy.navigateToLaneForm(newDealNameForLane)
                cy.navigteToLaneTab('air')
                cy.laneDefaultValues(airLaneDefaults)
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Add Air Lane - No Origin/Destination', () => {
                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Air',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} Tonnes | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $2,500`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('air', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Air Lane - With Origin/Destination', () => {
                const newLaneForm = {
                    laneVolume: '500',
                    laneRevenue: '6000',
                    laneProfit: '10',
                    laneShipperName: 'ShipperNameTest',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneOriginCountry: 'China',
                    laneOriginLocation: 'AAT - Altay Air Base',
                    laneOriginLocationSearch: 'AAT',
                    laneConsigneeName: 'ConsigneeNameTest',
                    laneDestinationRegion: 'The Americas',
                    laneDestinationCountry: 'United States',
                    laneDestinationLocation: 'AAF - Apalachicola Regional Airport',
                    laneDestinationLocationSearch: 'AAF',
                }

                const newLaneData = {
                    laneHeaderText: 'Air',
                    originLocationText: 'Altay Air Base',
                    originLocationCodeText: 'AAT',
                    originLocationCountryText: 'China',
                    destinationLocationText: 'Apalachicola Regional Airport',
                    destinationLocationCodeText: 'AAF',
                    destinationLocationCountryText: 'United States',
                    volumeText: `${newLaneForm.laneVolume} Tonnes | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $600`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('air', newLaneId, 'data', newLaneData)
                })
            })

            it('Add Air Lane - European Euro', () => {
                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneCurrency: 'European Euros',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Air',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} Tonnes | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €2,500`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('air', newLaneId, 'empty', newLaneData)
                })
            })
        })

        context('editing', () => {
            const newLane = {
                currencyCode: 'THB',
                profitUnit: 'Per KG',
                profitPercent: 90,
                profitAmount: 90,
                revenue: 1000,
                volumeAmount: 9000,
                volumeUnit: 'KGs',
                shippingFrequency: 'Per Month',
                originCompany: newCompanyName,
                origenCountryCode: 'TH',
                originRegion: 'South East Asia',
                originCode: 'BAO|TH|Thailand',
                originUnlocoCode: '',
                destinationCompany: 'Google',
                destinationCountryCode: 'US',
                destinationRegion: 'The Americas',
                destinationCode: 'SFO|US|United States',
                destinationUnlocoCode: '',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'Google Woooohoooo',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Air', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Selecting Edit displays all data on overview and form', () => {
                const newLaneData = {
                    laneHeaderText: 'Air',
                    originLocationText: 'Udorn Air Base',
                    originLocationCodeText: 'BAO',
                    originLocationCountryText: 'Thailand',
                    destinationLocationText: 'San Francisco International Airport',
                    destinationLocationCodeText: 'SFO',
                    destinationLocationCountryText: 'United States',
                    volumeText: `${newLane.volumeAmount} KGs | Revenue: THB${numberWithCommas(newLane.revenue)} | Profit: THB810,000`,
                }

                const newLaneFormData = {
                    currencyPrefix: 'THB',
                    currencyCode: 'Thai Bahts',
                    volumeText: '9000',
                    volumeUnit: 'KGs',
                    revenueText: '1000',
                    profitText: '90',
                    profitUnit: 'Per KG',
                    calculatedRevenue: '810,000',
                    originCompanyName: newCompanyName,
                    originRegionText: 'South East Asia',
                    originCountryText: 'Thailand',
                    originLocationText: 'BAO - Udorn Air Base',
                    destinationCompanyName: 'Google',
                    destinationRegionText: 'The Americas',
                    destinationCountryText: 'United States',
                    destinationLocationText: 'SFO - San Francisco International Airport',
                    content3pl: '',
                    serviceLocationValue: '',
                    specialRequirementsValue: '',
                    barcodeChecked: false,
                    trackAndTraceChecked: false,
                    pickUpChecked: false,
                    laneCommentText: 'Google Woooohoooo',
                }

                cy.checkLaneAirSeaRoad('air', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.laneFormChecker('air', newLaneFormData)
            })

            it('I must be able to edit and changes save', () => {
                const newAirLaneInputs = {
                    laneCurrency: 'British Pounds',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneOriginCountry: 'China',
                    laneOriginLocation: 'PEK - Beijing Capital International Airport',
                    laneOriginLocationSearch: 'PEK',
                    laneDestinationRegion: 'Europe, Middle East & Africa',
                    laneDestinationCountry: 'Netherlands',
                    laneDestinationLocation: 'AMS - Amsterdam Airport Schiphol',
                    laneDestinationLocationSearch: 'AMS',
                }
                const newLaneForm = {
                    laneVolume: '2000',
                    laneRevenue: '88000',
                    laneProfit: '20',
                    laneShipperName: 'Edited Shipper',
                    laneConsigneeName: 'Destination Edit',
                    comment: 'This is a new comment!',
                }

                const newLaneData = {
                    laneHeaderText: 'Air',
                    originLocationText: 'Beijing Capital International Airport',
                    originLocationCodeText: 'PEK',
                    originLocationCountryText: 'China',
                    destinationLocationText: 'Amsterdam Airport Schiphol',
                    destinationLocationCodeText: 'AMS',
                    destinationLocationCountryText: 'Netherlands',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: £${numberWithCommas(newLaneForm.laneRevenue)} | Profit: £40,000`,
                }

                cy.fillForm(laneForm, newAirLaneInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    cy.checkLaneAirSeaRoad('air', newLaneId, 'data', newLaneData)
                })
            })
        })


        context('remove', () => {
            const newLane = {
                currencyCode: 'BTC',
                profitUnit: 'Percentage',
                profitPercent: 77,
                profitAmount: 90,
                revenue: 88,
                volumeAmount: 99,
                volumeUnit: 'Tonnes',
                shippingFrequency: 'Per Month',
                originCompany: newCompanyName,
                origenCountryCode: 'HN',
                originRegion: 'The Americas',
                originCode: 'RUY|HN|Honduras',
                originUnlocoCode: '',
                destinationCompany: 'London History Museum',
                destinationCountryCode: 'UK',
                destinationRegion: 'Europe, Middle East & Africa',
                destinationCode: 'LHR|UK|United Kingdom',
                destinationUnlocoCode: '',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'Ruins',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Air', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            it('I must be able to remove a Air lane', () => {
                const newLaneData = {
                    laneHeaderText: 'Air',
                    originLocationText: 'Copán Ruinas Airport',
                    originLocationCodeText: 'RUY',
                    originLocationCountryText: 'Honduras',
                    destinationLocationText: 'London Heathrow Airport',
                    destinationLocationCodeText: 'LHR',
                    destinationLocationCountryText: 'United Kingdom',
                    volumeText: `${newLane.volumeAmount} Tonnes | Revenue: BTC${newLane.revenue} | Profit: BTC68`,
                }

                cy.checkLaneAirSeaRoad('air', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.deleteLane(newLaneId)
            })
        })
    })
})