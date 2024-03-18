import { DEAL_DETAIL_URL } from '../../urls'
import { laneForm } from '../../forms'
import { stringGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('Road Lane', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    const newCompanyName = `Lane Testing Company ${stringGen(6)}`
    const newContactName = `Contact Lane Testing ${stringGen(5)}`
    const newDealNameForLane = `Deal Road Lane Testing ${stringGen(4)}`
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

    describe('Road lane form testing', () => {
        before(() => {
            cy.navigateToLaneForm(newDealNameForLane)
            cy.navigteToLaneTab('road')

            const roadLaneDefaults = {
                volume: 'Trucks',
                profit: 'Per Truck',
                prefix: '$',
            }

            cy.laneDefaultValues(roadLaneDefaults)
        })

        after(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        })

        describe('validation testing', () => {
            it('Company is pre-enetered into origin shipper field', () => {
                cy.prePopulatedShipper(newCompanyName)
            })

            it('Valume, Revenue and Profit fields show correct validation messages for required', () => {
                cy.laneValidationChecker('road')
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
                    laneProfitType: 'Per Truck',
                }

                cy.fillForm(laneForm, newFormInputs)
                cy.profitValidationChecker()
            })
        })

        describe('Profit updates with different inputs', () => {
            describe('FTL profit calculations', () => {
                before(() => {
                    const newFormInputs = {
                        laneVolume: '20222',
                        laneRevenue: '2000',
                        laneProfit: '60',
                    }

                    cy.wait(2000)
                    cy.fillForm(laneForm, newFormInputs)
                })

                it('FTL - Profit Update - Volume: Trucks - Profit: Per Truck', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'Trucks',
                        laneProfitType: 'Per Truck',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '1,213,320')
                })

                it('FTL - Profit Update - Volume: Trucks - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'Trucks',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '1,200')
                })

                it('FTL - Profit Update - Volume: Trucks - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'Trucks',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '60')
                })
            })

            describe('LTL profit calculations', () => {

                before(() => {
                    const newFormInputs = {
                        laneRoadLoadType: 'LTL',
                        laneVolume: '666666',
                        laneRevenue: '44',
                        laneProfit: '11',
                    }

                    cy.fillForm(laneForm, newFormInputs)
                })

                it('LTL - Profit Update - Volume: KGs - Profit: Per KG', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'KGs',
                        laneProfitType: 'Per KG',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '7,333,326')
                })

                it('LTL - Profit Update - Volume: KGs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'KGs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '5')
                })

                it('LTL - Profit Update - Volume: KGs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'KGs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '11')
                })

                it('LTL - Profit Update - Volume: LBs - Profit: Per LB', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'LBs',
                        laneProfitType: 'Per LB',
                    }

                    cy.toggleNewVolume('LBs')
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '7,333,326')
                })

                it('LTL - Profit Update - Volume: LBs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'LBs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '5')
                })

                it('LTL - Profit Update - Volume: LBs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'LBs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '11')
                })
            })

            describe('Expedited profit calculations', () => {

                before(() => {
                    const newFormInputs = {
                        laneRoadLoadType: 'Expedited',
                        laneVolume: '4500',
                        laneRevenue: '100',
                        laneProfit: '91',
                    }

                    cy.fillForm(laneForm, newFormInputs)
                })

                it('Expedited - Profit Update - Volume: KGs - Profit: Per KG', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'KGs',
                        laneProfitType: 'Per KG',
                    }

                    cy.toggleNewVolume('KGs')
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '409,500')
                })

                it('Expedited - Profit Update - Volume: KGs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'KGs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '91')
                })

                it('Expedited - Profit Update - Volume: KGs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'KGs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '91')
                })

                it('Expedited - Profit Update - Volume: Trucks - Profit: Per Truck', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'Trucks',
                        laneProfitType: 'Per Truck',
                    }

                    cy.toggleNewVolume('Trucks')
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '409,500')
                })

                it('Expedited - Profit Update - Volume: Trucks - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'Trucks',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '91')
                })

                it('Expedited - Profit Update - Volume: Trucks - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'Trucks',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '91')
                })

                it('Expedited - Profit Update - Volume: LBs - Profit: Per LB', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'LBs',
                        laneProfitType: 'Per LB',
                    }

                    cy.toggleNewVolume('LBs')
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '409,500')
                })

                it('Expedited - Profit Update - Volume: LBs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'LBs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '91')
                })

                it('Expedited - Profit Update - Volume: LBs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'LBs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '91')
                })
            })
        })
    })

    describe('Road Lane functionality', () => {
        let newLaneId
        before(() => {
            cy.intercept({
                method: 'POST',
                url: '/api/lane/SaveLane/',
            }).as('newLane')
        })

        context('Adding Road Lanes', () => {
            beforeEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                const roadLaneDefaults = {
                    volume: 'Trucks',
                    profit: 'Per Truck',
                    prefix: '$',
                }

                cy.navigateToLaneForm(newDealNameForLane)
                cy.navigteToLaneTab('road')
                cy.laneDefaultValues(roadLaneDefaults)
            })

            afterEach(() => {
                cy.deleteLaneAPI(newLaneId, userData)
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            })

            it('Add Road Lane - No Origin/Destination - FTL Load', () => {
                const newLaneForm = {
                    laneVolume: '444',
                    laneRevenue: '4333',
                    laneProfit: '4',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Road FTL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} Trucks | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $1,776`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('road', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Road Lane - With Origin/Destination  - FTL Load', () => {
                const laneFormInputs = {
                    laneOriginRegion: 'East Asia & Oceania',
                    laneOriginCountry: 'Australia',
                    laneOriginLocation: 'SYD - Sydney',
                    laneOriginLocationSearch: 'SYD',
                    laneDestinationRegion: 'The Americas',
                    laneDestinationCountry: 'Canada',
                    laneDestinationLocation: 'TOR - Toronto',
                    laneDestinationLocationSearch: 'TOR',
                }

                const newLaneForm = {
                    laneVolume: '300',
                    laneRevenue: '2000',
                    laneProfit: '5',
                    laneShipperName: 'Shipper',
                    laneConsigneeName: 'ConsigneeNameTest',
                }

                const newLaneData = {
                    laneHeaderText: 'Road FTL',
                    originLocationText: 'Sydney',
                    originLocationCodeText: 'SYD',
                    originLocationCountryText: 'Australia',
                    destinationLocationText: 'Toronto',
                    destinationLocationCodeText: 'TOR',
                    destinationLocationCountryText: 'Canada',
                    volumeText: `${newLaneForm.laneVolume} Trucks | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $1,500`,
                }

                cy.fillForm(laneForm, laneFormInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('road', newLaneId, 'data', newLaneData)
                })
            })

            it('Add Road Lane - European Euro - FTL Load', () => {
                const laneFormInputs = {
                    laneCurrency: 'European Euros',
                }

                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '10000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Road FTL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} Trucks | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €5,000`,
                }

                cy.fillForm(laneForm, laneFormInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('road', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Road Lane - LTL Load', () => {
                const roadLaneData = {
                    laneRoadLoadType: 'LTL',
                }
                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Road LTL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $5,000`,
                }

                cy.fillForm(laneForm, roadLaneData)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('road', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Road Lane - Expedited Load', () => {
                //bug fix
                const newLoadType = {
                    laneRoadLoadType: 'Expedited',
                }

                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Road EXPEDITED',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $5,000`,
                }

                cy.fillForm(laneForm, newLoadType)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('road', newLaneId, 'empty', newLaneData)
                })
            })
        })

        context('editing', () => {
            const newLane = {
                currencyCode: 'HKD',
                profitUnit: 'Per KG',
                profitPercent: 20,
                profitAmount: 20,
                revenue: 4000000,
                volumeAmount: 5000000,
                volumeUnit: 'KGs',
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
                cy.addLaneAPI(dealId, 'Road LTL', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Selecting Edit displays all data on overview and form', () => {
                const newLaneData = {
                    laneHeaderText: 'Road LTL',
                    originLocationText: 'Kowloon',
                    originLocationCodeText: 'KWN',
                    originLocationCountryText: 'Hong Kong',
                    destinationLocationText: 'Tokyo',
                    destinationLocationCodeText: 'TYO',
                    destinationLocationCountryText: 'Japan',
                    volumeText: `${newLane.volumeAmount} KGs | Revenue: HK$${numberWithCommas(newLane.revenue)} | Profit: HK$100,000,000`,
                }

                const newLaneFormData = {
                    currencyPrefix: 'HK$',
                    currencyCode: 'Hong Kong Dollars',
                    volumeText: '5000000',
                    volumeUnit: 'KGs',
                    revenueText: '4000000',
                    profitText: '20',
                    profitUnit: 'Per KG',
                    calculatedRevenue: '100,000,000',
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

                cy.checkLaneAirSeaRoad('road', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.wait(5000)
                cy.laneFormChecker('road', newLaneFormData)
            })

            it('I must be able to edit and changes save', () => {
                const laneFormInputs = {
                    laneRoadLoadType: 'LTL',
                    laneCurrency: 'Chinese Yuan Renminbi',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneOriginCountry: 'China',
                    laneOriginLocation: 'SHG - Shanghai Pt',
                    laneOriginLocationSearch: 'SHG',
                    laneDestinationRegion: 'Europe, Middle East & Africa',
                    laneDestinationCountry: 'United Kingdom',
                    laneDestinationLocation: 'MNC - Manchester',
                    laneDestinationLocationSearch: 'MNC',
                }

                const newLaneForm = {
                    laneVolume: '500000',
                    laneRevenue: '6000000',
                    laneProfit: '10',
                    laneShipperName: 'Edited Shipper',
                    laneConsigneeName: 'Now Manchester City shirts',
                    comment: 'Pep is a fraud',
                }

                const newLaneData = {
                    laneHeaderText: 'Road LTL',
                    originLocationText: 'Shanghai Pt',
                    originLocationCodeText: 'SHG',
                    originLocationCountryText: 'China',
                    destinationLocationText: 'Manchester',
                    destinationLocationCodeText: 'MNC',
                    destinationLocationCountryText: 'United Kingdom',
                    volumeText: `${newLaneForm.laneVolume} KGs | Revenue: ¥${numberWithCommas(newLaneForm.laneRevenue)} | Profit: ¥5,000,000`,
                }

                cy.wait(8000)
                cy.fillForm(laneForm, laneFormInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    cy.checkLaneAirSeaRoad('road', newLaneId, 'data', newLaneData)
                })
            })
        })


        context('remove', () => {
            const newLane = {
                currencyCode: 'INR',
                profitUnit: 'Per Truck',
                profitPercent: 20,
                profitAmount: 20,
                revenue: 5000,
                volumeAmount: 50020,
                volumeUnit: 'Trucks',
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
                cy.addLaneAPI(dealId, 'Road EXPEDITED', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            it('I must be able to remove a Road lane', () => {
                const newLaneData = {
                    laneHeaderText: 'Road EXPEDITED',
                    originLocationText: 'Mumbai (ex Bombay)',
                    originLocationCodeText: 'BOM',
                    originLocationCountryText: 'India',
                    destinationLocationText: 'Paris',
                    destinationLocationCodeText: 'PAR',
                    destinationLocationCountryText: 'France',
                    volumeText: `${newLane.volumeAmount} Trucks | Revenue: INR${numberWithCommas(newLane.revenue)} | Profit: INR1,000,400`,
                }

                cy.checkLaneAirSeaRoad('road', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.deleteLane(newLaneId)
            })
        })
    })
})