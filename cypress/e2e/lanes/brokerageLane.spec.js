import { DEAL_DETAIL_URL } from '../../urls'
import { laneForm } from '../../forms'
import { stringGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('Brokerage Lane', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    const newCompanyName = `Lane Testing Company ${stringGen(6)}`
    const newContactName = `Contact Lane Testing ${stringGen(5)}`
    const newDealNameForLane = `Deal Brokerage Lane Testing ${stringGen(4)}`
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
    describe('Brokerage lane form testing', () => {
        before(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            cy.navigateToLaneForm(newDealNameForLane)
            cy.navigteToLaneTab('brokerage')

            const brokerageLaneDefaults = {
                volume: 'KGs',
                profit: 'Per KG',
                prefix: '$',
            }

            cy.laneDefaultValues(brokerageLaneDefaults)
        })

        after(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        })

        describe('validation testing', () => {
            it('Valume, Revenue and Profit fields show correct validation messages for required', () => {
                cy.laneValidationChecker('brokerage')
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
                    laneVolume: '99000',
                    laneRevenue: '19500',
                    laneProfit: '80',
                }

                cy.wait(2000)
                cy.fillForm(laneForm, newFormInputs)
            })

            it('Profit Update - Volume: KGs - Profit: Per KG', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Per KG',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '7,920,000')
            })

            it('Profit Update - Volume: KGs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '15,600')
            })

            it('Profit Update - Volume: KGs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '80')
            })

            it('Profit Update - Volume: LBs - Profit: Per LB', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'LBs',
                    laneProfitType: 'Per LB',
                }

                cy.toggleNewVolume('LBs')
                cy.wait(5000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '7,920,000')
            })

            it('Profit Update - Volume: LBs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'LBs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '15,600')
            })

            it('Profit Update - Volume: LBs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'LBs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '80')
            })

            it('Profit Update - Volume: TEUs - Profit: Per TEU', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'TEUs',
                    laneProfitType: 'Per TEU',
                }

                cy.toggleNewVolume('TEUs')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '7,920,000')
            })

            it('Profit Update - Volume: TEUs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'TEUs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '15,600')
            })

            it('Profit Update - Volume: TEUs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'TEUs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '80')
            })

            it('Profit Update - Volume: FEUs - Profit: Per FEU', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'FEUs',
                    laneProfitType: 'Per FEU',
                }

                cy.toggleNewVolume('FEUs')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '7,920,000')
            })

            it('Profit Update - Volume: FEUs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'FEUs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '15,600')
            })

            it('Profit Update - Volume: FEUs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'FEUs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '80')
            })

            it('Profit Update - Volume: Declarations - Profit: Per Declaration', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Declarations',
                    laneProfitType: 'Per Declaration',
                }

                cy.toggleNewVolume('Declarations')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '7,920,000')
            })

            it('Profit Update - Volume: Declarations - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Declarations',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '15,600')
            })

            it('Profit Update - Volume: Declarations - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Declarations',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '80')
            })

            it('Profit Update - Volume: Shipments - Profit: Per Shipment', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Shipments',
                    laneProfitType: 'Per Shipment',
                }

                cy.toggleNewVolume('Shipments')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '7,920,000')
            })


            it('Profit Update - Volume: Shipments - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Shipments',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '15,600')
            })

            it('Profit Update - Volume: Shipments - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'Shipments',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '80')
            })
        })
    })

    describe('Brokerage Lane functionality', () => {
        let newLaneId
        before(() => {
            cy.intercept({
                method: 'POST',
                url: '/api/lane/SaveLane/',
            }).as('newLane')
        })

        context('Adding Brokerage Lanes', () => {
            beforeEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                const brokerageLaneDefaults = {
                    volume: 'KGs',
                    profit: 'Per KG',
                    prefix: '$',
                }

                cy.navigateToLaneForm(newDealNameForLane)
                cy.navigteToLaneTab('brokerage')
                cy.laneDefaultValues(brokerageLaneDefaults)
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            afterEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            })

            it('Add Brokerage Lane - Only required', () => {
                const newLaneForm = {
                    laneVolume: '5000',
                    laneRevenue: '80000',
                    laneProfit: '10',
                }

                const newLaneData = {
                    laneHeaderText: 'Brokerage',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $50,000`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneLogisticsBrokerage('brokerage', newLaneId, newLaneData)
                })
            })

            it('Add Brokerage Lane - All info', () => {
                const newLaneForm = {
                    laneVolume: '800',
                    laneRevenue: '5000',
                    laneProfit: '5',
                    comment: 'TEST COMMENT',
                }

                const newLaneData = {
                    laneHeaderText: 'Brokerage',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $4,000`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneLogisticsBrokerage('brokerage', newLaneId, newLaneData)
                })
            })

            it('Add Brokerage Lane - European Euro', () => {
                const laneFormInputs = {
                    laneCurrency: 'European Euros',
                }

                const newLaneForm = {
                    laneVolume: '1000',
                    laneRevenue: '20000',
                    laneProfit: '3',
                }

                const newLaneData = {
                    laneHeaderText: 'Brokerage',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €3,000`,
                }

                cy.fillForm(laneForm, laneFormInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneLogisticsBrokerage('brokerage', newLaneId, newLaneData)
                })
            })
        })

        context('editing', () => {
            const newLane = {
                currencyCode: 'SGD',
                profitUnit: 'Per KG',
                profitPercent: 1000,
                profitAmount: 1000,
                revenue: 12345,
                volumeAmount: 400,
                volumeUnit: 'KGs',
                shippingFrequency: 'Spot',
                originCompany: '',
                origenCountryCode: '',
                originRegion: '',
                originCode: '',
                destinationCompany: '',
                destinationCountryCode: '',
                destinationRegion: '',
                destinationCode: '',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'Brokerage comment',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Brokerage', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Selecting Edit displays all data on overview and form', () => {
                const newLaneData = {
                    laneHeaderText: 'Brokerage',
                    volumeText: `${newLane.volumeAmount} KGs | Revenue: S$${numberWithCommas(newLane.revenue)} | Profit: S$400,000`,
                }

                const newLaneFormData = {
                    currencyPrefix: 'S$',
                    currencyCode: 'Singapore Dollars',
                    volumeText: '400',
                    volumeUnit: 'KGs',
                    revenueText: '12345',
                    profitText: '1000',
                    profitUnit: 'Per KG',
                    calculatedRevenue: '400,000',
                    originCompanyName: '',
                    originRegionText: '',
                    originCountryText: '',
                    originLocationText: '',
                    destinationCompanyName: '',
                    destinationRegionText: '',
                    destinationCountryText: '',
                    destinationLocationText: '',
                    content3pl: '',
                    serviceLocationValue: '',
                    specialRequirementsValue: '',
                    barcodeChecked: false,
                    trackAndTraceChecked: false,
                    pickUpChecked: false,
                    laneCommentText: 'Brokerage comment',
                }

                cy.checkLaneLogisticsBrokerage('brokerage', newLaneId, newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.laneFormChecker('', newLaneFormData)
            })

            it('I must be able to edit and changes save', () => {
                const laneFormInputs = {
                    laneCurrency: 'European Euros',
                }

                const newLaneForm = {
                    laneVolume: '1000',
                    laneRevenue: '60000',
                    laneProfit: '55',
                    comment: 'TEST COMMENT',
                }

                const newLaneData = {
                    laneHeaderText: 'Brokerage',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €55,000`,
                }

                cy.fillForm(laneForm, laneFormInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    cy.checkLaneLogisticsBrokerage('brokerage', newLaneId, newLaneData)
                })
            })
        })


        context('remove', () => {
            const newLane = {
                currencyCode: 'SGD',
                profitUnit: 'Per KG',
                profitPercent: 1000,
                profitAmount: 1000,
                revenue: 12345,
                volumeAmount: 400,
                volumeUnit: 'KGs',
                shippingFrequency: 'Per Shipment',
                originCompany: '',
                origenCountryCode: '',
                originRegion: '',
                originCode: '',
                destinationCompany: '',
                destinationCountryCode: '',
                destinationRegion: '',
                destinationCode: '',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'Brokerage comment',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Brokerage', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            it('I must be able to remove a Brokerage lane', () => {
                const newLaneData = {
                    laneHeaderText: 'Brokerage',
                    volumeText: `${newLane.volumeAmount} KGs | Revenue: S$${numberWithCommas(newLane.revenue)} | Profit: S$400,000`,
                }

                cy.checkLaneLogisticsBrokerage('brokerage', newLaneId, newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.deleteLane(newLaneId)
            })
        })
    })
})