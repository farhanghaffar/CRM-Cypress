export const contactForm = {
  firstName: {
    id: 'contactAddEdit_txtFirstName',
    type: 'input',
  },
  lastName: {
    id: 'contactAddEdit_txtLastName',
    type: 'input',
  },
  email: {
    id: 'contactAddEdit_txtEmail',
    type: 'input',
  },
  jobTitle: {
    id: 'contactAddEdit_txtJobTitle',
    type: 'input',
  },
  language: {
    id: 'contactAddEdit_Languages',
    type: 'input',
  },
  birthday: {
    id: 'contactAddEdit_Birthday',
    type: 'date_select',
  },
  address: {
    id: 'contactAddEdit_txtAddress',
    type: 'input',
  },
  city: {
    id: 'contactAddEdit_txtCity',
    type: 'input',
  },
  state: {
    id: 'contactAddEdit_txtStateProvince',
    type: 'input',
  },
  postalCode: {
    id: 'contactAddEdit_txtPostalCode',
    type: 'input',
  },
  country: {
    id: 'contactAddEdit_ddlCountry',
    type: 'select',
    option: { force: true },
  },
  businessPhone: {
    id: 'contactAddEdit_txtBusinessPhone',
    type: 'input',
  },
  mobilePhone: {
    id: 'contactAddEdit_txtMobile',
    type: 'input',
  },
  interests: {
    id: 'contactAddEdit_txtHobbies',
    type: 'input',
  },
  notes: {
    id: 'contactAddEdit_Notes',
    type: 'input',
  },
  isEmail: {
    id: 'OktoEmail',
    type: 'checkbox',
  },
  isCall: {
    id: 'OktoCall',
    type: 'checkbox',
  },
  isMarried: {
    id: 'Married',
    type: 'checkbox',
  },
  isHolidayCard: {
    id: 'HolidayCard',
    type: 'checkbox',
  },
  isHasChildren: {
    id: 'HasChildren',
    type: 'checkbox',
  },
  isFormerEmployee: {
    id: 'FormerEmployee',
    type: 'checkbox',
  },
  company: {
    id: 'contactAddEdit_ddlCompany',
    type: 'select2select',
  },
}

export const dealForm = {
  dealName: {
    id: 'txtDealName',
    type: 'input',
  },
  dealCompany: {
    id: 'ddlCompany',
    type: 'select2select',
  },
  dealType: {
    id: 'ddlDealType',
    type: 'select',
    option: { force: true },
  },
  dealOwner: {
    id: 'ddlDealOwner',
    type: 'select',
    option: { force: true },
  },
  dealStage: {
    id: 'ddlSalesStage',
    type: 'select',
    option: { force: true },
  },
  dealContact: {
    id: 'ddlContact',
    type: 'select2select',
  },
  dealIncoterms: {
    id: 'ddlIncoterms',
    type: 'select',
    option: { force: true },
  },
  wonLostReason: {
    id: 'ddlWonLostReason',
    type: 'select',
    option: { force: true },
  },
  dealCompetitor: {
    id: 'ddlCompetitors',
    type: 'select',
    option: { force: true },
  },
  dealCommodities: {
    id: 'ddlCommodities',
    type: 'select',
    option: { force: true },
  },
  dealProposalDate: {
    id: 'txtProposalDate',
    type: 'date_select',
  },
  dealDecisionDate: {
    id: 'txtDecisionDate',
    type: 'date_select',
  },
  dealFirstshipmentDate: {
    id: 'txtFirstShipmentDate',
    type: 'date_select',
  },
  dealContractEndDate: {
    id: 'txtContractEndDate',
    type: 'date_select',
  },
  dealIndustry: {
    id: 'ddlIndustry',
    type: 'select',
    option: { force: true },
  },
  dealCampaign: {
    id: 'ddlCampaign',
    type: 'select',
    option: { force: true },
  },
  dealComment: {
    id: 'txtComments',
    type: 'input',
  },
}

