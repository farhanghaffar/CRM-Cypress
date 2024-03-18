import { DEAL_DETAIL_URL } from '../../urls'
import { laneForm } from '../../forms'
import { stringGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('Sea Lane', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    const newCompanyName = `Lane Testing Company ${stringGen(6)}`
    const newContactName = `Contact Lane Testing ${stringGen(5)}`
    const newDealNameForLane = `Deal Sea Lane Testing ${stringGen(4)}`
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

    describe('Sea lane form testing', () => {
        before(() => {
            cy.navigateToLaneForm(newDealNameForLane)
            cy.navigteToLaneTab('sea')

            const seaLaneDefaults = {
                volume: 'TEUs',
                profit: 'Percentage',
                prefix: '%',
            }

            cy.laneDefaultValues(seaLaneDefaults)
        })

        after(() => {
            cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        })

        describe('validation testing', () => {

            it('Company is pre-enetered into origin shipper field', () => {
                cy.prePopulatedShipper(newCompanyName)
            })

            it('Valume, Revenue and Profit fields show correct validation messages for required', () => {
                cy.laneValidationChecker('sea')
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
                        laneVolume: '15250',
                        laneRevenue: '999',
                        laneProfit: '30',
                    }

                    cy.wait(2000)
                    cy.fillForm(laneForm, newFormInputs)
                })

                it('FCL Profit Update - Volume: TEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '300')
                })

                it('FCL Profit Update - Volume: TEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '30')
                })

                it('FCL Profit Update - Volume: TEUs - Profit: Per TEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Per TEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '457,500')
                })

                it('FCL Profit Update - Volume: FEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.toggleNewVolume('FEUs')
                    cy.wait(2000)
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '300')
                })

                it('FCL Profit Update - Volume: FEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '30')
                })

                it('FCL Profit Update - Volume: FEUs - Profit: Per FEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Per FEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '457,500')
                })
            })

            describe('LCL profit calculation', () => {
                before(() => {
                    const newFormInputs = {
                        laneOceanLoadType: 'LCL',
                        laneVolume: '59000',
                        laneRevenue: '800',
                        laneProfit: '86',
                    }

                    cy.fillForm(laneForm, newFormInputs)
                })

                it('LCL Profit Update - Volume: TEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '688')
                })

                it('LCL Profit Update - Volume: TEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '86')
                })

                it('LCL Profit Update - Volume: TEUs - Profit: Per TEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'TEUs',
                        laneProfitType: 'Per TEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '5,074,000')
                })

                it('LCL Profit Update - Volume: CBMs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Percentage',
                    }

                    cy.toggleNewVolume('CBMs')
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '688')
                })

                it('LCL Profit Update - Volume: CBMs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '86')
                })

                it('LCL Profit Update - Volume: CBMs - Profit: Per CBM', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Per CBM',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '5,074,000')
                })

                it('LCL Profit Update - Volume: FEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.toggleNewVolume('FEUs')
                    cy.wait(2000)
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '688')
                })

                it('LCL Profit Update - Volume: FEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '86')
                })

                it('LCL Profit Update - Volume: FEUs - Profit: Per FEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Per FEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '5,074,000')
                })
            })

            describe('RoRo-Breakbulk profit calculation', () => {
                before(() => {
                    const newFormInputs = {
                        laneOceanLoadType: 'RoRo-Breakbulk',
                        laneVolume: '1000000',
                        laneRevenue: '9000',
                        laneProfit: '95',
                    }

                    cy.fillForm(laneForm, newFormInputs)
                })

                it('RoRo-Breakbulk Profit Update - Volume: CBMs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Percentage',
                    }

                    cy.toggleNewVolume('CBMs')
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '8,550')
                })

                it('RoRo-Breakbulk Profit Update - Volume: CBMs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '95')
                })

                it('RoRo-Breakbulk Profit Update - Volume: CBMs - Profit: Per CBM', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'CBMs',
                        laneProfitType: 'Per CBM',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '95,000,000')
                })

                it('RoRo-Breakbulk Profit Update - Volume: FEUs - Profit: Percentage', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Percentage',
                    }

                    cy.toggleNewVolume('FEUs')
                    cy.wait(2000)
                    cy.profitUpdateChecker(laneForm, newDropdownValue, '8,550')
                })

                it('RoRo-Breakbulk Profit Update - Volume: FEUs - Profit: Flat Rate', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Flat Rate',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '95')
                })

                it('RoRo-Breakbulk Profit Update - Volume: FEUs - Profit: Per FEU', () => {
                    const newDropdownValue = {
                        laneVolumeUnit: 'FEUs',
                        laneProfitType: 'Per FEU',
                    }

                    cy.profitUpdateChecker(laneForm, newDropdownValue, '95,000,000')
                })
            })
        })
    })


    describe('Sea Lane functionality', () => {
        let newLaneId
        before(() => {
            cy.intercept({
                method: 'POST',
                url: '/api/lane/SaveLane/',
            }).as('newLane')
        })

        context('Adding Sea Lanes', () => {
            beforeEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                const seaLaneDefaults = {
                    volume: 'TEUs',
                    profit: 'Percentage',
                    prefix: '%',
                }

                cy.navigateToLaneForm(newDealNameForLane)
                cy.navigteToLaneTab('sea')
                cy.laneDefaultValues(seaLaneDefaults)
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            afterEach(() => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
            })

            it('Add Sea Lane - No Origin/Destination - FCL Load', () => {
                const newLaneForm = {
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Ocean FCL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $2,500`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('sea', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Sea Lane - With Origin/Destination - FCL Load', () => {
                const seaLaneInputs = {
                    laneOriginRegion: 'The Americas',
                    laneOriginCountry: 'Peru',
                    laneOriginLocation: 'LIM - Lima',
                    laneOriginLocationSearch: 'LIM',
                    laneDestinationRegion: 'Europe, Middle East & Africa',
                    laneDestinationCountry: 'Germany',
                    laneDestinationLocation: 'AUO - Audorf',
                    laneDestinationLocationSearch: 'AUO',
                }

                const newLaneForm = {
                    laneVolume: '300',
                    laneRevenue: '2000',
                    laneProfit: '5',
                    laneShipperName: 'Shipper Name Sea Lane',
                    laneConsigneeName: 'ConsigneeNameTest',
                }

                const newLaneData = {
                    laneHeaderText: 'Ocean FCL',
                    originLocationText: 'Lima',
                    originLocationCodeText: 'LIM',
                    originLocationCountryText: 'Peru',
                    destinationLocationText: 'Audorf',
                    destinationLocationCodeText: 'AUO',
                    destinationLocationCountryText: 'Germany',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $100`,
                }

                cy.fillForm(laneForm, seaLaneInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('sea', newLaneId, 'data', newLaneData)
                })
            })

            it('Add Sea Lane - European Euro - FCL Load', () => {
                const seaLaneInputs = {
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
                    laneHeaderText: 'Ocean FCL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: €${numberWithCommas(newLaneForm.laneRevenue)} | Profit: €5,000`,
                }

                cy.fillForm(laneForm, seaLaneInputs)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('sea', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Sea Lane - LCL Load', () => {
                const newLaneForm = {
                    laneOceanLoadType: 'LCL',
                    laneVolume: '100',
                    laneRevenue: '5000',
                    laneProfit: '50',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneConsigneeName: 'Test',
                    laneDestinationRegion: 'The Americas'
                }

                const newLaneData = {
                    laneHeaderText: 'Ocean LCL',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $2,500`,
                }

                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('sea', newLaneId, 'empty', newLaneData)
                })
            })

            it('Add Sea Lane - RoRo-Breakbulk Load', () => {
                const newLoadType = {
                    laneOceanLoadType: 'RoRo-Breakbulk',
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
                    laneHeaderText: 'Ocean RORO',
                    originLocationText: '',
                    originLocationCodeText: '',
                    originLocationCountryText: 'Various',
                    destinationLocationText: '',
                    destinationLocationCodeText: '',
                    destinationLocationCountryText: 'Various',
                    volumeText: `${newLaneForm.laneVolume} CBMs | Revenue: $${numberWithCommas(newLaneForm.laneRevenue)} | Profit: $2,500`,
                }

                cy.fillForm(laneForm, newLoadType)
                cy.addLane(newLaneForm).then((xhr) => {
                    console.log(xhr.response.body)
                    newLaneId = xhr.response.body
                    cy.checkLaneAirSeaRoad('sea', newLaneId, 'empty', newLaneData)
                })
            })
        })

        context('editing', () => {
            const newLane = {
                currencyCode: 'JPY',
                profitUnit: 'Per TEU',
                profitPercent: 20,
                profitAmount: 20,
                revenue: 5000,
                volumeAmount: 1000,
                volumeUnit: 'TEUs',
                shippingFrequency: 'Per Month',
                originCompany: newCompanyName,
                origenCountryCode: 'JP',
                originRegion: 'East Asia & Oceania',
                originCode: '',
                originUnlocoCode: 'FKJ|JP|Japan',
                destinationCompany: 'Manchester United Shirts',
                destinationCountryCode: 'UK',
                destinationRegion: 'Europe, Middle East & Africa',
                destinationCode: '',
                destinationUnlocoCode: 'MSC|UK|United Kingdom',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'Phil Jones the goat',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Ocean FCL', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            after(() => {
                cy.deleteLaneAPI(newLaneId, userData)
            })

            it('Selecting Edit displays all data on overview and form', () => {
                const newLaneData = {
                    laneHeaderText: 'Ocean FCL',
                    originLocationText: 'Fukui',
                    originLocationCodeText: 'FKJ',
                    originLocationCountryText: 'Japan',
                    destinationLocationText: 'Manchester Ship Canal, Salford',
                    destinationLocationCodeText: 'MSC',
                    destinationLocationCountryText: 'United Kingdom',
                    volumeText: `${newLane.volumeAmount} TEUs | Revenue: ¥${numberWithCommas(newLane.revenue)} | Profit: ¥20,000`,
                }

                const newLaneFormData = {
                    currencyPrefix: '¥',
                    currencyCode: 'Japanese Yen',
                    volumeText: '1000',
                    volumeUnit: 'TEUs',
                    revenueText: '5000',
                    profitText: '20',
                    profitUnit: 'Per TEU',
                    calculatedRevenue: '20,000',
                    originCompanyName: newCompanyName,
                    originRegionText: 'East Asia & Oceania',
                    originCountryText: 'Japan',
                    originLocationText: 'FKJ - Fukui',
                    destinationCompanyName: 'Manchester United Shirts',
                    destinationRegionText: 'Europe, Middle East & Africa',
                    destinationCountryText: 'United Kingdom',
                    destinationLocationText: 'MSC - Manchester Ship Canal, Salford',
                    content3pl: '',
                    serviceLocationValue: '',
                    specialRequirementsValue: '',
                    barcodeChecked: false,
                    trackAndTraceChecked: false,
                    pickUpChecked: false,
                    laneCommentText: 'Phil Jones the goat',
                }

                cy.checkLaneAirSeaRoad('sea', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.laneFormChecker('sea', newLaneFormData)
            })

            it('I must be able to edit and changes save', () => {
                const currency = {
                    laneCurrency: 'Chinese Yuan Renminbi',
                    laneOriginRegion: 'East Asia & Oceania',
                    laneOriginCountry: 'China',
                    laneOriginLocation: 'SHG - Shanghai Pt',
                    laneOriginLocationSearch: 'SHG',
                    laneDestinationRegion: 'Europe, Middle East & Africa',
                    laneDestinationCountry: 'United Kingdom',
                    laneDestinationLocation: 'MNC - Manchester',
                    laneDestinationLocationSearch: 'MNC',
                    laneOceanLoadType: 'LCL'
                }

                const newLaneForm = {
                    laneVolume: '500000',
                    laneRevenue: '300000',
                    laneProfit: '85',
                    laneShipperName: 'Edited Shipper',
                    laneConsigneeName: 'Now Manchester City shirts',
                    comment: 'Pep is a fraud',
                }

                const newLaneData = {
                    laneHeaderText: 'Ocean LCL',
                    originLocationText: 'Shanghai Pt',
                    originLocationCodeText: 'SHG',
                    originLocationCountryText: 'China',
                    destinationLocationText: 'Manchester',
                    destinationLocationCodeText: 'MNC',
                    destinationLocationCountryText: 'United Kingdom',
                    volumeText: `${newLaneForm.laneVolume} TEUs | Revenue: ¥${numberWithCommas(newLaneForm.laneRevenue)} | Profit: ¥255,000`,
                }

                // workaround, need to change
                cy.fillForm(laneForm, currency)
                cy.addLane(newLaneForm).then((xhr) => {
                    cy.checkLaneAirSeaRoad('sea', newLaneId, 'data', newLaneData)
                })
            })
        })


        context('remove', () => {
            const newLane = {
                currencyCode: 'IDR',
                profitUnit: 'Flat Rate',
                profitPercent: 283,
                profitAmount: 283,
                revenue: 50000,
                volumeAmount: 1000000,
                volumeUnit: 'CBMs',
                shippingFrequency: 'Per Month',
                originCompany: newCompanyName,
                origenCountryCode: 'ID',
                originRegion: 'South East Asia',
                originCode: '',
                originUnlocoCode: 'BPN|ID|Indonesia',
                destinationCompany: 'Starbucks',
                destinationCountryCode: 'US',
                destinationRegion: 'The Americas',
                destinationCode: '',
                destinationUnlocoCode: 'SEA|US|United States',
                recieve3pl: '',
                requirements: '',
                serviceLocation: '',
                barcode: false,
                track: false,
                pickUpAtWarehouse: false,
                comment: 'COFFEE',
            }

            before(() => {
                cy.addLaneAPI(dealId, 'Ocean RORO', newLane, userData).then((response) => {
                    newLaneId = response.body
                    cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
                })
            })

            it('I must be able to remove a Sea lane', () => {
                const newLaneData = {
                    laneHeaderText: 'Ocean RORO',
                    originLocationText: 'Balikpapan',
                    originLocationCodeText: 'BPN',
                    originLocationCountryText: 'Indonesia',
                    destinationLocationText: 'Seattle',
                    destinationLocationCodeText: 'SEA',
                    destinationLocationCountryText: 'United States',
                    volumeText: `${newLane.volumeAmount} CBMs | Revenue: Rp${numberWithCommas(newLane.revenue)} | Profit: Rp283`,
                }

                cy.checkLaneAirSeaRoad('sea', newLaneId, 'data', newLaneData)
                cy.editLane(newLaneId, subscriberId)
                cy.deleteLane(newLaneId)
            })
        })
    })
})