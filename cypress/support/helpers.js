export const stringGen = (len) => {
  let text = ''

  const charset = 'abcdefghijklmnopqrstuvwxyz'
  let i

  for (i = 0; i < len; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return text
}

export const numGen = (len) => {
  let text = ''

  const charset = '123456789'
  let i

  for (i = 0; i < len; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return text
}

export const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const listSpecificDataTypes = (salesStage, dataType, userData) => {
  let dataArray = []

  cy.listDealData(salesStage, userData).then((response) => {
    const body = response.body
    const dealData = {
      deals: body.Deals,
    }
    const { deals } = dealData

    if (deals.length == 0) {
      return 0
    }

    let i

    for (i = 0; i < deals.length; i++) {
      let dataObj

      switch (dataType) {
        case 'names':
          dataObj = deals[i].DealName
          break
        case 'id':
          dataObj = deals[i].DealId
          break
        case 'dealTypes':
          dataObj = deals[i].SalesStageName
          break
      }
      dataArray.push(dataObj)

    }
    Cypress.log(dataArray)

  })

  return dataArray
}

export const convertFirstCharOfStringToUpperCase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}