export const companyForm = {
  companyName: {
    id: 'txtCompanyName',
    type: 'input',
  },
  companyType: {
    id: 'ddlCompanyType',
    type: 'select',
    option: { force: true },
  },
  division: {
    id: 'txtDivision',
    type: 'input',
  },
  owner: {
    id: 'ddlOwner',
    type: 'select',
    option: { force: true },
  },
  industry: {
    id: 'ddlIndustry',
    type: 'select',
    option: { force: true },
  },
  companyCode: {
    id: 'txtCompanyCode',
    type: 'input',
  },
  phone: {
    id: 'txtPhone',
    type: 'input',
  },
  fax: {
    id: 'txtFax',
    type: 'input',
  },
  source: {
    id: 'ddlSource',
    type: 'select',
    option: { force: true },
  },
  campaign: {
    id: 'ddlCampaign',
    type: 'select',
    option: { force: true },
  },
  address: {
    id: 'txtAddress',
    type: 'input',
  },
  city: {
    id: 'txtCity',
    type: 'input',
  },
  state: {
    id: 'txtStateProvince',
    type: 'input',
  },
  postalCode: {
    id: 'txtPostalCode',
    type: 'input',
  },
  country: {
    id: 'ddlCountry',
    type: 'select',
    option: { force: true },
  },
  website: {
    id: 'txtWebsite',
    type: 'input',
  },
  note: {
    id: 'Notes',
    type: 'input',
  },
}

export const eventForm = {
  eventTitle: {
    id: 'txtEventTitle',
    type: 'input',
  },
  eventCompany: {
    id: 'ddlCompany',
    type: 'select2select',
  },
  eventType: {
    id: 'ddlCategories',
    type: 'select',
    option: { force: true },
  },
  // eventDeal
  eventLocation: {
    id: 'txtLocation',
    type: 'input',
  },
  eventStartDate: {
    id: 'txtStartDate',
    type: 'date_select',
  },
  eventEndDate: {
    id: 'txtEndDate',
    type: 'date_select',
  },
  eventStartTime: {
    id: 'ddlStartTime',
    type: 'input',
    option: { force: true },
  },
  eventEndTime: {
    id: 'ddlEndTime',
    type: 'input',
    option: { force: true },
  },
  eventRepeats: {
    id: 'ddlRepeat',
    type: 'select',
    option: { force: true },
  },
  eventReminder: {
    id: 'ddlReminder',
    type: 'select',
    option: { force: true },
  },
}

export const taskForm = {
  taskTitle: {
    id: 'TaskAddEdit_txtName',
    type: 'input',
  },
  // eventCompany
  taskDescription: {
    id: 'TaskAddEdit_txtDescription',
    type: 'input',
  },
  taskDueDate: {
    id: 'TaskAddEdit_txtDueDate',
    type: 'date_select',
  },
  taskAssignedTo: {
    id: 'TaskAddEdit_ddlSalesRep',
    type: 'select2select',
  },
}

export const taskFormCal = {
  taskTitle: {
    id: 'TaskAddEdit_txtName',
    type: 'input',
  },
  // eventCompany
  taskDescription: {
    id: 'TaskAddEdit_txtDescription',
    type: 'input',
  },
  taskDueDate: {
    id: 'TaskAddEdit_txtDueDate',
    type: 'date_select',
  },
  taskAssignedTo: {
    id: 'TaskAddEdit_ddlSalesRep',
    type: 'select2select',
  },

  taskCompany: {
    id: 'TaskAddEdit_ddlCompany',
    type: 'select2select',
  },

  taskDeal: {
    id: 'TaskAddEdit_ddlDeal',
    type: 'select2select',
  },

  taskContact: {
    id: 'TaskAddEdit_ddlContact',
    type: 'select2select',
  },
}

export const noteForm = {
  note: {
    id: 'NoteAddEdit_txtNote_edit',
    type: 'input',
  },
}

export const documentForm = {
  docTitle: {
    id: 'DetailTabDocumentsAddEdit_txtDocumentTitle',
    type: 'input',
  },
  docDescription: {
    id: 'DetailTabDocumentsAddEdit_txtDocumentDescription',
    type: 'input',
  },
}

export const userForm = {
  firstName: {
    id: 'txtFirstName',
    type: 'input',
  },
  lastName: {
    id: 'txtLastName',
    type: 'input',
  },
  email: {
    id: 'txtEmailAddress',
    type: 'input',
  },
  jobTitle: {
    id: 'txtJobTitle',
    type: 'input',
  },
  billingCode: {
    id: 'txtBillingCode',
    type: 'input',
  },
  phone: {
    id: 'txtPhone',
    type: 'get',
  },
  mobile: {
    id: 'txtMobile',
    type: 'input',
  },
  fax: {
    id: 'txtFax',
    type: 'input',
  },
  location: {
    id: 'ddlLocation',
    type: 'select',
    option: { force: true },
  },
  address: {
    id: 'txtAddress',
    type: 'input',
  },
  city: {
    id: 'txtCity',
    type: 'input',
  },
  state: {
    id: 'txtStateProvince',
    type: 'input',
  },
  postalCode: {
    id: 'txtPostalCode',
    type: 'input',
  },
  country: {
    id: 'ddlCountry',
    type: 'select',
    option: { force: true },
  },
  displayLanguage: {
    id: 'ddlDisplayLanguage',
    type: 'select',
    option: { force: true },
  },
  spokenLanguage: {
    id: 'txtSpokenLanguage',
    type: 'input',
  },
  dateFormat: {
    id: 'ddlDateFormat',
    type: 'select',
    option: { force: true },
  },
  reportDateFormat: {
    id: 'ddlReportDateFormat',
    type: 'select',
    option: { force: true },
  },
  currency: {
    id: 'ddlCurrency',
    type: 'select',
    option: { force: true },
  },
  timezone: {
    id: 'ddlTimezone',
    type: 'select',
    option: { force: true },
  },
}

