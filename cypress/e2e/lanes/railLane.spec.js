import { DEAL_DETAIL_URL } from '../../urls'
import { laneForm } from '../../forms'
import { stringGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('Rail Lane', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    const newCompanyName = `Lane Testing Company ${stringGen(6)}`
    const newContactName = `Contact Lane Testing ${stringGen(5)}`
    const newDealNameForLane = `Deal Rail Lane Testing ${stringGen(4)}`
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

    describe('Rail lane form testing', () => {
        before(() => {
            cy.navigateToLaneForm(newDealNameForLane)
            cy.navigteToLaneTab('rail')

            const railLaneDefaults = {
                volume: 'TEUs',
                profit: 'Percentage',
                prefix: '%',
            }

            cy.laneDefaultValues(railLaneDefaults)
        })

        after(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        })

        describe('validation testing', () => {
            it('Company is pre-enetered into origin shipper field', () => {
                cy.prePopulatedShipper(newCompanyName)
            })

            it('Valume, Revenue and Profit fields show correct validation messages for required', () => {
                cy.laneValidationChecker('rail')
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
                    laneProfitType: 'Per TEU',
                }

                cy.fillForm(laneForm, newFormInputs)
                cy.profitValidationChecker()
            })
        })

        describe('Profit updates with different inputs', () => {
            describe('FCL profit calculations', () => {
                before(() => {
                    const newFormInputs = {
                        laneVolume: '2567',
                        laneRevenue: '188',
                        laneProfit: '55',
                    }

                    cy.wait(2000)
                    cy.fillForm(laneForm, newFormInputs)
                })

                it('FCL - Profit Update - Volume: TEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '103')
                })

                it('FCL - Profit Update - Volume: TEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '55')
                })

                it('FCL - Profit Update - Volume: TEUs - Profit: Per TEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Per TEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '141,185')
                })

                it('FCL Profit Update - Volume: FEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.toggleNewVolume('FEUs')
                    cy.wait(2000)
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '103')
                })

                it('FCL Profit Update - Volume: FEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '55')
                })

                it('FCL Profit Update - Volume: FEUs - Profit: Per FEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Per FEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '141,185')
                })
            })

            describe('LCL profit calculations', () => {

                before(() => {
                    const newFormInputs = {
                        laneRailLoadType: 'LCL',
                        laneVolume: '555561',
                        laneRevenue: '565',
                        laneProfit: '88',
                    }

                    cy.fillForm(laneForm, newFormInputs)
                })

                it('LCL - Profit Update - Volume: CBMs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '497')
                })

                it('LCL - Profit Update - Volume: CBMs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '88')
                })

                it('LCL - Profit Update - Volume: CBMs - Profit: Per CBM', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Per CBM',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '48,889,368')
                })
            })
        })
    })

    describe('Rail Lane functionality', () => {
        let newLaneId
        before(() => {
            cy.intercept({
                method: 'POST',
                url: '/api/lane/SaveLane/',
            }).as('newLane')
        })

        context('Adding Rail Lanes', () => {
            beforeEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                const railLaneDefaults = {
                    volume: 'TEUs',
                    profit: 'Percentage',
                    prefix: '%',
                }

                cy.navigateToLaneForm(newDealNameForLane)
                cy.navigteToLaneTab('rail')
                cy.laneDefaultValues(railLaneDefaults)
            })

            afterEach(() => {
                cy.deleteLaneAPI(newLaneId, userData)
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            })

            it('Add Rail Lane - No Origin/Destination - FCL Load', () => {
                const newLaneForm = {
                    laneVolume: '444',
                    laneRevenue: '4333',
                    laneProfit: '4',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Rail FCL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $173`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('rail', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Rail Lane - With Origin/Destination  - FCL Load', () => {
                const laneFormInputs = {
                    laneVolume: '300',
                    laneRevenue: '3000',
                    laneProfit: '15',
                    laneOriginRegion: 'Europe, Middle East & Africa',
                    laneOriginCountry: 'Germany',
                    laneOriginLocation: 'RAD - Radolfzell',
                    laneOriginLocationSearch: 'RAD',
                    laneConsigneeName: 'Xbox',
                    laneDestinationRegion: 'South East Asia',
                    laneDestinationCountry: 'India',
                    laneDestinationLocation: 'BSR - Bulsar',
                    laneDestinationLocationSearch: 'BSR',
                }

                const newLaneData = {
                    laneHeaderText: 'Rail FCL',
                    originLocationText: 'Radolfzell',
                    originLocationCodeText: 'RAD',
                    originLocationCountryText: 'Germany',
                    destinationLocationText: 'Bulsar',
                    destinationLocationCodeText: 'BSR',
                    destinationLocationCountryText: 'India',
                    volumeText: `${laneFormInputs.laneVolume} TEUs | Revenue: $${numberWithCommas(laneFormInputs.laneRevenue)} | Profit: $450`,
                }

                cy.addLane(laneFormInputs).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('rail', newLaneId, 'data', newLaneData)
                })
            })

            it('Add Rail Lane - European Euro - FCL Load', () => {
                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '10000',
                    laneProfit: '50',
                    laneCurrency: 'European Euros',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Rail FCL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €5,000`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('rail', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Rail Lane - LCL Load', () => {
                const newLaneForm = {
                    laneRailLoadType: 'LCL',
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Rail LCL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} CBMs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $2,500`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('rail', newLaneId, 'empty', newLaneData)
                })
            })
        })

        context('editing', () => {
            const newLane = {
                currencyCode: 'HKD',
                profitUnit: 'Per FEU',
                profitPercent: '20',
                profitAmount: 20,
                revenue: 4000000,
                volumeAmount: 50000,
                volumeUnit: 'FEUs',
                shippingFrequency: 'Per Month',
                originCompany: newCompanyName,
                origenCountryCode: 'HK',
                originRegion: 'East Asia & Oceania',
                originCode: '',
                originUnlocoCode: 'KWN|HK|Hong Kong',
                destinationCompany: 'Nikon',
                destinationCountryCode: 'JP',
                destinationRegion: 'East Asia & Oceania',
                destinationCode: '',
                destinationUnlocoCode: 'TYO|JP|Japan',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'New camera lenses',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Rail FCL', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Selecting Edit displays all data on overview and form', () => {
                const newLaneData = {
                    laneHeaderText: 'Rail FCL',
                    originLocationText: 'Kowloon',
                    originLocationCodeText: 'KWN',
                    originLocationCountryText: 'Hong Kong',
                    destinationLocationText: 'Tokyo',
                    destinationLocationCodeText: 'TYO',
                    destinationLocationCountryText: 'Japan',
                    volumeText: `${newLane.volumeAmount} FEUs | Revenue: HK$${numberWithCommas(newLane.revenue)} | Profit: HK$1,000,000`,
                }

                const newLaneFormData = {
                    currencyPrefix: 'HK$',
                    currencyCode: 'Hong Kong Dollars',
                    volumeText: '50000',
                    volumeUnit: 'FEUs',
                    revenueText: '4000000',
                    profitText: '20',
                    profitUnit: 'Per FEU',
                    calculatedRevenue: '1,000,000',
                    originCompanyName: newCompanyName,
                    originRegionText: 'East Asia & Oceania',
                    originCountryText: 'Hong Kong',
                    originLocationText: 'KWN - Kowloon',
                    destinationCompanyName: 'Nikon',
                    destinationRegionText: 'East Asia & Oceania',
                    destinationCountryText: 'Japan',
                    destinationLocationText: 'TYO - Tokyo',
                    content3pl: '',
                    serviceLocationValue: '',
                    specialRequirementsValue: '',
                    barcodeChecked: false,
                    trackAndTraceChecked: false,
                    pickUpChecked: false,
                    laneCommentText: 'New camera lenses',
                }

                cy.checkLaneAirSeaRoad('rail', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.wait(5000)
                cy.laneFormChecker('rail', newLaneFormData)
            })

            it('I must be able to edit and changes save', () => {
                const newLaneForm = {
                    laneVolume: '500',
                    laneRevenue: '6000000',
                    laneProfit: '10',
                    laneShipperName: 'Edited Shipper',
                    laneConsigneeName: 'Now Manchester City shirts',
                    laneCurrency: 'Chinese Yuan Renminbi',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneOriginCountry: 'China',
                    laneOriginLocation: 'SHG - Shanghai Pt',
                    laneOriginLocationSearch: 'SHG',
                    laneDestinationRegion: 'Europe, Middle East & Africa',
                    laneDestinationCountry: 'United Kingdom',
                    laneDestinationLocation: 'MNC - Manchester',
                    laneDestinationLocationSearch: 'MNC',
                    comment: 'Pep is a fraud',
                }

                const newLaneData = {
                    laneHeaderText: 'Rail FCL',
                    originLocationText: 'Shanghai Pt',
                    originLocationCodeText: 'SHG',
                    originLocationCountryText: 'China',
                    destinationLocationText: 'Manchester',
                    destinationLocationCodeText: 'MNC',
                    destinationLocationCountryText: 'United Kingdom',
                    volumeText: `${newLaneForm.laneVolume} FEUs | Revenue: ¥${numberWithCommas(newLaneForm.laneRevenue)} | Profit: ¥5,000`,
                }

                cy.wait(8000)
                cy.addLane(newLaneForm).then((xhr) => {
                    cy.checkLaneAirSeaRoad('rail', newLaneId, 'data', newLaneData)
                })
            })
        })


        context('remove', () => {
            const newLane = {
                currencyCode: 'INR',
                profitUnit: 'Per CBM',
                profitPercent: 20,
                profitAmount: 20,
                revenue: 5000,
                volumeAmount: 50020,
                volumeUnit: 'CBMs',
                shippingFrequency: 'Per Month',
                originCompany: newCompanyName,
                origenCountryCode: 'IN',
                originRegion: 'East Asia & Oceania',
                originCode: '',
                originUnlocoCode: 'BOM|IN|India',
                destinationCompany: 'Masala Sauce',
                destinationCountryCode: 'FR',
                destinationRegion: 'Europe, Middle East & Africa',
                destinationCode: '',
                destinationUnlocoCode: 'PAR|FR|France',
                recieve3pl: '',
                requirements: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'New yummy sauce',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Rail LCL', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            it('I must be able to remove a Rail lane', () => {
                const newLaneData = {
                    laneHeaderText: 'Rail LCL',
                    originLocationText: 'Mumbai (ex Bombay)',
                    originLocationCodeText: 'BOM',
                    originLocationCountryText: 'India',
                    destinationLocationText: 'Paris',
                    destinationLocationCodeText: 'PAR',
                    destinationLocationCountryText: 'France',
                    volumeText: `${newLane.volumeAmount} CBMs | Revenue: INR${numberWithCommas(newLane.revenue)} | Profit: INR1,000,400`,
                }

                cy.checkLaneAirSeaRoad('rail', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.deleteLane(newLaneId)
            })
        })
    })
})