import { DEAL_DETAIL_URL } from '../../urls'
import { laneForm } from '../../forms'
import { stringGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('Logistics Lane', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    const newCompanyName = `Lane Testing Company ${stringGen(6)}`
    const newContactName = `Contact Lane Testing ${stringGen(5)}`
    const newDealNameForLane = `Deal Logistics Lane Testing ${stringGen(4)}`
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

    describe('Logistics lane form testing', () => {
        before(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            cy.navigateToLaneForm(newDealNameForLane)
            cy.navigteToLaneTab('logistics')

            const logisticsLaneDefaults = {
                volume: 'KGs',
                profit: 'Per KG',
                prefix: '$',
            }

            cy.laneDefaultValues(logisticsLaneDefaults)
        })

        after(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        })

        describe('validation testing', () => {
            it('Valume, Revenue and Profit fields show correct validation messages for required', () => {
                cy.laneValidationChecker('logistics')
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
                    laneVolume: '6000',
                    laneRevenue: '100',
                    laneProfit: '10',
                }

                cy.wait(2000)
                cy.fillForm(laneForm, newFormInputs)
            })

            it('Profit Update - Volume: KGs - Profit: Per KG', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Per KG',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '60,000')
            })

            it('Profit Update - Volume: KGs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: KGs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'KGs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: CBMs - Profit: Per CBM', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'CBMs',
                    laneProfitType: 'Per CBM',
                }
                cy.toggleNewVolume('CBMs')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '60,000')
            })

            it('Profit Update - Volume: CBMs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'CBMs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: CBMs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'CBMs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: LBs - Profit: Per LB', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'LBs',
                    laneProfitType: 'Per LB',
                }

                cy.toggleNewVolume('LBs')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '60,000')
            })

            it('Profit Update - Volume: LBs - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'LBs',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: LBs - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'LBs',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: SQM - Profit: Per SQM', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'SQM',
                    laneProfitType: 'Per SQM',
                }

                cy.toggleNewVolume('SQM')
                cy.wait(2000)
                cy.profitUpdateChecker(laneForm, newDropdownValue, '60,000')
            })

            it('Profit Update - Volume: SQM - Profit: Percentage', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'SQM',
                    laneProfitType: 'Percentage',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })

            it('Profit Update - Volume: SQM - Profit: Flate Rate', () => {
                const newDropdownValue = {
                    laneVolumeUnit: 'SQM',
                    laneProfitType: 'Flat Rate',
                }

                cy.profitUpdateChecker(laneForm, newDropdownValue, '10')
            })
        })
    })

    describe('Logistics Lane functionality', () => {
        let newLaneId
        before(() => {
            cy.intercept({
                method: 'POST',
                url: '/api/lane/SaveLane/',
            }).as('newLane')
        })

        context('Adding Logistics Lanes', () => {
            beforeEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                const logisticsLaneDefaults = {
                    volume: 'KGs',
                    profit: 'Per KG',
                    prefix: '$',
                }

                cy.navigateToLaneForm(newDealNameForLane)
                cy.navigteToLaneTab('logistics')
                cy.laneDefaultValues(logisticsLaneDefaults)
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            afterEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            })

            it('Add Logistics Lane - Only required', () => {
                const newLaneForm = {
                    laneVolume: '800',
                    laneRevenue: '9000',
                    laneProfit: '10',
                }

                const newLaneData = {
                    laneHeaderText: 'Logistics',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $8,000`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneLogisticsBrokerage('logistics', newLaneId, newLaneData)
                })
            })

            it('Add Logistics Lane - All info', () => {
                const newLaneForm = {
                    laneVolume: '800',
                    laneRevenue: '5000',
                    laneProfit: '5',
                    laneRecieveFrom3PL: 'Storage',
                    laneServiceLocation: 'London',
                    laneSpecialRequirements: 'Temperature',
                    laneBarcode: true,
                    laneTrackAndTrace: true,
                    lanePickUp: true,
                    comment: 'TEST COMMENT',
                }

                const newLaneData = {
                    laneHeaderText: 'Logistics',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $4,000`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneLogisticsBrokerage('logistics', newLaneId, newLaneData)
                })
            })

            it('Add Logistics Lane - European Euro', () => {
                const laneFormInputs = {
                    laneCurrency: 'European Euros',
                }

                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '9200',
                    laneProfit: '81',
                }

                const newLaneData = {
                    laneHeaderText: 'Logistics',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €8,100`,
                }

                cy.fillForm(laneForm, laneFormInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneLogisticsBrokerage('logistics', newLaneId, newLaneData)
                })
            })
        })

        context('editing', () => {
            const newLane = {
                currencyCode: 'GTQ',
                profitUnit: 'Per KG',
                profitPercent: 555,
                profitAmount: 555,
                revenue: 200,
                volumeAmount: 400,
                volumeUnit: 'KGs',
                shippingFrequency: 'Per Month',
                originCompany: '',
                origenCountryCode: '',
                originRegion: '',
                originCode: '',
                destinationCompany: '',
                destinationCountryCode: '',
                destinationRegion: '',
                destinationCode: '',
                recieve3pl: 'Kitting',
                requirements: 'Temperature',
                serviceLocation: '7144',
                barcode: true,
                track: true,
                pickUpAtWarehouse: true,
                comment: 'Logistically easy',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Logistics', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Selecting Edit displays all data on overview and form', () => {
                const newLaneData = {
                    laneHeaderText: 'Logistics',
                    volumeText: `${newLane.volumeAmount} KGs | Revenue: Q${numberWithCommas(newLane.revenue)} | Profit: Q222,000`,
                }

                const newLaneFormData = {
                    currencyPrefix: 'Q',
                    currencyCode: 'Guatemalan Quetzals',
                    volumeText: '400',
                    volumeUnit: 'KGs',
                    revenueText: '200',
                    profitText: '555',
                    profitUnit: 'Per KG',
                    calculatedRevenue: '222,000',
                    originCompanyName: '',
                    originRegionText: '',
                    originCountryText: '',
                    originLocationText: '',
                    destinationCompanyName: '',
                    destinationRegionText: '',
                    destinationCountryText: '',
                    destinationLocationText: '',
                    content3pl: 'Kitting',
                    serviceLocationValue: 'Edinburgh',
                    specialRequirementsValue: 'Temperature',
                    barcodeChecked: true,
                    trackAndTraceChecked: true,
                    pickUpChecked: true,
                    laneCommentText: 'Logistically easy',
                }

                cy.checkLaneLogisticsBrokerage('logistics', newLaneId, newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.wait(6000)
                cy.laneFormChecker('logistics', newLaneFormData)
            })

            it('I must be able to edit and changes save', () => {
                const newLaneFormDropdowns = {
                    laneRecieveFrom3PL: 'Storage',
                    laneServiceLocation: 'Manchester',
                    laneSpecialRequirements: 'HAACP',
                }
                const newLaneForm = {
                    laneVolume: '1000',
                    laneRevenue: '50000',
                    laneProfit: '5',
                    laneBarcode: false,
                    laneTrackAndTrace: false,
                    lanePickUp: false,
                    comment: 'TEST COMMENT',
                }

                const newLaneData = {
                    laneHeaderText: 'Logistics',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: Q${numberWithCommas(newLaneForm.laneRevenue)} | Profit: Q5,000`,
                }

                cy.fillForm(laneForm, newLaneFormDropdowns)
                cy.addLane(newLaneForm).then((xhr) => {
                    cy.checkLaneLogisticsBrokerage('logistics', newLaneId, newLaneData)
                })
            })
        })


        context('remove', () => {
            const newLane = {
                currencyCode: 'CAD',
                profitUnit: 'Per KG',
                profitPercent: 12,
                profitAmount: 12,
                revenue: 1122,
                volumeAmount: 111,
                volumeUnit: 'KGs',
                shippingFrequency: 'Per Month',
                originCompany: '',
                origenCountryCode: '',
                originRegion: '',
                originCode: '',
                destinationCompany: '',
                destinationCountryCode: '',
                destinationRegion: '',
                destinationCode: '',
                recieve3pl: 'Cross Dock',
                requirements: 'Hazardous Goods',
                serviceLocation: '7145',
                barcode: true,
                track: false,
                pickUpAtWarehouse: true,
                comment: 'Logistic',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Logistics', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            it('I must be able to remove a Logistics lane', () => {
                const newLaneData = {
                    laneHeaderText: 'Logistics',
                    volumeText: `${newLane.volumeAmount} KGs | Revenue: $${numberWithCommas(newLane.revenue)} | Profit: $1,332`,
                }

                cy.checkLaneLogisticsBrokerage('logistics', newLaneId, newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.deleteLane(newLaneId)
            })
        })
    })
})