export const activitiesByDateRangeForm = {
  fromDate: {
    id: 'reportFiltersdateRangePicker',
    type: 'input',
  },
  eventToggle: {
    id: '.filter-check-boxes > span:nth-of-type(1) .icheckbox_square-green',
    type: 'toggle',
  },
  tasksToggle: {
    id: '.filter-check-boxes > span:nth-of-type(2) .icheckbox_square-green',
    type: 'toggle',
  },
  notesToggle: {
    id: '.filter-check-boxes > span:nth-of-type(3) .icheckbox_square-green',
    type: 'toggle',
  },
  country: {
    id: 'ddlCountry',
    type: 'select',
    option: { force: true },
  },
  location: {
    id: 'ddlLocation',
    type: 'select',
    option: { force: true },
  },
  competitors: {
    id: 'ddlCompetitors',
    type: 'select',
    option: { force: true },
  },
  company: {
    id: 'ddlCompany',
    type: 'select2select',
  },
  campaign: {
    id: 'ddlCampaigns',
    type: 'select',
    option: { force: true },
  },
  dealType: {
    id: 'ddlDealType',
    type: 'select',
    option: { force: true },
  },
}

export const laneForm = {
  laneOceanLoadType: {
    id: 'ddlLoadOcean',
    type: 'select',
    option: { force: true },
  },
  laneRoadLoadType: {
    id: 'ddlLoadRoad',
    type: 'select',
    option: { force: true },
  },
  laneRailLoadType: {
    id: 'ddlLoadRail',
    type: 'select',
    option: { force: true },
  },
  laneVolume: {
    id: 'txtVolume',
    type: 'input',
  },
  laneVolumeUnit: {
    id: 'ddlVolumeUnit',
    type: 'select',
    option: { force: true },
  },
  laneShipFreq: {
    id: 'ddlShipmentFrequency',
    type: 'select',
    option: { force: true },
  },
  laneRevenue: {
    id: 'txtRevenue',
    type: 'input',
  },
  laneProfit: {
    id: 'txtProfit',
    type: 'input',
  },
  laneProfitType: {
    id: 'ddlProfitType',
    type: 'select',
    option: { force: true },
  },
  laneCurrency: {
    id: 'ddlCurrency',
    type: 'select',
    option: { force: true },
  },
  laneShipperName: {
    id: 'txtOriginShipper',
    type: 'input',
  },
  laneOriginRegion: {
    id: 'ddlOriginRegion',
    type: 'select',
    option: { force: true },
  },
  laneOriginCountry: {
    id: 'ddlOriginCountry',
    type: 'select',
    option: { force: true },
  },
  laneOriginLocation: {
    id: 'ddlOriginLocation',
    type: 'select2select',
  },
  laneConsigneeName: {
    id: 'txtConsigneeName',
    type: 'input',
  },
  laneDestinationRegion: {
    id: 'ddlDestinationRegion',
    type: 'select',
    option: { force: true },
  },
  laneDestinationCountry: {
    id: 'ddlDestinationCountry',
    type: 'select',
    option: { force: true },
  },
  laneDestinationLocation: {
    id: 'ddlDestinationLocation',
    type: 'select2select',
  },
  laneRecieveFrom3PL: {
    id: 'ddlReceive',
    type: 'select',
    option: { force: true },
  },
  laneServiceLocation: {
    id: 'ddlServiceLocation',
    type: 'select',
    option: { force: true },
  },
  laneSpecialRequirements: {
    id: 'ddlSpecialRequirements',
    type: 'select',
    option: { force: true },
  },
  laneBarcode: {
    id: 'chkRequireBarcode',
    type: 'checkbox',
  },
  laneTrackAndTrace: {
    id: 'chkTracking',
    type: 'checkbox',
  },
  lanePickUp: {
    id: 'chkCustomerPickup',
    type: 'checkbox',
  },
  comment: {
    id: 'txtComments',
    type: 'input',
  },
}

export const locationRegionForm = {
  regionName: {
    id: 'txtRegionName',
    type: 'input',
  },
}

