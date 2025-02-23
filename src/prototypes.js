import { cssvar, scrollToElement, checkError, getErrors } from './../utils/helpers'

export function setupGlobalProperties(app) {
    app.config.globalProperties.$cssvar = cssvar
    app.config.globalProperties.$scrollToElement = scrollToElement
    app.config.globalProperties.$checkError = checkError
    app.config.globalProperties.$getErrors = getErrors
}
