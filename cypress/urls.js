const subscriberId = Cypress.env('subscriberId')

export const ACTIVITY_URL = '/Activities/Activities.aspx'

export const DEAL_LIST_URL = '/Deals/DealList/DealList.aspx'

export const DEAL_ADD_URL = `/deals/dealaddedit/dealaddedit.aspx?dealId=0&dealsubscriberid=${subscriberId}&from=deallist`

export const DEAL_EDIT_URL = (id) => `/deals/dealaddedit/dealaddedit.aspx?dealId=${id}&dealsubscriberid=${subscriberId}&from=dealdetail`

export const DEAL_DETAIL_URL = (id) => `/Deals/DealDetail/dealdetail.aspx?dealId=${id}&dealsubscriberId=${subscriberId}`

export const CAMPAIGN_LIST_URL = `/Admin/Campaigns/CampaignList/Campaigns.aspx`

export const COMPANY_LIST_URL = '/Companies/CompanyList/CompanyList.aspx'

export const COMPANY_ADD_URL = '/Companies/CompanyAdd/CompanyAdd.aspx?from=companylist'

export const COMPANY_EDIT_URL = (id) => `/Companies/CompanyAddEdit/CompanyAddEdit.aspx?companyId=${id}&subscriberId=${subscriberId}&from=companydetail`

export const COMPANY_DETAIL_URL = (id) => `/Companies/CompanyDetail/CompanyDetail.aspx?companyId=${id}&subscriberId=${subscriberId}`

export const CONTACT_LIST_URL = '/Contacts/ContactList/ContactList.aspx'

export const CONTACT_ADD_URL = '/Contacts/ContactAddEdit/ContactAddEdit.aspx?contactId=0&pg=1'

export const CONTACT_EDIT_URL = (id) => `/Contacts/ContactAddEdit/ContactAddEdit.aspx?contactId=${id}&subscriberid=${subscriberId}&refId=${id}&from=edit-contact`

export const CONTACT_DETAIL_URL = (id) => `/Contacts/ContactDetail/contactdetail.aspx?contactId=${id}&subscriberid=${subscriberId}`

export const USER_LIST_URL = '/Admin/Users/UserList/UserList.aspx'

export const USER_EDIT_LIST = (id) => `/Admin/Users/UserAddEdit/UserAddEdit.aspx?userId=${id}`

export const LOCATION_LIST_URL = '/Admin/Locations/Locations.aspx'

export const SETTINGS_URL = '/Admin/Settings/Settings.aspx'

export const EVENT_LIST_URL = '/Calendar/Calendar.aspx'

export const REPORT_LIST = '/Reporting/ReportList.aspx'

export const REPORT_ACTIVITIES_BY_DATE_RANGE = '/Reporting/ActivitiesByDateRange/ActivitiesByDateRangeReport.aspx'

export const REPORT_SALES_REP_KPI_REPORT = 'Reporting/KPIs/KPIs.aspx'

export const LOCATION_URL = '/Admin/Locations/Locations.aspx'

export const QUOTES_URL = '/Quotes/QuoteList/QuoteList.aspx'