export const locationCompanyLocationsForm = {
  locationName: {
    id: 'txtLocationName',
    type: 'input',
  },

  locationCode: {
    id: 'txtLocationCode',
    type: 'input',
  },

  locationType: {
    id: 'ddlLocationType',
    type: 'select',
    option: { force: true },
  },

  locationAddress: {
    id: 'txtAddress',
    type: 'input',
  },

  locationCity: {
    id: 'txtCity',
    type: 'input',
  },

  locationState: {
    id: 'txtStateProvince',
    type: 'input',
  },

  locationPostCode: {
    id: 'txtPostalCode',
    type: 'input',
  },

  locationPhone: {
    id: 'txtPhone',
    type: 'input',
  },

  locationFax: {
    id: 'txtFax',
    type: 'input',
  },

  locationComments: {
    id: 'txtComments',
    type: 'input',
  },

  locationDistrict: {
    id: 'ddlDistrict',
    type: 'select',
    option: { force: true },
  },

  locationCountry: {
    id: 'ddlCountry',
    type: 'select',
    option: { force: true },
  },

  locationRegion: {
    id: 'ddlRegion',
    type: 'select',
    option: { force: true },
  }
}

export const locationDistrictForm = {
  districtName: {
    id: 'txtDistrictName',
    type: 'input',
  },

  districtCode: {
    id: 'txtDistrictCode',
    type: 'input',
  },

  districtCountry: {
    id: 'ddlCountry',
    type: 'select',
    option: { force: true },
  }
}

export const locationGlobalLocationsForm = {
  globalLocationName: {
    id: 'txtLocationName',
    type: 'input',
  },

  globalLocationCode: {
    id: 'txtLocationCode',
    type: 'input',
  },

  globalLocationCountry: {
    id: 'ddlCountry',
    type: 'select',
    option: { force: true },
  },

  isAirport: {
    id: 'chkAirport',
    type: 'checkbox',
  },

  isInlandPort: {
    id: 'chkInlandPort',
    type: 'checkbox',
  },

  isMultiModal: {
    id: 'chkMultiModal',
    type: 'checkbox',
  },

  isRailTerminal: {
    id: 'chkRailTerminal',
    type: 'checkbox',
  },

  isRoadTerminal: {
    id: 'chkRoadTerminal',
    type: 'checkbox',
  },

  isSeaPort: {
    id: 'chkSeaport',
    type: 'checkbox',
  },
}

export const campaignsForm = {
  campaignName: {
    id: 'txtCampaignName',
    type: 'input',
  },

  campaignNumber: {
    id: 'txtCampaignNumber',
    type: 'input',
  },

  campaignType: {
    id: 'ddlCampaignType',
    type: 'select',
    option: { force: true },
  },

  campaignStartDate: {
    id: 'txtStartDate',
    type: 'date_select',
  },

  campaignEndDate: {
    id: 'txtEndDate',
    type: 'date_select',
  },

  campaignOwner: {
    id: 'ddlCampaignOwner',
    type: 'select',
    option: { force: true },
  },

  campaignComments: {
    id: 'txtComments',
    type: 'input',
  }
}

export const quotesForm = {
  quoteName: {
    id: 'QuoteAddEdit_txtQuoteName',
    type: 'input',
  },

  quoteStatus: {
    id: 'QuoteAddEdit_ddlQuoteStatus',
    type: 'select',
    option: { force: true },
  },

  quoteCode: {
    id: 'QuoteAddEdit_txtQuoteCode',
    type: 'input',
  },

  quoteMode: {
    id: 'QuoteAddEdit_ddlQuoteMode',
    type: 'select',
    option: { force: true },
  },

  quoteCompany: {
    id: 'QuoteAddEdit_ddlGlobalCompany',
    type: 'select2select',
  },

  quoteContact: {
    id: 'QuoteAddEdit_ddlContact',
    type: 'select2select'
  },

  quoteDeal: {
    id: 'QuoteAddEdit_ddlGlobalDeal',
    type: 'select2select'
  },

  quoteValidTo: {
    id: 'QuoteAddEdit_txtQuoteValidTo',
    type: 'input',
  },

  quoteAmount: {
    id: 'QuoteAddEdit_txtAmount',
    type: 'input',
  },

  quoteDetails: {
    id: 'QuoteAddEdit_txtQuoteDetails',
    type: 'input',
  },

  quoteConditions: {
    id: 'QuoteAddEdit_txtQuoteConditions',
    type: 'input',
  },

  quoteNotes: {
    id: 'QuoteAddEdit_txtQuoteNotes',
    type: 'input',
  },
}